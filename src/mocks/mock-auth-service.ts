import type {
  LoginOtpChallenge,
  LoginPayload,
  LoginResponse,
  LogoutResponse,
  OtpPurpose,
  RefreshTokenPayload,
  RefreshTokenResponse,
  RegisterPayload,
  RegisterResponse,
  VerifyOTPPayload,
  VerifyOtpResponse,
} from '@/types/auth'

type ServiceResponse<T> = Promise<{ data: T }>

interface StoredUser {
  id: string
  name: string
  email: string
  password: string
  industry: string
  createdAt: string
  verified: boolean
  onboarded: boolean
}

interface StoredOtp {
  code: string
  expiresAt: number
  purpose: OtpPurpose
}

interface Session {
  email: string
  accessToken: string
  refreshToken: string
  expiresAt: number
}

const STORAGE_PREFIX = 'legal-watchdog:mock-auth'
const USERS_KEY = `${STORAGE_PREFIX}:users`
const OTP_KEY = `${STORAGE_PREFIX}:otps`
const SESSIONS_KEY = `${STORAGE_PREFIX}:sessions`

const ONE_HOUR_IN_MS = 1000 * 60 * 60

const readFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const rawValue = localStorage.getItem(key)
    return rawValue ? (JSON.parse(rawValue) as T) : fallback
  } catch {
    return fallback
  }
}

const writeToStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const randomId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `id-${Math.random().toString(36).slice(2, 10)}`
}

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString()

const delay = <T>(dataFactory: () => T, ms = 400): ServiceResponse<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ data: dataFactory() }), ms)
  })

const rejectWithMessage = (message: string, status = 400): Promise<never> =>
  new Promise((_, reject) => {
    setTimeout(() => {
      const error = new Error(message) as Error & {
        response?: { status: number; data: { message: string } }
      }
      error.response = { status, data: { message } }
      reject(error)
    }, 400)
  })

const getUsers = () => readFromStorage<StoredUser[]>(USERS_KEY, [])
const saveUsers = (users: StoredUser[]) => writeToStorage(USERS_KEY, users)

const getOtpStore = () => readFromStorage<Record<string, StoredOtp>>(OTP_KEY, {})
const saveOtpStore = (store: Record<string, StoredOtp>) => writeToStorage(OTP_KEY, store)

const issueOtp = (email: string, purpose: OtpPurpose) => {
  const otpStore = getOtpStore()
  otpStore[email] = {
    code: generateOtp(),
    expiresAt: Date.now() + 5 * 60 * 1000,
    purpose,
  }
  saveOtpStore(otpStore)
}

const getSessions = () => readFromStorage<Session[]>(SESSIONS_KEY, [])
const saveSessions = (sessions: Session[]) => writeToStorage(SESSIONS_KEY, sessions)

const upsertSession = (email: string): Session => {
  const sessions = getSessions().filter((session) => session.email !== email)

  const session: Session = {
    email,
    accessToken: randomId(),
    refreshToken: randomId(),
    expiresAt: Date.now() + ONE_HOUR_IN_MS,
  }

  sessions.push(session)
  saveSessions(sessions)

  return session
}

const findSessionByRefreshToken = (token: string) =>
  getSessions().find((session) => session.refreshToken === token)

const removeSessionByAccessToken = (token: string | null) => {
  if (!token) return
  const nextSessions = getSessions().filter((session) => session.accessToken !== token)
  saveSessions(nextSessions)
}

const createLoginResponse = (user: StoredUser, session: Session): LoginResponse => {
  const [firstName, ...rest] = user.name.split(' ')
  const lastName = rest.join(' ')

  return {
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
    token_type: 'bearer',
    expires_in: Math.floor((session.expiresAt - Date.now()) / 1000),
    user: {
      id: user.id,
      first_name: firstName || user.name,
      last_name: lastName || 'Team',
      email: user.email,
      role: 'admin',
      organisation_id: user.id,
      industry: user.industry,
      onboarded: user.onboarded,
    },
  } as LoginResponse
}

export const mockAuthService = {
  registerOrganisation: (payload: RegisterPayload): ServiceResponse<RegisterResponse> => {
    const users = getUsers()
    const email = payload.email.toLowerCase()

    if (users.some((user) => user.email === email)) {
      return rejectWithMessage('An account with this email already exists.')
    }

    const newUser: StoredUser = {
      id: randomId(),
      name: payload.name,
      email,
      password: payload.password,
      industry: payload.industry,
      createdAt: new Date().toISOString(),
      verified: false,
      onboarded: false,
    }

    users.push(newUser)
    saveUsers(users)

    issueOtp(email, 'signup')

    return delay(() => ({
      message: 'Registration successful. Check your email for an OTP code.',
      email,
    }))
  },

  login: (payload: LoginPayload): ServiceResponse<LoginResponse | LoginOtpChallenge> => {
    const users = getUsers()
    const email = payload.email.toLowerCase()
    const user = users.find((item) => item.email === email && item.password === payload.password)

    if (!user) {
      return rejectWithMessage('Invalid email or password.', 401)
    }

    if (!user.verified) {
      issueOtp(email, 'signup')
      return delay(() => ({
        requires_otp: true,
        email,
        otp_purpose: 'signup',
        message: 'Verify your signup OTP before logging in.',
      }))
    }

    issueOtp(email, 'login')

    return delay(() => ({
      requires_otp: true,
      email,
      otp_purpose: 'login',
      message: 'Enter the OTP sent to your email to finish signing in.',
    }))
  },

  logout: (token: string | null): ServiceResponse<LogoutResponse> => {
    removeSessionByAccessToken(token)
    return delay(() => ({
      message: 'Logged out successfully.',
      success: true,
    }))
  },

  verifyOtp: (payload: VerifyOTPPayload): ServiceResponse<VerifyOtpResponse> => {
    const otpStore = getOtpStore()
    const email = payload.email.toLowerCase()
    const record = otpStore[email]

    if (!record) {
      return rejectWithMessage('No OTP request found for this email.')
    }

    if (record.expiresAt < Date.now()) {
      delete otpStore[email]
      saveOtpStore(otpStore)
      return rejectWithMessage('OTP has expired. Please request a new one.')
    }

    if (record.code !== payload.code) {
      return rejectWithMessage('Invalid OTP provided.')
    }

    delete otpStore[email]
    saveOtpStore(otpStore)

    const users = getUsers()
    const targetUser = users.find((user) => user.email === email)

    if (!targetUser) {
      return rejectWithMessage('Account not found. Please sign up first.')
    }

    if (record.purpose === 'signup') {
      targetUser.verified = true
      saveUsers(users)

      return delay(() => ({
        message: 'Email verified successfully. You can now log in.',
        otp_purpose: 'signup',
        next: 'login',
      }))
    }

    if (!targetUser.verified) {
      return rejectWithMessage('Please verify your email before logging in.', 403)
    }

    const session = upsertSession(email)

    return delay(() => ({
      message: 'OTP verified. Redirecting to your dashboard.',
      otp_purpose: 'login',
      next: 'dashboard',
      login_data: createLoginResponse(targetUser, session),
    }))
  },

  refreshToken: (payload: RefreshTokenPayload): ServiceResponse<RefreshTokenResponse> => {
    const currentSession = findSessionByRefreshToken(payload.refresh_token)

    if (!currentSession) {
      return rejectWithMessage('Invalid refresh token.', 401)
    }

    const session = upsertSession(currentSession.email)
    return delay(() => ({
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
      token_type: 'bearer',
      expires_in: Math.floor((session.expiresAt - Date.now()) / 1000),
    }))
  },
}
