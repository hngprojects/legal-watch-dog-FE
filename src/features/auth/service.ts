import axios from 'axios'
import type { RegisterPayload, LoginPayload, User, Organisation } from '@/stores/auth'

interface RegisterResponse {
  message: string
  organisation: Organisation
  user: User
  token: string
}

interface LoginResponse {
  user: User
  token: string
}

interface RefreshResponse {
  token: string
}

interface LogoutResponse {
  message: string
}

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
    axios.post<RefreshResponse>('/auth/refresh', { refresh_token: refreshToken }),
}
