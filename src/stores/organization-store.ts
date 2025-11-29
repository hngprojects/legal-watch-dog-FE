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
  id: org.organization_id || org.organizationId || org.id || (org as { _id?: string })._id || '',
  name: org.name,
  industry: org.industry,
  is_active: org.is_active,
  user_role: org.user_role || org.role,
  project_count:
    org.project_count ??
    org.projects_count ??
    (Array.isArray(org.projects) ? org.projects.length : undefined),
  created_at: org.created_at,
  updated_at: org.updated_at,
})

const isRawOrganization = (value: unknown): value is RawOrganization =>
  !!value && typeof value === 'object' && 'name' in (value as Record<string, unknown>)

const extractOrgArray = (value: unknown): RawOrganization[] => {
  if (Array.isArray(value)) return value.filter(isRawOrganization)
  if (value && typeof value === 'object') {
    const maybeValue = value as {
      data?: unknown
      items?: unknown
      results?: unknown
      rows?: unknown
      records?: unknown
    }
    const arrays = [
      maybeValue.data,
      maybeValue.items,
      maybeValue.results,
      maybeValue.rows,
      maybeValue.records,
    ]
    for (const arr of arrays) {
      if (Array.isArray(arr)) return arr.filter(isRawOrganization)
    }
  }
  return []
}

const parseRawOrganizations = (payload: unknown): RawOrganization[] => {
  if (!payload || typeof payload !== 'object') return []
  const maybePayload = payload as { organisations?: unknown; organizations?: unknown; data?: unknown }
  const candidates = [
    maybePayload.organisations,
    maybePayload.organizations,
    maybePayload.data,
    (maybePayload.data && typeof maybePayload.data === 'object'
      ? (maybePayload.data as { organisations?: unknown }).organisations
      : undefined),
    (maybePayload.data && typeof maybePayload.data === 'object'
      ? (maybePayload.data as { organizations?: unknown }).organizations
      : undefined),
  ]

  for (const candidate of candidates) {
    const list = extractOrgArray(candidate)
    if (list.length) return list
  }

  if (maybePayload.data && typeof maybePayload.data === 'object') {
    const nested = parseRawOrganizations(maybePayload.data)
    if (nested.length) return nested
  }

  return []
}

const deepFindOrganization = (
  payload: unknown,
  seen: WeakSet<object> = new WeakSet(),
): RawOrganization | null => {
  if (!payload) return null
  if (isRawOrganization(payload)) return payload
  if (typeof payload !== 'object') return null
  if (seen.has(payload as object)) return null
  seen.add(payload as object)

  if (Array.isArray(payload)) {
    for (const item of payload) {
      const found = deepFindOrganization(item, seen)
      if (found) return found
    }
    return null
  }

  for (const value of Object.values(payload as Record<string, unknown>)) {
    const found = deepFindOrganization(value, seen)
    if (found) return found
  }
  return null
}

const parseSingleOrganization = (payload: unknown): RawOrganization | null => {
  if (!payload) return null
  if (isRawOrganization(payload)) return payload
  if (Array.isArray(payload)) return payload.find(isRawOrganization) ?? null

  if (typeof payload === 'object') {
    const obj = payload as {
      organization?: unknown
      organisation?: unknown
      data?: unknown
    }
    const candidates = [obj.organization, obj.organisation, obj.data]
    for (const candidate of candidates) {
      if (!candidate) continue
      if (isRawOrganization(candidate)) return candidate
      if (Array.isArray(candidate)) {
        const fromArray = candidate.find(isRawOrganization)
        if (fromArray) return fromArray
      }
      if (candidate && typeof candidate === 'object') {
        const nested = parseSingleOrganization(candidate)
        if (nested) return nested
      }
    }
  }

  return deepFindOrganization(payload)
}

const resolveTotalPages = (payload: unknown, fallbackLimit: number): number => {
  const compute = (meta: { total_pages?: number; total?: number; limit?: number } | null) => {
    if (!meta) return null
    const totalPages =
      meta.total_pages ??
      (meta.total && (meta.limit || fallbackLimit)
        ? Math.ceil(meta.total / (meta.limit || fallbackLimit))
        : null)
    return totalPages && Number.isFinite(totalPages) ? totalPages : null
  }

  if (payload && typeof payload === 'object') {
    const topLevel = compute(payload as { total_pages?: number; total?: number; limit?: number })
    if (topLevel) return topLevel

    const innerData = (payload as { data?: unknown }).data
    if (innerData && typeof innerData === 'object') {
      const inner = compute(
        innerData as { total_pages?: number; total?: number; limit?: number },
      )
      if (inner) return inner
    }
  }

  return 1
}

const resolveMetaNumber = (
  payload: unknown,
  key: 'total' | 'limit' | 'page' | 'total_pages',
): number | null => {
  if (!payload || typeof payload !== 'object') return null
  const value = (payload as Record<string, unknown>)[key]
  if (typeof value === 'number' && Number.isFinite(value)) return value

  const innerData = (payload as { data?: unknown }).data
  if (innerData && typeof innerData === 'object') {
    const innerValue: number | null = resolveMetaNumber(innerData, key)
    if (innerValue !== null) return innerValue
  }

  return null
}

const mapAndFilterOrganizations = (rawList: RawOrganization[]): Organization[] => {
  const seen = new Set<string>()
  const cleaned: Organization[] = []
  for (const raw of rawList) {
    const mapped = mapRawOrganization(raw)
    const key = mapped.id || mapped.name
    if (!key) continue
    if (mapped.is_active === false) continue
    if (seen.has(key)) continue
    seen.add(key)
    cleaned.push(mapped)
  }
  return cleaned
}

const mergeOrganizations = (current: Organization[], rawList: RawOrganization[]): Organization[] => {
  const incoming = mapAndFilterOrganizations(rawList)
  const seen = new Set(current.map((org) => org.id || org.name).filter(Boolean) as string[])
  const merged = [...current]
  for (const org of incoming) {
    const key = org.id || org.name
    if (!key || seen.has(key)) continue
    seen.add(key)
    merged.push(org)
  }
  return merged
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
    limit: 10,
    totalPages: 1,
    error: null,
  }),

  actions: {
    setError(message: string | null) {
      this.error = message
    },

    async fetchOrganizations(
      userId: string,
      options?: { skipFallback?: boolean; prefetchSecondPage?: boolean },
    ) {
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
        const payload = response?.data?.data ?? response?.data
        const rawList = parseRawOrganizations(payload)
        this.organizations = mapAndFilterOrganizations(rawList)
        this.totalPages = resolveTotalPages(payload, this.limit)

        // Backend occasionally returns empty `organizations` despite meta showing data.
        const announcedTotal = resolveMetaNumber(payload, 'total')
        if (!this.organizations.length && !options?.skipFallback && (announcedTotal === null || announcedTotal > 0)) {
          const fallback = await organizationService.listOrganizations()
          const fallbackPayload = fallback?.data?.data ?? fallback?.data
          const fallbackList = parseRawOrganizations(fallbackPayload)
          if (fallbackList.length) {
            this.organizations = mapAndFilterOrganizations(fallbackList)
            this.totalPages = resolveTotalPages(fallbackPayload, this.limit)
          }
        }

        const targetCount = 10
        // Load subsequent pages until we have at least targetCount active orgs or exhaust pages.
        while (
          this.organizations.length < targetCount &&
          this.page < this.totalPages &&
          options?.prefetchSecondPage !== false
        ) {
          try {
            const nextPage = this.page + 1
            const next = await organizationService.listOrganizations(nextPage, this.limit)
            const nextPayload = next?.data?.data ?? next?.data
            const nextList = parseRawOrganizations(nextPayload)
            this.organizations = mergeOrganizations(this.organizations, nextList)
            this.page = nextPage
            const nextTotalPages = resolveTotalPages(nextPayload, this.limit)
            if (nextTotalPages > this.totalPages) {
              this.totalPages = nextTotalPages
            }
          } catch (prefetchError) {
            void prefetchError
            break
          }
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
        const payload = response?.data?.data ?? response?.data
        const rawList = parseRawOrganizations(payload)
        this.organizations = mergeOrganizations(this.organizations, rawList)
        this.page = nextPage
        this.totalPages = resolveTotalPages(payload, this.limit)
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
        await organizationService.createOrganization(payload)
        // Do not rely on response body shape; caller will refetch list.
        return true
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
        return false
      }
    },

    async updateOrganization(organizationId: string, payload: UpdateOrganizationPayload) {
      this.setError(null)
      try {
        const { data } = await organizationService.updateOrganization(organizationId, payload)
        const raw =
          parseSingleOrganization(data?.data) ||
          parseSingleOrganization(data) ||
          parseRawOrganizations(data?.data)?.[0] ||
          parseRawOrganizations(data)?.[0]
        const updated = raw ? mapRawOrganization(raw) : null
        if (!updated) {
          this.setError('Organization updated but could not be parsed from response')
          return null
        }
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
