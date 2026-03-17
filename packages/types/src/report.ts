export interface ReportFinding {
  id: string;
  stride_category: string;
  title: string;
  description: string;
  affected_component: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  likelihood: "High" | "Medium" | "Low";
  mitigations: string[];
  evidence: string[];
  cve_references: string[];
}

// ── System model types ────────────────────────────────────────────────────────

export interface SystemComponent {
  name: string;
  type: "service" | "database" | "queue" | "external" | "client" | string;
  description: string;
  technologies: string[];
  exposes?: string[];
  stores_data?: string[];
  authentication?: string;
}

export interface SystemDataFlow {
  from: string;
  to: string;
  data: string;
  protocol: string;
  authentication?: string;
}

export interface SystemTrustBoundary {
  name: string;
  crosses: string[];
  controls: string[];
}

export interface SystemActor {
  name: string;
  type: "external" | "internal" | "system" | string;
  privileges: string;
}

export interface SystemModel {
  system_name: string;
  system_purpose: string;
  components: SystemComponent[];
  data_flows: SystemDataFlow[];
  trust_boundaries: SystemTrustBoundary[];
  actors: SystemActor[];
  sensitive_data: string[];
  existing_controls: string[];
}

// ── Report types ──────────────────────────────────────────────────────────────

export interface ThreatReport {
  id: string;
  job_id: string;
  project_id: string;
  tenant_id: string;
  version: number;
  report_markdown: string;
  report_summary: string;
  total_findings: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  created_at: string;
  findings: ReportFinding[];
  system_model?: SystemModel;
}

// ── STRIDE helpers ────────────────────────────────────────────────────────────

export const STRIDE_CATEGORIES = [
  "Spoofing",
  "Tampering",
  "Repudiation",
  "InformationDisclosure",
  "DenialOfService",
  "ElevationOfPrivilege",
] as const;

export type StrideCategory = (typeof STRIDE_CATEGORIES)[number];

export const STRIDE_DISPLAY: Record<
  StrideCategory,
  { short: string; full: string; icon: string }
> = {
  Spoofing:              { short: "Spoofing",       full: "S — Spoofing",               icon: "🎭" },
  Tampering:             { short: "Tampering",      full: "T — Tampering",              icon: "🔧" },
  Repudiation:           { short: "Repudiation",    full: "R — Repudiation",            icon: "📋" },
  InformationDisclosure: { short: "Info Disclose",  full: "I — Information Disclosure", icon: "🔍" },
  DenialOfService:       { short: "DoS",            full: "D — Denial of Service",      icon: "🚫" },
  ElevationOfPrivilege:  { short: "Priv Escalation",full: "E — Elevation of Privilege", icon: "⬆️" },
};

export const SEVERITY_CONFIG: Record<
  string,
  { label: string; emoji: string; bg: string; text: string; border: string }
> = {
  Critical: { label: "Critical", emoji: "🔴", bg: "bg-red-50",    text: "text-red-700",    border: "border-red-300" },
  High:     { label: "High",     emoji: "🟠", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-300" },
  Medium:   { label: "Medium",   emoji: "🟡", bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-300" },
  Low:      { label: "Low",      emoji: "🟢", bg: "bg-green-50",  text: "text-green-700",  border: "border-green-300" },
};
