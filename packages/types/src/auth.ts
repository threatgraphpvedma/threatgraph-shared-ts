// ── Role types ────────────────────────────────────────────────────────────────

export type TenantRole = "tenant_admin" | "analyst" | "reviewer" | "viewer";
export type PlatformRole = "vendor_admin";
export type UserRole = PlatformRole | TenantRole;

// ── User ──────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  tenant_id: string;
  is_active: boolean;
  is_verified: boolean;
  is_vendor_admin: boolean;
  created_at: string;
}

// ── Token types ───────────────────────────────────────────────────────────────

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

/** Raw snake_case response from the backend before normalization */
export interface RawTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// ── Request types ─────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

/** Phase A: invite-based account creation (no self-registration) */
export interface AcceptInviteRequest {
  token: string;
  full_name: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}
