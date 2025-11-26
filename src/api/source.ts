import api from '@/lib/api'
import type { CreateSourcePayload, Source, UpdateSourcePayload } from '@/types/source'

type ApiResponse<T> = {
  status?: string
  status_code?: number
  message?: string
  data: T
}

type ListResponse = {
  sources: Source[]
  total?: number
  page?: number
  limit?: number
  total_pages?: number | null
}

export const sourceApi = {
  create: (payload: CreateSourcePayload) => api.post<ApiResponse<Source>>('/sources', payload),

  list: (params?: { jurisdiction_id?: string; page?: number; limit?: number }) =>
    api.get<ApiResponse<ListResponse>>('/sources', { params }),

  getOne: (sourceId: string) => api.get<ApiResponse<Source>>(`/sources/${sourceId}`),

  update: (sourceId: string, payload: CreateSourcePayload) =>
    api.put<ApiResponse<Source>>(`/sources/${sourceId}`, payload),

  patch: (sourceId: string, payload: UpdateSourcePayload) =>
    api.patch<ApiResponse<Source>>(`/sources/${sourceId}`, payload),

  delete: (sourceId: string) => api.delete<ApiResponse<{ success?: boolean }>>(`/sources/${sourceId}`),

  // Placeholder for future scraping endpoint; call will fail safely until backend is ready.
  scrape: (sourceId: string) => api.post<ApiResponse<unknown>>(`/sources/${sourceId}/scrape`),
}
