import { defineStore } from 'pinia'
import { organizationService } from '@/api/organization'
import type {
  CreateOrganizationPayload,
  Organization,
  OrganizationErrorResponse,
} from '@/types/organization'

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
        const payload = response?.data
        const items =
          (Array.isArray(payload?.data?.organisations) && payload.data.organisations) ||
          (Array.isArray(payload?.data?.organizations) && payload.data.organizations) ||
          (Array.isArray(payload?.data) && payload.data) ||
          []
        this.organizations = items
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
        const newOrg = data.data
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
