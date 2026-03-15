// ── Role types ────────────────────────────────────────────────────────────────

export type UserRole = "tenant_admin" | "analyst" | "reviewer" | "viewer" | "vendor_admin";

/** Roles that exist within a tenant (used for invitations and user management) */
export type TenantRole = "tenant_admin" | "analyst" | "reviewer" | "viewer";

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
  email_verified: boolean;
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

/** Invite-based account creation */
export interface AcceptInviteRequest {
  token: string;
  full_name: string;
  password: string;
}

/** Self-service workspace signup */
export interface SignupRequest {
  email: string;
  password: string;
  full_name?: string;
  workspace_name?: string;
  /** Defaults to "free" if omitted */
  plan?: "free" | "pro" | "business";
}

/** Initiates a Stripe Checkout session for Pro or Business plan signup */
export interface CheckoutRequest {
  email: string;
  password: string;
  full_name?: string;
  workspace_name?: string;
  plan: "pro" | "business";
}

export interface CheckoutResponse {
  checkout_url: string;
  pending_id: string;
}

export interface CheckoutStatusResponse {
  status: "pending" | "created" | "error";
  /** Only present when status === "created" */
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}
