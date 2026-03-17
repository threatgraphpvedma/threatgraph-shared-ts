/**
 * createClient — shared Axios instance factory.
 *
 * Creates a pre-configured Axios client with:
 *   - Correct base URL (VITE_API_URL env or same-origin)
 *   - Automatic Bearer token injection from localStorage (Zustand `auth-storage` key)
 *   - Silent 401 → token refresh → retry queue
 *   - Redirect to /login on refresh failure
 *
 * Usage in each app:
 *   import { createApiClient } from "@threatgraph/api-client";
 *   export const apiClient = createApiClient(import.meta.env.VITE_API_URL ?? "");
 */
import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

function makeTokenHelpers(storageKey: string) {
  function getStoredToken(field: "accessToken" | "refreshToken"): string | null {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { state?: Record<string, unknown> };
      return (parsed?.state?.[field] as string) ?? null;
    } catch {
      return null;
    }
  }

  function setStoredTokens(accessToken: string, refreshToken: string): void {
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed: { state?: Record<string, unknown> } = raw ? JSON.parse(raw) : {};
      parsed.state = {
        ...(parsed.state ?? {}),
        accessToken,
        refreshToken,
        isAuthenticated: true,
      };
      localStorage.setItem(storageKey, JSON.stringify(parsed));
    } catch {
      // ignore
    }
  }

  function clearStoredTokens(): void {
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed: { state?: Record<string, unknown> } = raw ? JSON.parse(raw) : {};
      parsed.state = {
        ...(parsed.state ?? {}),
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        user: null,
      };
      localStorage.setItem(storageKey, JSON.stringify(parsed));
    } catch {
      // ignore
    }
  }

  return { getStoredToken, setStoredTokens, clearStoredTokens };
}

export function createApiClient(
  apiBase: string,
  storageKey: string = "auth-storage",
  onTokensRefreshed?: (accessToken: string, refreshToken: string) => void,
): AxiosInstance {
  const { getStoredToken, setStoredTokens, clearStoredTokens } =
    makeTokenHelpers(storageKey);
  // Do NOT set a global Content-Type default here.
  // Axios auto-detects the correct Content-Type per request:
  //   - Plain objects / strings → "application/json"
  //   - FormData               → "multipart/form-data; boundary=..."
  // Setting "application/json" globally would cause FormData to be
  // JSON-serialised instead of sent as multipart (the browser-provided
  // boundary would be missing, breaking all file uploads with 422).
  const client = axios.create({
    baseURL: `${apiBase}/api/v1`,
    withCredentials: false,
  });

  // ── Request interceptor: inject access token ────────────────────────────────
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getStoredToken("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // ── Response interceptor: silent token refresh on 401 ──────────────────────
  let isRefreshing = false;
  let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (err: unknown) => void;
  }> = [];

  function processQueue(error: unknown, token: string | null) {
    failedQueue.forEach(({ resolve, reject }) => {
      if (error) reject(error);
      else resolve(token!);
    });
    failedQueue = [];
  }

  client.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return client(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getStoredToken("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post<{
          access_token: string;
          refresh_token: string;
        }>(`${apiBase}/api/v1/auth/refresh`, { refresh_token: refreshToken });

        setStoredTokens(data.access_token, data.refresh_token);
        onTokensRefreshed?.(data.access_token, data.refresh_token);
        processQueue(null, data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return client(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearStoredTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );

  return client;
}
