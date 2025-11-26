import { defineStore } from 'pinia'
import { organizationService } from '@/api/organization'
import type {
  CreateOrganizationPayload,
  Organization,
  OrganizationErrorResponse,
  RawOrganization,
} from '@/types/organization'

const mapRawOrganization = (org: RawOrganization): Organization => ({
  id: org.organization_id || org.id || '',
  name: org.name,
  industry: org.industry,
  is_active: org.is_active,
  user_role: org.user_role,
  created_at: org.created_at,
  updated_at: org.updated_at,
})

const isRawOrganization = (value: unknown): value is RawOrganization =>
  !!value && typeof value === 'object' && 'name' in (value as Record<string, unknown>)

const parseRawOrganizations = (payload: unknown): RawOrganization[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isRawOrganization)
  }

  if (payload && typeof payload === 'object') {
    const maybePayload = payload as { organisations?: unknown; organizations?: unknown }
    const list =
      (Array.isArray(maybePayload.organisations) && maybePayload.organisations) ||
      (Array.isArray(maybePayload.organizations) && maybePayload.organizations) ||
      []
    return list.filter(isRawOrganization)
  }

  return []
}

interface State {
  organizations: Organization[]
  loading: boolean
  error: string | null
}

export const useOrganizationStore = defineStore('organizations', {
  state: (): State => ({
    organizations: [],
    loading: true,
    error: null,
  }),

  actions: {
    setError(message: string | null) {
      this.error = message
    },

    async fetchOrganizations(userId: string) {
      if (!userId) {
        this.setError('Missing user ID for organizations lookup')
        this.loading = false
        return
      }
      this.organizations = []
      this.loading = true
      this.setError(null)
      try {
        const response = await organizationService.listOrganizations(userId)
        const rawList = parseRawOrganizations(response?.data?.data)
        this.organizations = rawList.map((org) => mapRawOrganization(org))
      } catch (error) {
        const err = error as OrganizationErrorResponse
        if (!err.response) {
          this.setError('Network error: Unable to reach server')
        } else {
          this.setError(
            err.response.data?.detail?.[0]?.msg ||
              err.response.data?.message ||
              'Failed to load organizations',
          )
        }
      } finally {
        this.loading = false
      }
    },

    async addOrganization(payload: CreateOrganizationPayload) {
      this.setError(null)
      try {
        const { data } = await organizationService.createOrganization(payload)
        const newOrg = mapRawOrganization(data.data as RawOrganization)
        this.organizations.unshift(newOrg)
        return newOrg
      } catch (error) {
        const err = error as OrganizationErrorResponse
        if (!err.response) {
          this.setError('Network error: Unable to reach server')
        } else {
          this.setError(
            err.response.data?.detail?.[0]?.msg ||
              err.response.data?.message ||
              'Failed to create organization',
          )
        }
        return null
      }
    },
  },
})
