import { defineStore } from 'pinia'
import { authService } from '@/api/auth'
import type {
  LoginPayload,
  RegisterPayload,
  ResendOtpPayload,
  VerifyOTPPayload,
  PasswordResetRequestPayload,
  PasswordResetVerifyPayload,
  PasswordResetConfirmPayload,
  PasswordResetVerifyResponse,
  PasswordResetConfirmResponse,
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
  otpPurpose: 'signup' | 'password-reset' | null
  resetToken: string | null
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

interface ResendOtpApiResponse {
  status?: string
  message?: string
  status_code?: number
}

const TOKEN_KEY = 'lwd_access_token'
const EMAIL_KEY = 'lwd_user_email'

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    accessToken: localStorage.getItem(TOKEN_KEY),
    user: null,
    email: localStorage.getItem(EMAIL_KEY),
    organisation: null,
    otpPurpose: null,
    resetToken: null,
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

    setOtpPurpose(purpose: 'signup' | 'password-reset' | null) {
      this.otpPurpose = purpose
    },

    setResetToken(token: string | null) {
      this.resetToken = token
    },

    clearAuthState() {
      this.email = null
      this.user = null
      this.organisation = null
      this.accessToken = null
      this.otpPurpose = null
      this.resetToken = null
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
      this.setOtpPurpose('signup')
      this.setResetToken(null)
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
      const userData = responseBody.data

      if (userData) {
        this.user = null
        this.setOtpPurpose(null)
        return { ...responseBody, next: 'login' }
      }
    },

    async resendOTP(email: string) {
      const payload: ResendOtpPayload = { email }
      const response = await authService.resendOtp(payload)
      const responseBody = response.data as unknown as ResendOtpApiResponse
      this.setUserEmail(email)
      return responseBody
    },

    async requestPasswordReset(email: string) {
      const payload: PasswordResetRequestPayload = { email }
      const response = await authService.requestPasswordReset(payload)
      this.setUserEmail(email)
      this.setOtpPurpose('password-reset')
      this.setResetToken(null)
      return response.data
    },

    async verifyPasswordReset(payload: PasswordResetVerifyPayload) {
      const response = await authService.verifyPasswordReset(payload)
      const responseBody = response.data as PasswordResetVerifyResponse
      this.setOtpPurpose('password-reset')
      const token = responseBody?.reset_token ?? responseBody?.data?.reset_token
      if (token) this.setResetToken(token)
      return responseBody
    },

    async confirmPasswordReset(payload: PasswordResetConfirmPayload) {
      const response = await authService.confirmPasswordReset(payload)
      const responseBody = response.data as PasswordResetConfirmResponse
      this.clearAuthState()
      return responseBody
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
