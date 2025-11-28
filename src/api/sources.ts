import api from '@/lib/api'
import type { Source, SourceResponse } from '@/types/source'
import type { SourceType, ScrapeFrequency } from '@/types/source'

const SOURCES_BASE = '/sources'

// Helper type for API errors (keeps us from using `any`)
interface ApiErrorResponse {
  response?: {
    status?: number
    data?: {
      message?: string
      detail?: Array<{ msg?: string }> | string
    }
  }
  message?: string
}

export const createSource = async (sourceData: {
  jurisdiction_id: string
  name: string
  url: string
  source_type: SourceType
  scrape_frequency: ScrapeFrequency
  scraping_rules?: Record<string, unknown> | null
  auth_details?: Record<string, unknown> | null
}): Promise<Source> => {
  try {
    const response = await api.post<SourceResponse>(SOURCES_BASE, sourceData)
    return response.data.data.source
  } catch (error: unknown) {
    const err = error as ApiErrorResponse

    if (err.response?.status === 422) {
      console.error('Validation errors:', err.response.data?.detail)
    }

    // Safely extract message without `any`
    const backendMessage =
      typeof err.response?.data?.detail === 'string'
        ? err.response.data.detail
        : (err.response?.data?.detail?.[0]?.msg ??
          err.response?.data?.message ??
          'Failed to create source.')

    throw new Error(backendMessage)
  }
}

export interface GetSourcesParams {
  jurisdiction_id?: string
  is_active?: boolean
  skip?: number
  limit?: number
}

export interface SourcesListResponse {
  sources: Source[]
  count: number
}

export const fetchSources = async (params: GetSourcesParams = {}): Promise<SourcesListResponse> => {
  try {
    const response = await api.get<{ data: SourcesListResponse }>('/sources', { params })
    return response.data.data
  } catch (error: unknown) {
    const err = error as ApiErrorResponse
    throw new Error(err.response?.data?.message ?? 'Failed to fetch sources')
  }
}

export const fetchSourcesByJurisdiction = async (
  jurisdictionId: string,
  isActive?: boolean,
): Promise<Source[]> => {
  const { sources } = await fetchSources({
    jurisdiction_id: jurisdictionId,
    is_active: isActive,
    limit: 500,
  })
  return sources
}

export const updateSource = async (
  sourceId: string,
  data: Partial<{
    name: string
    url: string
    source_type: SourceType
    scrape_frequency: ScrapeFrequency
    is_active: boolean
    scraping_rules?: Record<string, unknown> | null
    auth_details?: Record<string, unknown> | null
  }>,
): Promise<Source> => {
  try {
    const response = await api.put<SourceResponse>(`${SOURCES_BASE}/${sourceId}`, data)
    return response.data.data.source
  } catch (error: unknown) {
    const err = error as ApiErrorResponse
    const backendMessage =
      typeof err.response?.data?.detail === 'string'
        ? err.response.data.detail
        : (err.response?.data?.detail?.[0]?.msg ?? 'Failed to update source.')
    throw new Error(backendMessage)
  }
}

export const deleteSource = async (sourceId: string, permanent = false): Promise<void> => {
  try {
    await api.delete(`${SOURCES_BASE}/${sourceId}`, { params: { permanent } })
  } catch (error: unknown) {
    const err = error as ApiErrorResponse
    throw new Error(err.response?.data?.message ?? 'Failed to delete source.')
  }
}
