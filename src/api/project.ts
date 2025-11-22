import api from '@/lib/api'
import type { CreateProjectPayload, Project, UpdateProjectPayload } from '@/types/project'

interface ProjectsResponse {
  status: string
  status_code: number
  message: string
  data: {
    projects: Project[]
    total: number
    page: number
    limit: number
    total_pages: number
  }
}
interface CreateProjectResponse {
  status: string
  status_code: number
  message: string
  data: Project
}

export const projectService = {
  listProjects: () => api.get<ProjectsResponse>('/projects'),
  createProject: (payload: CreateProjectPayload) =>
    api.post<CreateProjectResponse>('/projects', payload),
  updateProject: (id: string, payload: UpdateProjectPayload) =>
    api.patch<Project>(`/projects/${id}`, payload),
  deleteProject: (id: string) => api.delete<{ success: boolean }>(`/projects/${id}`),
}
