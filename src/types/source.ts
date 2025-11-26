export type SourceType = 'web' | 'rss' | 'api' | 'pdf' | 'newsletter'
export type ScrapeFrequency = 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY'

export interface SourceCreate {
  jurisdiction_id: string
  name: string
  url: string
  source_type: SourceType
  scrape_frequency: ScrapeFrequency
  scraping_rules?: Record<string, unknown> | null
  auth_details?: Record<string, unknown> | null
}

export interface Source {
  id: string
  jurisdiction_id: string
  name: string
  url: string
  source_type: SourceType
  scrape_frequency: ScrapeFrequency
  is_active: boolean
  created_at: string
  updated_at: string
  scraping_rules?: Record<string, unknown> | null
  auth_details?: Record<string, unknown> | null
}

export interface SourceResponse {
  data: {
    source: Source
  }
}
