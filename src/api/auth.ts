import axios from 'axios'
import type {
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  PasswordResetConfirmPayload,
  PasswordResetConfirmResponse,
  PasswordResetRequestPayload,
  PasswordResetRequestResponse,
  PasswordResetVerifyPayload,
  PasswordResetVerifyResponse,
  RefreshTokenPayload,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
  AppleSignInPayload,
  AppleSignInResponse,
  MicrosoftOAuthLoginResponse,
  ResendOtpPayload,
  ResendOtpResponse,
  VerifyOTPPayload,
  VerifyOtpResponse,
  GoogleProfileResponse,
} from '@/types/auth'
import { API_BASE_URL } from '@/lib/config'

const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 20000,
})

const bearerHeader = (token?: string | null) =>
  token ? { Authorization: `Bearer ${token}` } : undefined

export const authService = {
  registerUser: (payload: RegisterPayload) =>
    http.post<RegisterResponse>('/auth/register', payload),

  login: (payload: LoginPayload) => http.post<LoginResponse>('/auth/login', payload),

  logout: (token?: string | null) =>
    http.post<LogoutResponse>('/auth/logout', {}, { headers: bearerHeader(token) }),

  verifyOtp: (payload: VerifyOTPPayload) =>
    http.post<VerifyOtpResponse>('/auth/otp/verification', payload),

  resendOtp: (payload: ResendOtpPayload) =>
    http.post<ResendOtpResponse>('/auth/otp/requests', payload),

  requestPasswordReset: (payload: PasswordResetRequestPayload) =>
    http.post<PasswordResetRequestResponse>('/auth/password/resets', payload),

  verifyPasswordReset: (payload: PasswordResetVerifyPayload) =>
    http.post<PasswordResetVerifyResponse>('/auth/password/resets/verification', payload),

  confirmPasswordReset: (payload: PasswordResetConfirmPayload) =>
    http.post<PasswordResetConfirmResponse>('/auth/password/resets/confirmation', payload),

  refreshToken: (payload: RefreshTokenPayload) =>
    http.post<RefreshTokenResponse>('/auth/token/refresh', payload),

  getMicrosoftLoginUrl: (redirectUri?: string | null) =>
    http.get<MicrosoftOAuthLoginResponse>('/oauth/microsoft/login', {
      params: redirectUri ? { redirect_uri: redirectUri } : undefined,
    }),

  getGoogleLoginUrl: () => `${API_BASE_URL}/oauth/google/login`,

  getGoogleProfile: () => http.get<GoogleProfileResponse>('/oauth/google/profile'),

  appleSignIn: (payload: AppleSignInPayload) =>
    http.post<AppleSignInResponse>('/auth/apple/signin', payload),
}
