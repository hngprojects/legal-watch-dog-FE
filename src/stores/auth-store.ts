import { defineStore } from 'pinia'
import { authService } from '@/api/auth'
import type { LoginPayload, RegisterPayload, VerifyOTPPayload } from '@/types/auth'

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

interface ApiTokenData {
  access_token: string
  refresh_token?: string
  token_type?: string
  expires_in?: number
  user?: User
}

interface RegisterApiResponse {
  status: string
  status_code: number
  message: string
  data: {
    email: string
  }
}

interface LoginApiResponse {
  status: string
  status_code: number
  message: string
  data: ApiTokenData
}

interface VerifyOtpApiResponse {
  status?: string
  message?: string
  login_data?: ApiTokenData
  data?: ApiTokenData
}

const TOKEN_KEY = 'lwd_access_token'
const EMAIL_KEY = 'lwd_user_email'

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    accessToken: localStorage.getItem(TOKEN_KEY),
    user: null,
    email: localStorage.getItem(EMAIL_KEY),
    organisation: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    setAccessToken(token: string | null) {
      this.accessToken = token
      if (token) {
        localStorage.setItem(TOKEN_KEY, token)
      } else {
        localStorage.removeItem(TOKEN_KEY)
      }
    },

    setUserEmail(email: string | null) {
      this.email = email
      if (email) {
        localStorage.setItem(EMAIL_KEY, email)
      } else {
        localStorage.removeItem(EMAIL_KEY)
      }
    },

    clearAuthState() {
      this.email = null
      this.user = null
      this.organisation = null
      this.accessToken = null
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(EMAIL_KEY)
    },

    handleLoginSuccess(token: string, user?: User) {
      this.setAccessToken(token)
      if (user) {
        this.user = user
      }
    },

    async register(payload: RegisterPayload) {
      const response = await authService.registerOrganisation(payload)
      const responseBody = response.data as unknown as RegisterApiResponse
      const registeredEmail = responseBody.data?.email || payload.email
      this.setUserEmail(registeredEmail)
      return responseBody
    },
    async login(payload: LoginPayload) {
      const response = await authService.login(payload)
      const responseBody = response.data as unknown as LoginApiResponse
      const authData = responseBody.data

      if (!authData?.access_token) {
        throw new Error('Login response missing access token.')
      }

      this.handleLoginSuccess(authData.access_token)
      this.setUserEmail(payload.email)

      return true
    },

    async verifyOTP(payload: VerifyOTPPayload) {
      const response = await authService.verifyOtp(payload)
      const responseBody = response.data as unknown as VerifyOtpApiResponse
      const userData = responseBody.data;

      console.log(userData);

      if (userData) {
        this.user = null
        return { ...responseBody, next: 'login' }
      }
    },

    async logout() {
      try {
        if (this.accessToken) {
           await authService.logout(this.accessToken)
        }
      } finally {
        this.clearAuthState()
      }
    },
  },
})
