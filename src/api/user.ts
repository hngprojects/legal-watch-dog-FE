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

export interface UpdateProfilePayload {
  avatar_url?: string
  name?: string
}

interface UpdateProfileResponse {
  status?: string
  status_code?: number
  message?: string
  data?: UserProfile
}

export const userService = {
  getCurrentUser: () => api.get<CurrentUserResponse>('/users/me'),
  updateProfile: (payload: UpdateProfilePayload) => api.patch<UpdateProfileResponse>('/users/me', payload),
}
