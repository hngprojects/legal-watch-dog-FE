import api from '@/lib/api'
import type { CreateProjectPayload, Project, UpdateProjectPayload } from '@/types/project'

type ApiResponse<T> = {
  status?: string
  status_code?: number
  message?: string
  data: T
}

type ProjectsList = {
  projects: Project[]
  total: number
  page: number
  limit: number
  total_pages: number | null
}

export const projectService = {
  listProjects: (organizationId: string, params?: { q?: string; page?: number; limit?: number }) =>
    api.get<ApiResponse<ProjectsList>>(`/organizations/${organizationId}/projects`, {
      params,
    }),

  createProject: (organizationId: string, payload: CreateProjectPayload) =>
    api.post<ApiResponse<Project>>(`/organizations/${organizationId}/projects`, payload),

  updateProject: (organizationId: string, id: string, payload: UpdateProjectPayload) =>
    api.patch<ApiResponse<Project>>(`/organizations/${organizationId}/projects/${id}`, payload),

  deleteProject: (organizationId: string, id: string) =>
    api.delete<ApiResponse<{ success?: boolean }>>(
      `/organizations/${organizationId}/projects/${id}`,
    ),
}
