import api from '@/lib/api'

export interface Jurisdiction {
  id: string
  project_id: string
  parent_id: string | null
  name: string
  description: string
  prompt?: string | null
  sources?: string[]
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
  getAll: (organizationId: string) =>
    api.get<JurisdictionResponse>(`/organizations/${organizationId}/jurisdictions/`),

  getByProject: (organizationId: string, projectId: string) =>
    api.get<JurisdictionResponse>(
      `/organizations/${organizationId}/jurisdictions/project/${projectId}`,
    ),

  getOne: (organizationId: string, jurisdictionId: string) =>
    api.get<SingleJurisdictionResponse>(
      `/organizations/${organizationId}/jurisdictions/${jurisdictionId}`,
    ),

  create: (
    organizationId: string,
    data: {
      project_id: string
      name: string
      description: string
      prompt?: string | null
      parent_id?: string | null
      scrape_output?: Record<string, unknown> | null
    },
  ) =>
    api.post<SingleJurisdictionResponse>(`/organizations/${organizationId}/jurisdictions/`, data),

  update: (organizationId: string, jurisdictionId: string, data: Partial<Jurisdiction>) =>
    api.patch<SingleJurisdictionResponse>(
      `/organizations/${organizationId}/jurisdictions/${jurisdictionId}`,
      data,
    ),

  delete: (organizationId: string, jurisdictionId: string) =>
    api.delete(`/organizations/${organizationId}/jurisdictions/${jurisdictionId}`),

  restore: (organizationId: string, jurisdictionId: string) =>
    api.post(`/organizations/${organizationId}/jurisdictions/${jurisdictionId}/restoration`),

  deleteByProject: (organizationId: string, projectId: string) =>
    api.delete(`/organizations/${organizationId}/jurisdictions/project/${projectId}/`),

  restoreByProject: (organizationId: string, projectId: string) =>
    api.post(`/organizations/${organizationId}/jurisdictions/project/${projectId}/restoration`),
}
