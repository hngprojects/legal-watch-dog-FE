import api from '@/lib/api'
import type { CreateOrganizationPayload, Organization } from '@/types/organization'

interface OrganizationsResponse {
  status: string
  status_code: number
  message: string
  data: {
    organisations: Organization[]
    total?: number
    page?: number
    limit?: number
    total_pages?: number
  }
}

interface OrganizationResponse {
  status: string
  status_code: number
  message: string
  data: Organization
}

export const organizationService = {
  listOrganizations: (userId: string) =>
    api.get<OrganizationsResponse>(`/users/${userId}/organisations`),
  createOrganization: (payload: CreateOrganizationPayload) =>
    api.post<OrganizationResponse>('/organizations', payload),
}
