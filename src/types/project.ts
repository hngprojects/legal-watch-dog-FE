export type ProjectStatus = 'active' | 'paused' | 'completed'

export interface Project {
  id: string
  title: string
  description: string
  master_prompt: string
  org_id: string
  created_at: string
  updated_at: string
  assigned_users: unknown
}

export interface CreateProjectPayload {
  title: string
  description: string
  master_prompt: string
}

export interface ProjectErrorResponse {
  response: {
    data: {
      detail: {
        loc: (string | number)[]
        msg: string
        type: string
      }[]
    }
  }
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>
