export interface Jurisdiction {
  id: string
  project_id: string
  parent_id: string | null
  name: string
  description: string
  prompt?: string | null
  sources?: string[]
  scrape_output?: Record<string, unknown> | null

  created_at: string
  updated_at: string | null

  // Soft delete system
  is_deleted: boolean
  deleted_at?: string | null
}

export interface CreateJurisdictionPayload {
  project_id: string
  name: string
  description: string
  parent_id?: string | null
  prompt?: string | null
  scrape_output?: Record<string, unknown> | null
}

export interface UpdateJurisdictionPayload {
  name?: string
  description?: string
  parent_id?: string | null
  prompt?: string | null
  scrape_output?: Record<string, unknown> | null
  is_deleted?: boolean
}

export interface JurisdictionListResponse {
  status: string
  status_code: number
  message: string
  data: {
    jurisdictions: Jurisdiction[]
  }
}

export interface SingleJurisdictionResponse {
  status: string
  status_code: number
  message: string
  data: {
    jurisdiction: Jurisdiction
  }
}

export interface JurisdictionErrorResponse {
  response?: {
    data?: {
      detail?: string | { msg: string; type: string; loc?: (string | number)[] }[]
      message?: string
    }
  }
}
