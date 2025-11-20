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

axios.defaults.baseURL = 'https://minamoto.emerj.net/api/api/v1'

export const authService = {
  registerOrganisation: (payload: RegisterPayload) =>
    axios.post<RegisterResponse>('/auth/register', payload),

  login: (payload: LoginPayload) =>
    axios.post<LoginResponse>('/auth/login', payload, {
      withCredentials: true,
    }),

  logout: (token: string | null) =>
    axios.post<LogoutResponse>(
      '/auth/logout',
      {},
      { headers: { Authorization: `Bearer ${token}` }, withCredentials: true },
    ),

  verifyOtp: (payload: VerifyOTPPayload) => axios.post('/auth/verify-otp', payload),

  refreshToken: (payload: RefreshTokenPayload) =>
    axios.post<RefreshTokenResponse>('/auth/refresh', payload, {
      withCredentials: true,
    }),
}
