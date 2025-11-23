import axios from 'axios'
import type {
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
  ResendOtpPayload,
  ResendOtpResponse,
  VerifyOTPPayload,
  VerifyOtpResponse,
} from '@/types/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.minamoto.emerj.net/api/v1'

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 20000,
})

const bearerHeader = (token?: string | null) =>
  token ? { Authorization: `Bearer ${token}` } : undefined

export const authService = {
  registerOrganisation: (payload: RegisterPayload) =>
    http.post<RegisterResponse>('/auth/register/', payload),

  login: (payload: LoginPayload) => http.post<LoginResponse>('/auth/login', payload),

  logout: (token?: string | null) =>
    http.post<LogoutResponse>('/auth/logout', {}, { headers: bearerHeader(token) }),

  verifyOtp: (payload: VerifyOTPPayload) =>
    http.post<VerifyOtpResponse>('/auth/verify-otp', payload),

  resendOtp: (payload: ResendOtpPayload) =>
    http.post<ResendOtpResponse>('/auth/resend-otp', payload),

  refreshToken: () => http.post<RefreshTokenResponse>('/auth/refresh', {}),
}
