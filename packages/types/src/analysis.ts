// ── Job status ────────────────────────────────────────────────────────────────

export type JobStatus =
  | "pending"
  | "running"
  | "ingesting"
  | "analyzing"
  | "modeling"
  | "mapping"
  | "reporting"
  | "complete"
  | "failed";

export const TERMINAL_STATUSES: ReadonlySet<JobStatus> = new Set(["complete", "failed"]);

export const STATUS_PROGRESS: Record<JobStatus, number> = {
  pending: 0,
  running: 5,
  ingesting: 20,
  analyzing: 45,
  modeling: 60,
  mapping: 75,
  reporting: 90,
  complete: 100,
  failed: 0,
};

export const STATUS_LABELS: Record<JobStatus, string> = {
  pending: "Queued",
  running: "Starting",
  ingesting: "Ingesting",
  analyzing: "Analyzing",
  modeling: "Modeling system",
  mapping: "Mapping STRIDE",
  reporting: "Generating report",
  complete: "Complete",
  failed: "Failed",
};

// ── Upload ────────────────────────────────────────────────────────────────────

export interface UploadFileResponse {
  upload_id: string;
  filename: string;
  size_bytes: number;
  content_type: string;
  storage_path: string;
}

// ── Start analysis requests ───────────────────────────────────────────────────

export interface StartGitHubAnalysisRequest {
  project_id: string;
  repo_url: string;
  branch: string;
  github_token?: string;
}

export interface StartUploadAnalysisRequest {
  project_id: string;
  upload_ids: string[];
}

// ── Job status response ───────────────────────────────────────────────────────

/** Sanitised scan source metadata (github_token already stripped by the backend). */
export interface AnalysisInputMetadata {
  /** GitHub / GitLab repository URL (github jobs only) */
  repo_url?: string;
  /** Branch name (github jobs only) */
  branch?: string;
  /** Whether a personal access token was supplied (github jobs only) */
  has_token?: boolean;
  /** Plain filenames of uploaded files (upload jobs only) */
  filenames?: string[];
}

export interface AnalysisJob {
  job_id: string;
  project_id: string;
  status: JobStatus;
  status_message: string;
  progress_percent: number;
  input_type: "github" | "upload";
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  input_metadata?: AnalysisInputMetadata;
}
