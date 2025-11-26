export interface Organization {
  id: string
  name: string
  industry?: string
  created_at?: string
  updated_at?: string
}

export interface CreateOrganizationPayload {
  name: string
  industry: string
}

export interface OrganizationErrorResponse {
  response?: {
    data?: {
      detail?: {
        loc: (string | number)[]
        msg: string
        type: string
      }[]
      message?: string
    }
  }
}
