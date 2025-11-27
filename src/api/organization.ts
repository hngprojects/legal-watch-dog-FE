import api from '@/lib/api'
import type { CreateOrganizationPayload, InviteMemberPayload, RawOrganization } from '@/types/organization'

interface OrganizationsResponse {
  status: string
  status_code: number
  message: string
  data:
    | RawOrganization[]
    | {
        organisations?: RawOrganization[]
        organizations?: RawOrganization[]
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
  data: RawOrganization
}

interface InviteMemberResponse {
  status?: string
  status_code?: number
  message?: string
  data?: {
    message?: string
  }
}

export const organizationService = {
  listOrganizations: () => api.get<OrganizationsResponse>(`/users/me/organizations`),
  createOrganization: (payload: CreateOrganizationPayload) =>
    api.post<OrganizationResponse>('/organizations', payload),
  inviteMember: (organizationId: string, payload: InviteMemberPayload) =>
    api.post<InviteMemberResponse>(`/organizations/${organizationId}/invitations`, payload),
}
