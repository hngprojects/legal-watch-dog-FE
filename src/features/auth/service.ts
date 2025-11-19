import axios from 'axios'
import type {
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
} from './types'

export const authService = {
  register: (payload: RegisterPayload) => axios.post<RegisterResponse>('/auth/register', payload),

  login: (payload: LoginPayload) => axios.post<LoginResponse>('/auth/login', payload),

  logout: (token: string | null) =>
    axios.post<LogoutResponse>(
      '/auth/logout',
      {},
      { headers: { Authorization: `Bearer ${token}` } },
    ),

  refreshToken: (refreshToken: string) =>
    axios.post<RefreshTokenResponse>('/auth/refresh', { refresh_token: refreshToken }),
}
