import axios from 'axios'
import type {
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
} from './types'

export const authService = {
  register: (payload: RegisterPayload) =>
    axios.post<RegisterResponse>('/api/api/v1/auth/register', payload),

  login: (payload: LoginPayload) => axios.post<LoginResponse>('/api/api/v1/auth/register', payload),

  logout: (token: string) =>
    axios.post<LogoutResponse>(
      '/api/api/v1/auth/logout',
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    ),

  refreshToken: (payload: RefreshTokenPayload) =>
    axios.post<RefreshTokenResponse>('/api/api/v1/auth/refresh', payload),
}
