import axios from 'axios'
import type {
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
  VerifyOTPPayload,
  ForgetPasswordPayload,
  ForgetPasswordResponse,
  ResetPasswordPaylod,
  ResetPasswordResponse,
  AuthError,
  FailureResponse,
} from './types'

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

export const authService = {
  registerOrganisation: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    try {
      const res = await axios.post<RegisterResponse>('/api/api/v1/auth/register', payload)
      return res.data
    } catch (err: unknown) {
      throw new Error(extractErrorMessage(err, 'Registration failed'))
    }
  },

  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    try {
      const res = await axios.post<LoginResponse>('/api/api/v1/auth/login', payload, {
        withCredentials: true,
      })
      return res.data
    } catch (err: unknown) {
      throw new Error(extractErrorMessage(err, 'Login failed'))
    }
  },

  logout: async (token: string | null): Promise<LogoutResponse> => {
    try {
      const res = await axios.post<LogoutResponse>(
        '/api/api/v1/auth/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true },
      )
      return res.data
    } catch (err: unknown) {
      throw new Error(extractErrorMessage(err, 'Logout failed'))
    }
  },

  verifyOtp: async (payload: VerifyOTPPayload): Promise<unknown> => {
    try {
      const res = await axios.post('/api/api/v1/auth/verify-otp', payload)
      return res.data
    } catch (err: unknown) {
      throw new Error(extractErrorMessage(err, 'OTP verification failed'))
    }
  },

  refreshToken: async (payload: RefreshTokenPayload): Promise<RefreshTokenResponse> => {
    try {
      const res = await axios.post<RefreshTokenResponse>('/api/api/v1/auth/refresh', payload, {
        withCredentials: true,
      })
      return res.data
    } catch (err: unknown) {
      throw new Error(extractErrorMessage(err, 'Token refresh failed'))
    }
  },

  forgetPassword: async (payload: ForgetPasswordPayload): Promise<ForgetPasswordResponse> => {
    try {
      const res = await axios.post<ForgetPasswordResponse>(
        '/api/api/v1/auth/password-reset/request',
        payload,
      )
      return res.data
    } catch (err: unknown) {
      throw new Error(extractErrorMessage(err, 'Password reset request failed'))
    }
  },

  verifyResetOtp: async (payload: VerifyOTPPayload): Promise<unknown> => {
    try {
      const res = await axios.post('/api/api/v1/password-reset/verify-otp', payload)
      return res.data
    } catch (err: unknown) {
      throw new Error(extractErrorMessage(err, 'OTP verification failed'))
    }
  },

  resetPassword: async (payload: ResetPasswordPaylod): Promise<ResetPasswordResponse> => {
    try {
      const res = await axios.post<ResetPasswordResponse>(
        '/api/api/v1/auth/password-reset/confirm',
        payload,
      )
      return res.data
    } catch (err: unknown) {
      throw new Error(extractErrorMessage(err, 'Reset password failed'))
    }
  },
}
