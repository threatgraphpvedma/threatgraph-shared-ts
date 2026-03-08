import type { TenantRole } from "./auth";

// ── Tenant plan ───────────────────────────────────────────────────────────────

export type TenantPlan = "free" | "starter" | "pro" | "enterprise";

// ── Tenant list / detail ──────────────────────────────────────────────────────

export interface TenantOut {
  id: string;
  name: string;
  slug: string;
  plan: TenantPlan;
  is_active: boolean;
  user_count: number;
  job_count: number;
  storage_bytes: number;
  created_at: string;
}

export interface UserSummary {
  id: string;
  email: string;
  full_name: string | null;
  role: TenantRole;
  is_active: boolean;
  last_login_at: string | null;
}

export interface TenantDetail extends TenantOut {
  users: UserSummary[];
  settings: Record<string, unknown>;
}

export interface TenantListResponse {
  items: TenantOut[];
  total: number;
}

// ── Platform stats ────────────────────────────────────────────────────────────

export interface PlatformStats {
  tenant_count: number;
  active_tenants: number;
  total_users: number;
  active_users: number;
  total_jobs: number;
  jobs_today: number;
  jobs_this_month: number;
  total_storage_bytes: number;
}

// ── Request types ─────────────────────────────────────────────────────────────

export interface CreateTenantRequest {
  name: string;
  slug?: string;
  plan?: TenantPlan;
}

export interface UpdateTenantRequest {
  name?: string;
  plan?: TenantPlan;
  settings?: Record<string, unknown>;
}

export interface InviteTenantAdminRequest {
  email: string;
  full_name?: string;
}
