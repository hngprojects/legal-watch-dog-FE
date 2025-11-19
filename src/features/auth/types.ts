export interface RegisterPayload {
  name: string
  email: string
  password: string
  confirm_password: string
  industry: string
}

export interface RegisterResponse {
  message: string
  email: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: unknown // TODO: implement user type from backend docs
}

export interface LogoutResponse {
  message: string
  success: boolean
}

export interface RefreshTokenPayload {
  refresh_token: string
}

export interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface AuthError {
  detail: {
    loc: (string | number)[]
    msg: string
    type: string
  }[]
}
