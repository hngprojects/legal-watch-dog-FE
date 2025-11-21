import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://minamoto.emerj.net/api/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const auth = useAuthStore()
    const token = auth.accessToken

    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

let refreshPromise: Promise<unknown> | null = null

const refreshSession = async () => {
  const auth = useAuthStore()
  if (!refreshPromise) {
    refreshPromise = auth
      .refreshSession()
      .catch((refreshError) => {
        auth.clearAuthState()
        throw refreshError
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    const isAuthRefreshCall = originalRequest?.url?.includes('/auth/refresh')

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthRefreshCall) {
      originalRequest._retry = true

      try {
        await refreshSession()
        const auth = useAuthStore()
        if (!auth.accessToken) {
          auth.clearAuthState()
          return Promise.reject(error)
        }

        originalRequest.headers = originalRequest.headers ?? {}
        originalRequest.headers.Authorization = `Bearer ${auth.accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        const auth = useAuthStore()
        auth.clearAuthState()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  },
)

export default api
