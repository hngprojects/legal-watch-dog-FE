import axios from 'axios'
import type {
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
  VerifyOTPPayload,
} from '@/types/auth'

export const authService = {
  registerOrganisation: (payload: RegisterPayload) =>
    axios.post<RegisterResponse>('/api/api/v1/auth/register', payload),

  login: (payload: LoginPayload) =>
    axios.post<LoginResponse>('/api/api/v1/auth/login', payload, {
      withCredentials: true,
    }),

  logout: (token: string | null) =>
    axios.post<LogoutResponse>(
      '/api/api/v1/auth/logout',
      {},
      { headers: { Authorization: `Bearer ${token}` }, withCredentials: true },
    ),

  verifyOtp: (payload: VerifyOTPPayload) => axios.post('/api/api/v1/auth/verify-otp', payload),

  refreshToken: (payload: RefreshTokenPayload) =>
    axios.post<RefreshTokenResponse>('/api/api/v1/auth/refresh', payload, {
      withCredentials: true,
    }),
}
