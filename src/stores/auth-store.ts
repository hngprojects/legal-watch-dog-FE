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

interface WrappedApiResponse {
  status: string
  status_code: number
  message: string
  data: ApiTokenData
}

interface VerifyOtpApiResponse {
  login_data?: ApiTokenData
  message?: string
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
      const data = await authService.registerOrganisation(payload)

      this.setUserEmail(data.email)
      // this.otpPurpose = 'signup'

      return data
    },

    async login(payload: LoginPayload) {
      const response = await authService.login(payload)

      const responseBody = response as unknown as WrappedApiResponse
      console.log('login responseBody', responseBody)
      const authData = responseBody.data

      if (!authData?.access_token) {
        throw new Error('Login response missing access token.')
      }

      this.handleLoginSuccess(authData.access_token)
      this.setUserEmail(payload.email)

      return true
    },

    async verifyOTP(payload: VerifyOTPPayload) {
      const data = await authService.verifyOtp(payload)
      const responseData = data as unknown as VerifyOtpApiResponse

      if (responseData?.login_data?.access_token) {
        this.handleLoginSuccess(
          responseData.login_data.access_token,
          responseData.login_data.user
        )
      } else {
        this.setAccessToken(null)
        this.user = null
      }

      return data
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
    
    // async refreshToken() {
    //   const refreshToken = localStorage.getItem('refreshToken')

    //   if (!refreshToken) {
    //     return
    //   }

    //   const data = await authService.refreshToken({ refresh_token: refreshToken })

    //   this.setAccessToken(data.access_token)
    // },
    
  },
})
