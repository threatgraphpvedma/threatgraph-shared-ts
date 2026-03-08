import type { TenantRole } from "./auth";

// ── Invitable roles (tenant_admin can invite these) ───────────────────────────

export type InvitableRole = TenantRole; // tenant_admin | analyst | reviewer | viewer

// ── Invitations ───────────────────────────────────────────────────────────────

export interface Invitation {
  id: string;
  email: string;
  role: InvitableRole;
  invited_by_email: string | null;
  created_at: string;
  expires_at: string;
  accepted_at: string | null;
}

export interface InvitationListResponse {
  items: Invitation[];
  total: number;
}

export interface InviteUserRequest {
  email: string;
  role: InvitableRole;
}

// ── User management ───────────────────────────────────────────────────────────

export interface UserListItem {
  id: string;
  email: string;
  full_name: string | null;
  role: TenantRole;
  is_active: boolean;
  last_login_at: string | null;
  invited_by_email: string | null;
  created_at: string;
}

export interface UserListResponse {
  items: UserListItem[];
  total: number;
}

export interface UpdateUserRequest {
  role?: InvitableRole;
  is_active?: boolean;
}

// ── Tenant settings ───────────────────────────────────────────────────────────

export interface TenantSettings {
  name: string;
  plan: string;
  is_active: boolean;
  settings: Record<string, unknown>;
}

export interface TenantSettingsUpdate {
  name?: string;
  settings?: Record<string, unknown>;
}

// ── Usage stats ───────────────────────────────────────────────────────────────

export interface UsageStats {
  user_count: number;
  active_user_count: number;
  total_jobs: number;
  jobs_this_month: number;
  storage_bytes: number;
}

// ── API keys ──────────────────────────────────────────────────────────────────

export interface ApiKey {
  id: string;
  name: string;
  /** Displayable key prefix, e.g. "sk-a1b2c3d4-"  (never the full key) */
  prefix: string;
  scopes: string[];
  is_active: boolean;
  expires_at: string | null;
  last_used_at: string | null;
  created_at: string;
  /** Only present immediately after creation — never stored server-side */
  full_key?: string;
}

export interface ApiKeyListResponse {
  items: ApiKey[];
  total: number;
}

export interface CreateApiKeyRequest {
  name: string;
  scopes?: string[];
  expires_at?: string | null;
}

// ── Audit logs ────────────────────────────────────────────────────────────────

export interface AuditLogEntry {
  id: string;
  user_id: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  ip_address: string | null;
  metadata: Record<string, unknown> | null;
  status: string;
  created_at: string;
}

export interface AuditLogListResponse {
  items: AuditLogEntry[];
  total: number;
  skip: number;
  limit: number;
}

// ── Quota ─────────────────────────────────────────────────────────────────────

export interface QuotaUsage {
  projects: { used: number; limit: number };
  jobs_this_month: { used: number; limit: number };
  users: { used: number; limit: number };
  storage_bytes: { used: number; limit: number };
  api_keys: { used: number; limit: number };
}
