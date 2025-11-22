export type ProjectStatus = 'active' | 'paused' | 'completed'

export interface Project {
  id: string
  title: string
  description: string
  master_prompt: string
  org_id: string
  created_at: string
  updated_at: string
  assigned_users: any[]
}
export interface ProjectListResponse {
  projects: Project[]
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface CreateProjectPayload {
  title: string
  description: string
  master_prompt: string
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>
