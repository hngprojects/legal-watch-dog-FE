import axios from 'axios'
import type {
  LoginOtpChallenge,
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
  VerifyOTPPayload,
  VerifyOtpResponse,
} from '@/types/auth'
import { mockAuthService } from '@/mocks/mock-auth-service'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://minamoto.emerj.net/api/api/v1'
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

const httpAuthService = {
  registerOrganisation: (payload: RegisterPayload) =>
    http.post<RegisterResponse>('/auth/register', payload),

  login: (payload: LoginPayload) =>
    http.post<LoginResponse | LoginOtpChallenge>('/auth/login', payload),

  logout: (token: string | null) =>
    http.post<LogoutResponse>(
      '/auth/logout',
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    ),

  verifyOtp: (payload: VerifyOTPPayload) =>
    http.post<VerifyOtpResponse>('/auth/verify-otp', payload),

  refreshToken: (payload: RefreshTokenPayload) =>
    http.post<RefreshTokenResponse>('/auth/refresh', payload),
}

export const authService = USE_MOCK_API ? mockAuthService : httpAuthService
