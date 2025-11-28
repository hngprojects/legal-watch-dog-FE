// src/api/source.ts
import api from '@/lib/api' // your axios instance
import type { Source, CreateSourcePayload, UpdateSourcePayload } from '@/types/source'

/**
 * Backend response envelope (matches your examples)
 * {
 *   status: "success",
 *   status_code: 200,
 *   message: "Source updated successfully",
 *   data: { source: {...} }  // or data: { sources: [...], count: 1 }
 * }
 */
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

  getOne: (source_id: string) =>
    api.get<ApiEnvelope<{ source: Source }>>(`/sources/${source_id}`),

  update: (source_id: string, payload: UpdateSourcePayload) =>
    api.put<ApiEnvelope<{ source: Source }>>(`/sources/${source_id}`, payload),

  patch: (source_id: string, payload: UpdateSourcePayload) =>
    api.patch<ApiEnvelope<{ source: Source }>>(`/sources/${source_id}`, payload),

  delete: (source_id: string) =>
    api.delete<ApiEnvelope<{ success?: boolean }>>(`/sources/${source_id}`),

  scrape: (source_id: string) =>
    api.post<ApiEnvelope<unknown>>(`/sources/${source_id}/scrapes`),
}

export default sourceApi
