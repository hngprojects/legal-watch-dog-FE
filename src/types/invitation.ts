export interface Invitation {
  id?: string
  token: string
  organization_id: string
  organization_name?: string
  role_name?: string
  role?: string
  status?: string
}

export interface InvitationErrorResponse {
  response?: {
    data?: {
      detail?: { msg?: string }[]
      message?: string
    }
  }
}
