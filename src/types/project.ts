export type ProjectStatus = 'active' | 'paused' | 'completed'

export interface Project {
  id: string
  name: string
  description: string
  prompt: string
  status: ProjectStatus
  created_at: string
}

export interface CreateProjectPayload {
  name: string
  description: string
  prompt: string
  status: ProjectStatus
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>
