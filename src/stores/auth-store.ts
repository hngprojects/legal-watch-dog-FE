import { defineStore } from 'pinia'
import { authService } from '@/api/auth'
import { userService } from '@/api/user'
import type {
  LoginPayload,
  RegisterPayload,
  RegisterResponse,
  ResendOtpPayload,
  VerifyOTPPayload,
  PasswordResetRequestPayload,
  PasswordResetVerifyPayload,
  PasswordResetConfirmPayload,
  PasswordResetVerifyResponse,
  PasswordResetConfirmResponse,
  VerifyOtpResponse,
} from '@/types/auth'
import type { UserProfile } from '@/types/user'

interface Organisation {
  id: string
  name: string
  created_at: string
}

type User = UserProfile & {
  organisation_id?: string
}

interface State {
  accessToken: string | null
  user: User | null
  email: string | null
  organisation: Organisation | null
  otpPurpose: 'signup' | 'password-reset' | null
  resetToken: string | null
  signupDraft: SignupDraft | null
  resetPasswordDraft: ResetPasswordDraft | null
  rememberMePreference: boolean
}

interface ApiTokenData {
  access_token: string
  refresh_token?: string
  token_type?: string
  expires_in?: number
  user?: User
}

interface LoginApiResponse {
  status: string
  status_code: number
  message: string
  data: ApiTokenData
}

interface ResendOtpApiResponse {
  status?: string
  message?: string
  status_code?: number
}

interface SignupDraft {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface ResetPasswordDraft {
  newPassword: string
  confirmPassword: string
}

const TOKEN_KEY = 'lwd_access_token'
const EMAIL_KEY = 'lwd_user_email'
const REMEMBER_ME_KEY = 'lwd_remember_me'

const getStoredValue = (key: string) => localStorage.getItem(key) ?? sessionStorage.getItem(key)

const clearStoredValue = (key: string) => {
  localStorage.removeItem(key)
  sessionStorage.removeItem(key)
}

const setStoredValue = (key: string, value: string, persist: boolean) => {
  clearStoredValue(key)
  ;(persist ? localStorage : sessionStorage).setItem(key, value)
}

const getStoredRememberPreference = () => {
  const stored =
    localStorage.getItem(REMEMBER_ME_KEY) ?? sessionStorage.getItem(REMEMBER_ME_KEY) ?? 'false'
  return stored === 'true'
}

const setStoredRememberPreference = (remember: boolean) => {
  localStorage.setItem(REMEMBER_ME_KEY, String(remember))
  sessionStorage.setItem(REMEMBER_ME_KEY, String(remember))
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    accessToken: getStoredValue(TOKEN_KEY),
    user: null,
    email: getStoredValue(EMAIL_KEY),
    organisation: null,
    otpPurpose: null,
    resetToken: null,
    signupDraft: null,
    resetPasswordDraft: null,
    rememberMePreference: getStoredRememberPreference(),
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    setAccessToken(token: string | null, rememberMe = this.rememberMePreference ?? true) {
      const persist = rememberMe ?? this.rememberMePreference ?? true
      this.accessToken = token
      if (token) {
        setStoredValue(TOKEN_KEY, token, persist)
      } else {
        clearStoredValue(TOKEN_KEY)
      }
    },

    setUserEmail(email: string | null, rememberMe = this.rememberMePreference ?? true) {
      const persist = rememberMe ?? this.rememberMePreference ?? true
      this.email = email
      if (email) {
        setStoredValue(EMAIL_KEY, email, persist)
      } else {
        clearStoredValue(EMAIL_KEY)
      }
    },

    setRememberPreference(rememberMe: boolean) {
      this.rememberMePreference = rememberMe
      setStoredRememberPreference(rememberMe)
    },

    setOtpPurpose(purpose: 'signup' | 'password-reset' | null) {
      this.otpPurpose = purpose
    },

    setResetToken(token: string | null) {
      this.resetToken = token
    },

    setSignupDraft(draft: SignupDraft | null) {
      this.signupDraft = draft
    },

    clearSignupDraft() {
      this.signupDraft = null
    },

    setResetPasswordDraft(draft: ResetPasswordDraft | null) {
      this.resetPasswordDraft = draft
    },

    clearResetPasswordDraft() {
      this.resetPasswordDraft = null
    },

    clearAuthState() {
      this.email = null
      this.user = null
      this.organisation = null
      this.accessToken = null
      this.otpPurpose = null
      this.resetToken = null
      this.signupDraft = null
      this.resetPasswordDraft = null
      clearStoredValue(TOKEN_KEY)
      clearStoredValue(EMAIL_KEY)
    },

    handleLoginSuccess(token: string, rememberMe: boolean, user?: User) {
      this.setRememberPreference(rememberMe)
      this.setAccessToken(token, rememberMe)
      if (user) {
        this.user = user
      }
    },

    async register(payload: RegisterPayload) {
      const response = await authService.registerUser(payload)
      const responseBody = response.data as RegisterResponse
      const registeredEmail = responseBody?.data?.email || payload.email
      this.setUserEmail(registeredEmail)
      this.setOtpPurpose('signup')
      this.setResetToken(null)
      return responseBody
    },
    async login(payload: LoginPayload, rememberMe = this.rememberMePreference ?? false) {
      const response = await authService.login(payload)
      const responseBody = response.data as unknown as LoginApiResponse
      const authData = responseBody.data

      if (!authData?.access_token) {
        throw new Error('Login response missing access token.')
      }

      const persist = rememberMe ?? this.rememberMePreference ?? false
      this.handleLoginSuccess(authData.access_token, persist, authData.user)
      this.setUserEmail(payload.email, persist)

      return true
    },

    async verifyOTP(payload: VerifyOTPPayload) {
      const response = await authService.verifyOtp({
        ...payload,
        otp_purpose: payload.otp_purpose ?? this.otpPurpose ?? 'signup',
      })
      const responseBody = response.data as VerifyOtpResponse
      const authData = responseBody.data ?? responseBody.login_data

      const persist = this.rememberMePreference ?? true
      this.setUserEmail(payload.email, persist)

      if (authData?.access_token) {
        this.handleLoginSuccess(authData.access_token, persist, authData.user as User | undefined)
      }

      this.setOtpPurpose(null)
      return responseBody
    },

    async resendOTP(email: string) {
      const payload: ResendOtpPayload = {
        email,
        otp_purpose: this.otpPurpose ?? 'signup',
      }
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

    async loadCurrentUser(): Promise<UserProfile | null> {
      if (!this.accessToken) return null
      try {
        const response = await userService.getCurrentUser()
        const payload = response.data?.data
        const apiUser =
          (payload && typeof payload === 'object' && 'user' in payload
            ? (payload as { user?: UserProfile }).user
            : (payload as UserProfile | undefined)) ?? null
        if (apiUser) {
          this.user = apiUser as User
          return apiUser
        }
      } catch (error) {
        const status = (error as { response?: { status?: number } })?.response?.status
        if (status === 401) {
          this.clearAuthState()
        }
      }
      return null
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
