import axios from 'axios'
import type {
 AuthError,
  FailureResponse,
  ForgetPasswordPayload,
  ForgetPasswordResponse,
  LoginOtpChallenge,
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  VerifyOTPPayload,
  VerifyOtpResponse,
} from '@/types/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://minamoto.emerj.net/api/api/v1'

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 20000,
})

const isAuthError = (obj: unknown): obj is AuthError => {
  if (!obj || typeof obj !== 'object') return false
  // Narrow by presence of detail array
  const o = obj as Record<string, unknown>
  return Array.isArray(o.detail)
}

const isFailureResponse = (obj: unknown): obj is FailureResponse => {
  if (!obj || typeof obj !== 'object') return false
  const o = obj as Record<string, unknown>
  return typeof o.status === 'string' && typeof o.message === 'string'
}

const extractErrorMessage = (err: unknown, fallback = 'Request failed'): string => {
  // Narrow Axios errors first
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as unknown
    if (isAuthError(data)) {
      const first = data.detail && data.detail[0]
      if (first && typeof first.msg === 'string') return first.msg
    }

    if (isFailureResponse(data) && typeof data.message === 'string') return data.message

    // fallback to axios error message
    return err.message ?? fallback
  }

  // Non-axios Error instances
  if (err instanceof Error) return err.message

  return String(err ?? fallback)
}
const bearerHeader = (token?: string | null) =>
  token ? { Authorization: `Bearer ${token}` } : undefined

export const authService = {
  registerOrganisation: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    try {
      const res = await http.post<RegisterResponse>('/auth/register', payload)
      return res.data
    } catch (err: unknown) {
      throw new Error(extractErrorMessage(err, 'Registration failed'))
    }
  },

  login: async (payload: LoginPayload): Promise<LoginResponse | LoginOtpChallenge> => {
    try {
      const res = await http.post<LoginResponse | LoginOtpChallenge>('/auth/login', payload)
      return res.data
    } catch (err: unknown) {
      throw new Error(extractErrorMessage(err, 'Login failed'))
    }
  },

  logout: async (token?: string | null): Promise<LogoutResponse> => {
    try {
      const res = await http.post<LogoutResponse>(
        '/auth/logout',
        {},
        { headers: bearerHeader(token) }
      )
      return res.data
    } catch (err: unknown) {
      throw new Error(extractErrorMessage(err, 'Logout failed'))
    }
  },

  verifyOtp: async (payload: VerifyOTPPayload): Promise<VerifyOtpResponse> => {
    try {
      const res = await http.post<VerifyOtpResponse>('/auth/verify-otp', payload)
      return res.data
    } catch (err: unknown) {
      throw new Error(extractErrorMessage(err, 'OTP verification failed'))
    }
  },

  refreshToken: async (): Promise<RefreshTokenResponse> => {
    try {
      const res = await http.post<RefreshTokenResponse>('/auth/refresh', {})
      return res.data
    } catch (err: unknown) {
      throw new Error(extractErrorMessage(err, 'Token refresh failed'))
    }
  },

  forgetPassword: async (payload: ForgetPasswordPayload): Promise<ForgetPasswordResponse> => {
    try {
      const res = await http.post<ForgetPasswordResponse>(
        '/auth/password-reset/request',
        payload,
      )
      return res.data
    } catch (err: unknown) {
      throw new Error(extractErrorMessage(err, 'Password reset request failed'))
    }
  },
  
  verifyResetOtp: async (payload: VerifyOTPPayload): Promise<unknown> => {
    try {
      const res = await http.post('/auth/password-reset/verify-otp', payload)
      return res.data
    } catch (err: unknown) {
      throw new Error(extractErrorMessage(err, 'OTP verification failed'))
    }
  },

  resetPassword: async (payload: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
    try {
      const res = await http.post<ResetPasswordResponse>(
        '/auth/password-reset/confirm',
        payload,
      )
      return res.data
    } catch (err: unknown) {
      throw new Error(extractErrorMessage(err, 'Reset password failed'))
    }
  },
  
}
