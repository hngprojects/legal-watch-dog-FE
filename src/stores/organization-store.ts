import { defineStore } from 'pinia'
import { organizationService } from '@/api/organization'
import type {
  CreateOrganizationPayload,
  Organization,
  OrganizationErrorResponse,
  RawOrganization,
  UpdateOrganizationPayload,
} from '@/types/organization'

const mapRawOrganization = (org: RawOrganization): Organization => ({
  id: org.organization_id || org.id || '',
  name: org.name,
  industry: org.industry,
  is_active: org.is_active,
  user_role: org.user_role || org.role,
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
  loadingMore: boolean
  page: number
  limit: number
  totalPages: number
  error: string | null
}

export const useOrganizationStore = defineStore('organizations', {
  state: (): State => ({
    organizations: [],
    loading: true,
    loadingMore: false,
    page: 1,
    limit: 9,
    totalPages: 1,
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
      this.loadingMore = false
      this.page = 1
      this.totalPages = 1
      this.setError(null)
      try {
        const response = await organizationService.listOrganizations(this.page, this.limit)
        const payload = response?.data?.data
        const rawList = parseRawOrganizations(payload)
        this.organizations = rawList.map((org) => mapRawOrganization(org))
        if (payload && typeof payload === 'object') {
          const meta = payload as { total_pages?: number; total?: number; limit?: number }
          const totalPages =
            meta.total_pages ??
            (meta.total && (meta.limit || this.limit) ? Math.ceil(meta.total / (meta.limit || this.limit)) : null)
          this.totalPages = totalPages && Number.isFinite(totalPages) ? totalPages : 1
        } else {
          this.totalPages = 1
        }
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

    async fetchMoreOrganizations(userId: string) {
      if (!userId) {
        this.setError('Missing user ID for organizations lookup')
        return
      }
      if (this.loadingMore || this.loading || this.page >= this.totalPages) return
      this.loadingMore = true
      this.setError(null)
      try {
        const nextPage = this.page + 1
        const response = await organizationService.listOrganizations(nextPage, this.limit)
        const payload = response?.data?.data
        const rawList = parseRawOrganizations(payload)
        const mapped = rawList.map((org) => mapRawOrganization(org))
        this.organizations = [...this.organizations, ...mapped]
        this.page = nextPage
        if (payload && typeof payload === 'object') {
          const meta = payload as { total_pages?: number; total?: number; limit?: number }
          const totalPages =
            meta.total_pages ??
            (meta.total && (meta.limit || this.limit) ? Math.ceil(meta.total / (meta.limit || this.limit)) : null)
          this.totalPages = totalPages && Number.isFinite(totalPages) ? totalPages : this.totalPages
        }
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
        this.loadingMore = false
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

    async updateOrganization(organizationId: string, payload: UpdateOrganizationPayload) {
      this.setError(null)
      try {
        const { data } = await organizationService.updateOrganization(organizationId, payload)
        const updated = mapRawOrganization(data.data as RawOrganization)
        this.organizations = this.organizations.map((org) =>
          org.id === updated.id ? updated : org,
        )
        return updated
      } catch (error) {
        const err = error as OrganizationErrorResponse
        if (!err.response) {
          this.setError('Network error: Unable to reach server')
        } else {
          this.setError(
            err.response.data?.detail?.[0]?.msg ||
              err.response.data?.message ||
              'Failed to update organization',
          )
        }
        return null
      }
    },

    async deleteOrganization(organizationId: string) {
      this.setError(null)
      try {
        await organizationService.deleteOrganization(organizationId)
        this.organizations = this.organizations.filter((org) => org.id !== organizationId)
        return true
      } catch (error) {
        const err = error as OrganizationErrorResponse
        if (!err.response) {
          this.setError('Network error: Unable to reach server')
        } else {
          this.setError(
            err.response.data?.detail?.[0]?.msg ||
              err.response.data?.message ||
              'Failed to delete organization',
          )
        }
        return false
      }
    },
  },
  getters: {
    currentOrganization: (state) => state.organizations[0] || null,

    currentOrganizationId: (state) => state.organizations[0]?.id || null,

    hasOrganizations: (state) => state.organizations.length > 0,
    hasMoreOrganizations: (state) => state.page < state.totalPages,
  },
})
