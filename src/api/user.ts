import api from '@/lib/api'
import type { UserProfile } from '@/types/user'

interface CurrentUserResponse {
  status?: string
  status_code?: number
  message?: string
  data?:
    | {
        user?: UserProfile
      }
    | UserProfile
}

export const userService = {
  getCurrentUser: () => api.get<CurrentUserResponse>('/users/me'),
}
