import api from '@/lib/api'

export interface Jurisdiction {
  id: string
  project_id: string
  parent_id: string | null
  name: string
  description: string
  prompt?: string | null
  scrape_output?: Record<string, unknown> | null
  created_at: string
  updated_at: string | null
  deleted_at?: string | null
  is_deleted: boolean
}

interface JurisdictionResponse {
  status: string
  status_code: number
  message: string
  data: {
    jurisdictions: Jurisdiction[]
  }
}

interface SingleJurisdictionResponse {
  status: string
  status_code: number
  message: string
  data: {
    jurisdiction: Jurisdiction
  }
}

export const jurisdictionApi = {
  getAll: (projectId?: string) =>
    projectId
      ? api.get<JurisdictionResponse>(`/jurisdictions/project/${projectId}`)
      : api.get<JurisdictionResponse>('/jurisdictions/'),

  getOne: (jurisdictionId: string) =>
    api.get<SingleJurisdictionResponse>(`/jurisdictions/${jurisdictionId}`),

  create: (data: {
    project_id: string
    name: string
    description: string
    prompt?: string | null
    parent_id?: string | null
    scrape_output?: Record<string, unknown> | null
  }) => api.post<SingleJurisdictionResponse>('/jurisdictions/', data),

  update: (jurisdictionId: string, data: Partial<Jurisdiction>) =>
    api.patch<SingleJurisdictionResponse>(`/jurisdictions/${jurisdictionId}`, data),

  delete: (jurisdictionId: string) => api.delete(`/jurisdictions/${jurisdictionId}`),

  restore: (jurisdictionId: string) =>
    api.post(`/jurisdictions/${jurisdictionId}/restoration`),

  deleteByProject: (projectId: string) => api.delete(`/jurisdictions/project/${projectId}`),

  restoreByProject: (projectId: string) =>
    api.post(`/jurisdictions/project/${projectId}/restoration`),
}
