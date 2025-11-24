export interface RegisterPayload {
  name: string
  email: string
  password: string
  confirm_password: string
  industry: string
}

export interface RegisterResponse {
  status_code: number
  message: string
  email: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  [x: string]: unknown
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
  refresh_token?: string
}

export interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface VerifyOTPPayload {
  email: string
  code: string
}

export interface VerifyOtpResponse {
  message: string
  otp_purpose?: string
  next: 'login' | 'dashboard'
  login_data?: LoginResponse
}

export interface ResendOtpPayload {
  email: string
}

export interface ResendOtpResponse {
  message: string
  status?: string
  status_code?: number
}

export interface PasswordResetRequestPayload {
  email: string
}

export interface PasswordResetRequestResponse {
  message?: string
  status?: string
  status_code?: number
}

export interface PasswordResetVerifyPayload {
  email: string
  code: string
}

export interface PasswordResetVerifyResponse {
  message?: string
  reset_token?: string
  status?: string
  status_code?: number
  data?: {
    reset_token?: string
  }
}

export interface PasswordResetConfirmPayload {
  reset_token: string
  new_password: string
  confirm_password: string
}

export interface PasswordResetConfirmResponse {
  message?: string
  status?: string
  status_code?: number
}

export interface AuthError {
  detail: {
    loc: (string | number)[]
    msg: string
    type: string
  }[]
}
