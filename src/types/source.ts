export type SourceType = 'web' | 'rss' | 'api' | 'pdf' | 'newsletter'
export type ScrapeFrequency = 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY'

export interface Source {
  id: string
  jurisdiction_id: string
  name: string
  url: string
  source_type: SourceType
  scrape_frequency: ScrapeFrequency
  auth_details?: Record<string, unknown> | null
  scraping_rules?: Record<string, unknown> | null
  is_active?: boolean
  is_deleted?: boolean
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface CreateSourcePayload {
  jurisdiction_id: string
  name: string
  url: string
  source_type?: SourceType
  scrape_frequency?: ScrapeFrequency
  auth_details?: Record<string, unknown> | null
  scraping_rules?: Record<string, unknown> | null
}

export type UpdateSourcePayload = Partial<CreateSourcePayload> & {
  is_active?: boolean
  is_deleted?: boolean
}

export interface SourceResponse {
  status?: string
  status_code?: number
  message?: string
  data: {
    source: Source
  }
}
