import api from '@/lib/api'
import type {
  CreateOrganizationPayload,
  InviteMemberPayload,
  RawOrganization,
} from '@/types/organization'
import type { UserProfile } from '@/types/user'

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

interface OrganizationUsersResponse {
  status?: string
  status_code?: number
  message?: string
  data?: {
    users?: UserProfile[]
  }
}

export const organizationService = {
  listOrganizations: () => api.get<OrganizationsResponse>(`/users/me/organizations`),
  createOrganization: (payload: CreateOrganizationPayload) =>
    api.post<OrganizationResponse>('/organizations', payload),
  inviteMember: (organizationId: string, payload: InviteMemberPayload) =>
    api.post<InviteMemberResponse>(`/organizations/${organizationId}/invitations`, payload),
  listOrganizationUsers: (organizationId: string) =>
    api.get<OrganizationUsersResponse>(`/organizations/${organizationId}/users`),
  getOrganizationById: (organizationId: string) =>
    api.get<OrganizationResponse>(`/users/me/organizations/${organizationId}`),
}
