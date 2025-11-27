export interface Organization {
  id: string
  name: string
  industry?: string
  is_active?: boolean
  user_role?: string
  created_at?: string
  updated_at?: string
}

export interface RawOrganization {
  organization_id?: string
  id?: string
  name: string
  industry?: string
  is_active?: boolean
  user_role?: string
  role?: string
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
