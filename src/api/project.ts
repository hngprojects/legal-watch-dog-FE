import api from '@/lib/api'
import { mockProjectService } from '@/mocks/mock-project-service'
import type { CreateProjectPayload, Project, UpdateProjectPayload } from '@/types/project'

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'

const httpProjectService = {
  listProjects: () => api.get<Project[]>('/projects'),
  createProject: (payload: CreateProjectPayload) => api.post<Project>('/projects', payload),
  updateProject: (id: string, payload: UpdateProjectPayload) =>
    api.put<Project>(`/projects/${id}`, payload),
  deleteProject: (id: string) => api.delete<{ success: boolean }>(`/projects/${id}`),
}

export const projectService = USE_MOCK_API ? mockProjectService : httpProjectService
