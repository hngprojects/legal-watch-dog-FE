import api from '@/lib/api'
import type { CreateProjectPayload, Project, UpdateProjectPayload } from '@/types/project'

export const projectService = {
  listProjects: () => api.get<Project[]>('/projects'),
  createProject: (payload: CreateProjectPayload) => api.post<Project>('/projects', payload),
  updateProject: (id: string, payload: UpdateProjectPayload) =>
    api.put<Project>(`/projects/${id}`, payload),
  deleteProject: (id: string) => api.delete<{ success: boolean }>(`/projects/${id}`),
}
