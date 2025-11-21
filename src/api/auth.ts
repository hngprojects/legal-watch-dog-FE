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
  RefreshTokenPayload,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  VerifyOTPPayload,
  VerifyOtpResponse,
} from '@/types/auth'
import { mockAuthService } from '@/mocks/mock-auth-service'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://minamoto.emerj.net/api/api/v1'
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true'

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
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

const httpAuthService = {
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
      const res = await http.post<LoginResponse | LoginOtpChallenge>('/auth/login', payload, {
        withCredentials: true,
      })
      return res.data
    } catch (err: unknown) {
      throw new Error(extractErrorMessage(err, 'Login failed'))
    }
  },

  logout: async (token: string | null): Promise<LogoutResponse> => {
    try {
      const res = await http.post<LogoutResponse>(
        '/auth/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true },
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

  refreshToken: async (payload: RefreshTokenPayload): Promise<RefreshTokenResponse> => {
    try {
      const res = await http.post<RefreshTokenResponse>('/auth/refresh', payload, {
        withCredentials: true,
      })
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

export const authService = USE_MOCK_API ? mockAuthService : httpAuthService
