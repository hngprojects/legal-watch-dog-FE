import { defineStore } from 'pinia'
import { authService } from '@/api/auth'
import type {
  LoginPayload,
  LoginResponse,
  RefreshTokenResponse,
  RegisterPayload,
  VerifyOTPPayload,
  OtpPurpose,
} from '@/types/auth'

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
  otpPurpose: OtpPurpose | null
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    accessToken: null,
    user: null,
    email: null,
    organisation: null,
    otpPurpose: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    setAccessToken(token: string | null) {
      this.accessToken = token
    },

    clearAuthState() {
      this.email = null
      this.user = null
      this.organisation = null
      this.accessToken = null
      this.otpPurpose = null
    },

    handleLoginSuccess(response: LoginResponse) {
      this.setAccessToken(response.access_token)
      this.user = response.user as User
    },

    handleTokenRefresh(response: RefreshTokenResponse) {
      this.setAccessToken(response.access_token)
    },

    async register(payload: RegisterPayload) {
      const { data } = await authService.registerOrganisation(payload)

      this.email = data.email
      this.otpPurpose = 'signup'

      return data
    },

    async login(payload: LoginPayload) {
      const { data } = await authService.login(payload)

      this.handleLoginSuccess(data)
      this.email = (data.user as User | undefined)?.email ?? payload.email
      this.otpPurpose = null

      return data
    },

    async verifyOTP(payload: VerifyOTPPayload) {
      const { data } = await authService.verifyOtp(payload)

      if (data?.login_data) {
        this.handleLoginSuccess(data.login_data)
      }

      if (data?.next === 'login' || data?.next === 'dashboard') {
        this.otpPurpose = null
      }

      return data
    },

    async logout() {
      try {
        await authService.logout(this.accessToken)
      } finally {
        this.clearAuthState()
      }
    },

    async refreshSession() {
      const { data } = await authService.refreshToken()

      this.handleTokenRefresh(data)
      return data
    },
  },
})
