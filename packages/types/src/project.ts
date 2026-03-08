export interface Project {
  id: string;
  tenant_id: string;
  created_by: string | null;
  name: string;
  description: string | null;
  tags: string[];
  archived: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface ProjectCreate {
  name: string;
  description?: string;
  tags?: string[];
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  tags?: string[];
}

export interface ProjectListResponse {
  items: Project[];
  total: number;
}
