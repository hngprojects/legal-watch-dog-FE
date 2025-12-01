import api from '@/lib/api'
import type {
  Source,
  CreateSourcePayload,
  UpdateSourcePayload,
  RevisionsResponse,
  SuggestSourcesRequest,
  SuggestedSource,
  SourceType,
  ScrapeFrequency,
} from '@/types/source'

type ApiEnvelope<T> = {
  status?: string
  status_code?: number
  message?: string
  data: T
}

type ListResponse = {
  sources: Source[]
  count: number
}

export const sourceApi = {
  create: (payload: CreateSourcePayload) =>
    api.post<ApiEnvelope<{ source: Source }>>('/sources', payload),

  list: (params?: { jurisdiction_id?: string; page?: number; limit?: number }) =>
    api.get<ApiEnvelope<ListResponse>>('/sources', { params }),

  getOne: (source_id: string) => api.get<ApiEnvelope<{ source: Source }>>(`/sources/${source_id}`),

  update: (source_id: string, payload: UpdateSourcePayload) =>
    api.put<ApiEnvelope<{ source: Source }>>(`/sources/${source_id}`, payload),

  patch: (source_id: string, payload: UpdateSourcePayload) =>
    api.patch<ApiEnvelope<{ source: Source }>>(`/sources/${source_id}`, payload),

  delete: (source_id: string) =>
    api.delete<ApiEnvelope<{ success?: boolean }>>(`/sources/${source_id}`),

  suggest: (payload: SuggestSourcesRequest) =>
    api.post<ApiEnvelope<{ sources: SuggestedSource[] }>>('/sources/suggest', payload),

  acceptSuggestions: (payload: {
    jurisdiction_id: string
    source_type?: SourceType
    scrape_frequency?: ScrapeFrequency
    suggested_sources: Array<{
      title: string
      url: string
      snippet?: string
      confidence_reason?: string
      is_official?: boolean
    }>
  }) =>
    api.post<ApiEnvelope<{ count: number; sources: Source[] }>>(
      '/sources/accept-suggestions',
      payload,
    ),

  scrape: (source_id: string) => api.post<ApiEnvelope<unknown>>(`/sources/${source_id}/scrapes`),

  getRevisions: (source_id: string, params?: { skip?: number; limit?: number }) =>
    api.get<ApiEnvelope<RevisionsResponse>>(`/sources/${source_id}/revisions`, {
      params,
    }),
}

export default sourceApi
