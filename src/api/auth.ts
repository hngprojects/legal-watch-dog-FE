import axios from 'axios'
import type {
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  PasswordResetConfirmPayload,
  PasswordResetConfirmResponse,
  PasswordResetRequestPayload,
  PasswordResetRequestResponse,
  PasswordResetVerifyPayload,
  PasswordResetVerifyResponse,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
  ResendOtpPayload,
  ResendOtpResponse,
  VerifyOTPPayload,
  VerifyOtpResponse,
} from '@/types/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.staging.legalwatch.dog/api/v1'

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 20000,
})

const bearerHeader = (token?: string | null) =>
  token ? { Authorization: `Bearer ${token}` } : undefined

export const authService = {
  registerUser: (payload: RegisterPayload) =>
    http.post<RegisterResponse>('/auth/register', payload),

  login: (payload: LoginPayload) => http.post<LoginResponse>('/auth/login', payload),

  logout: (token?: string | null) =>
    http.post<LogoutResponse>('/auth/logout', {}, { headers: bearerHeader(token) }),

  verifyOtp: (payload: VerifyOTPPayload) =>
    http.post<VerifyOtpResponse>('/auth/otp/verification', payload),

  resendOtp: (payload: ResendOtpPayload) =>
    http.post<ResendOtpResponse>('/auth/otp/requests', payload),

  requestPasswordReset: (payload: PasswordResetRequestPayload) =>
    http.post<PasswordResetRequestResponse>('/auth/password/resets', payload),

  verifyPasswordReset: (payload: PasswordResetVerifyPayload) =>
    http.post<PasswordResetVerifyResponse>('/auth/password/resets/verification', payload),

  confirmPasswordReset: (payload: PasswordResetConfirmPayload) =>
    http.post<PasswordResetConfirmResponse>('/auth/password/resets/confirmation', payload),

  refreshToken: () => http.post<RefreshTokenResponse>('/auth/token/refresh', {}),
}
