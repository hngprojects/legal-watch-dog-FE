import api from '@/lib/api'
import type { CreateProjectPayload, Project, ProjectListResponse, UpdateProjectPayload } from '@/types/project'

export const projectService = {
  listProjects: () => api.get<Record<string, ProjectListResponse>>('/projects'),
  createProject: (payload: CreateProjectPayload) => api.post<Record<string, Project>>('/projects', payload),
  updateProject: (id: string, payload: UpdateProjectPayload) =>
    api.put<Project>(`/projects/${id}`, payload),
  deleteProject: (id: string) => api.delete<{ success: boolean }>(`/projects/${id}`),
}
