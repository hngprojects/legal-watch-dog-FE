import { defineStore } from 'pinia'
import { authService } from '@/features/auth/service'
import type { LoginPayload, RegisterPayload, VerifyOTPPayload } from './types'

interface Organisation {
  id: string
  name: string
  created_at: string
}

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
  organisation_id: string
}

interface State {
  accessToken: string | null
  user: User | null
  email: string | null
  organisation: Organisation | null
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    accessToken: null,
    user: null,
    email: null,
    organisation: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    setAccessToken(token: string) {
      this.accessToken = token
    },

    async register(payload: RegisterPayload) {
      const { data } = await authService.registerOrganisation(payload)

      this.email = data.email

      return data
    },

    async login(payload: LoginPayload) {
      const { data } = await authService.login(payload)

      this.setAccessToken(data.access_token)
      this.user = data.user as User

      localStorage.setItem('refreshToken', data.refresh_token)

      return data
    },

    async verifyOTP(payload: VerifyOTPPayload) {
      const { data } = await authService.verifyOtp(payload)

      return data
    },

    async logout() {
      await authService.logout(this.accessToken)

      localStorage.removeItem('refreshToken')

      this.email = null
      this.user = null
      this.organisation = null
      this.accessToken = null
    },

    async refreshToken() {
      const refreshToken = localStorage.getItem('refreshToken')

      if (!refreshToken) {
        return
      }

      const { data } = await authService.refreshToken({ refresh_token: refreshToken })

      this.setAccessToken(data.access_token)

      return data
    },
  },
})
