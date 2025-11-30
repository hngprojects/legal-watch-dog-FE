export type SourceType = 'web' | 'api' | 'pdf'

export type ScrapeFrequency = 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY'

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface SourceRevision {
  id: string
  source_id: string
  minio_object_key: string
  content_hash?: string | null
  extracted_data: Record<string, unknown> | null
  ai_summary: string | null
  ai_markdown_summary?: string | null
  ai_confidence_score?: number | null
  scraped_at: string
  was_change_detected: boolean
}

export interface Source {
  id: string
  jurisdiction_id: string
  name: string
  url: string
  source_type: SourceType
  scrape_frequency: ScrapeFrequency
  is_active: boolean
  is_deleted: boolean
  has_auth: boolean

  created_at: string
  updated_at: string | null

  // Optional field
  scraping_rules?: Record<string, unknown> | null
}

export interface RevisionsResponse {
  revisions: SourceRevision[]
  pagination: PaginationMeta
}
export type CreateSourcePayload = {
  jurisdiction_id: string
  name: string
  url: string
  source_type: SourceType
  scrape_frequency: ScrapeFrequency
  is_active?: boolean
  has_auth?: boolean
  scraping_rules?: Record<string, unknown> | null
}

export type UpdateSourcePayload = Partial<
  Pick<
    Source,
    | 'name'
    | 'url'
    | 'source_type'
    | 'scrape_frequency'
    | 'is_active'
    | 'is_deleted'
    | 'has_auth'
    | 'scraping_rules'
  >
>

export interface SuggestedSource {
  title: string
  url: string
  snippet: string
  confidence_reason: string
  is_official: boolean
}

export interface SuggestSourcesRequest {
  jurisdiction_name: string
  jurisdiction_description: string
  project_description: string
}

export interface SuggestSourcesResponse {
  sources: SuggestedSource[]
}
