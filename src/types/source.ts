export type SourceType = 'web' | 'api' | 'pdf'

export type ScrapeFrequency = 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY'

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
