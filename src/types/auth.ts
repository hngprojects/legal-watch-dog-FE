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

export interface VerifyOTPPayload {
  email: string
  code: string
}

export interface ForgetPasswordPayload {
  email: string
}

export interface ForgetPasswordResponse {
  status: string
  status_code: number
  message: string
  data: Record<string, unknown>
}

export interface ResetPasswordPayload {
  token: string
  new_password: string
  confirm_password: string
}

export interface ResetPasswordResponse {
  message: string
}

//Validation Error
export interface AuthError {
  detail: {
    loc: (string | number)[]
    msg: string
    type: string
  }[]
}

// other errors like 404
export interface FailureResponse {
  status: string
  status_code: number
  message: string
  data: Record<string, unknown>
}

export type OtpPurpose = 'signup' | 'login'

export interface LoginOtpChallenge {
  requires_otp: true
  email: string
  otp_purpose: OtpPurpose
  message: string
}

export interface VerifyOtpResponse {
  message: string
  otp_purpose: OtpPurpose
  next: 'login' | 'dashboard'
  login_data?: LoginResponse
}

