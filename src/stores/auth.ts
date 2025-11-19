import { defineStore } from 'pinia'
import { authService } from '@/features/auth/service'

export interface RegisterPayload {
  organisation_name: string
  first_name: string
  last_name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface Organisation {
  id: string
  name: string
  created_at: string
}

export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
  organisation_id: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    organisation: null as Organisation | null,
    token: localStorage.getItem('token') || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async register(payload: RegisterPayload) {
      const { data } = await authService.register(payload)

      this.user = data.user
      this.organisation = data.organisation
      this.token = data.token

      localStorage.setItem('token', data.token)
      return data
    },

    async login(payload: LoginPayload) {
      const { data } = await authService.login(payload)

      this.user = data.user
      this.token = data.token

      localStorage.setItem('token', data.token)
      return data
    },

    async logout() {
      await authService.logout(this.token)

      this.user = null
      this.organisation = null
      this.token = null
      localStorage.removeItem('token')
    },

    async refreshToken(refreshToken: string) {
      const { data } = await authService.refreshToken(refreshToken)

      this.token = data.token
      localStorage.setItem('token', data.token)
      return data
    }
  }
})