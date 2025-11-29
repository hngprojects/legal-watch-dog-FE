export interface Organization {
  id: string
  name: string
  industry?: string
  is_active?: boolean
  user_role?: string
  project_count?: number
  created_at?: string
  updated_at?: string
}

export interface RawOrganization {
  organization_id?: string
  organizationId?: string
  id?: string
  name: string
  industry?: string
  is_active?: boolean
  user_role?: string
  role?: string
  project_count?: number
  projects_count?: number
  projects?: unknown[]
  created_at?: string
  updated_at?: string
}

export interface CreateOrganizationPayload {
  name: string
  industry: string
}

export interface UpdateOrganizationPayload {
  name?: string
  industry?: string
  is_active?: boolean
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

export interface InviteMemberPayload {
  invited_email: string
  role_name: string
}
