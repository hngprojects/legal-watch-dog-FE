import { defineStore } from 'pinia'
import { ref } from 'vue'
import { sourceApi } from '@/api/source'
import type {
  Source,
  CreateSourcePayload,
  UpdateSourcePayload,
  SourceRevision,
  RevisionsResponse,
} from '@/types/source'

interface ApiError {
  response?: {
    data?: {
      message?: string
      detail?: string | Array<{ msg?: string }>
    }
  }
}

export const useSourceStore = defineStore('source', () => {
  const sources = ref<Source[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const revisions = ref<Record<string, SourceRevision[]>>({})
  const revisionsLoading = ref<Record<string, boolean>>({})
  const revisionsError = ref<Record<string, string | null>>({})
  const revisionsPagination = ref<Record<string, RevisionsResponse['pagination']>>({})

  const getErrorMessage = (err: unknown, fallback: string) => {
    const apiErr = err as ApiError
    const detail = apiErr.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg
    return apiErr.response?.data?.message ?? fallback
  }

  const fetchSources = async (jurisdictionId: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await sourceApi.list({ jurisdiction_id: jurisdictionId })
      sources.value = res?.data?.data?.sources ?? []
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to load sources')
    } finally {
      loading.value = false
    }
  }

  const createSource = async (payload: CreateSourcePayload) => {
    loading.value = true
    error.value = null
    try {
      const res = await sourceApi.create(payload)
      const created = res?.data?.data?.source
      if (created) {
        sources.value.unshift(created)
      }
      return created
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to create source')
      return null
    } finally {
      loading.value = false
    }
  }

  const updateSource = async (sourceId: string, payload: UpdateSourcePayload) => {
    loading.value = true
    error.value = null
    try {
      const res = await sourceApi.update(sourceId, payload)
      const updated = res?.data?.data?.source

      if (updated) {
        sources.value = sources.value.map((s) => (s.id === updated.id ? updated : s))
      }

      return updated
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to update source')
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteSource = async (sourceId: string) => {
    loading.value = true
    error.value = null
    try {
      await sourceApi.delete(sourceId)
      sources.value = sources.value.filter((s) => s.id !== sourceId)
      return true
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to delete source')
      return false
    } finally {
      loading.value = false
    }
  }

  const scrapeSource = async (sourceId: string) => {
    error.value = null
    try {
      const res = await sourceApi.scrape(sourceId)
      return res?.data?.data
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to scrape source')
      throw err
    }
  }

  const fetchRevisions = async (sourceId: string, params?: { skip?: number; limit?: number }) => {
    revisionsLoading.value[sourceId] = true
    revisionsError.value[sourceId] = null

    try {
      const res = await sourceApi.getRevisions(sourceId, params)
      const data = res?.data?.data

      if (data?.revisions) {
        revisions.value[sourceId] = data.revisions
      }

      if (data?.pagination) {
        revisionsPagination.value[sourceId] = data.pagination
      }

      return data
    } catch (err) {
      const msg = getErrorMessage(err, 'Failed to load revisions')
      revisionsError.value[sourceId] = msg
      throw err
    } finally {
      revisionsLoading.value[sourceId] = false
    }
  }

  const setError = (msg: string | null) => {
    error.value = msg
  }

  return {
    sources,
    loading,
    error,
    revisions,
    revisionsLoading,
    revisionsError,
    revisionsPagination,

    fetchSources,
    createSource,
    updateSource,
    deleteSource,
    scrapeSource,
    fetchRevisions,

    setError,
  }
})
