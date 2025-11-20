export type ProjectStatus = 'active' | 'paused' | 'completed'

export interface Project {
  id: string
  name: string
  description: string
  jurisdiction: string
  status: ProjectStatus
  created_at: string
}

export interface CreateProjectPayload {
  name: string
  description: string
  jurisdiction: string
  status: ProjectStatus
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>
