import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/auth-store'
import themedSwal from '@/lib/swal'

// Default to staging; override via VITE_API_BASE_URL for prod or other environments.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.legalwatch.dog/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 90000,
  headers: {
    'Content-Type': 'application/json',
  },
})

type RetryableAxiosRequestConfig = AxiosRequestConfig & { _retry?: boolean }

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

let isSessionExpiredAlertActive = false
let refreshPromise: Promise<string> | null = null

const showSessionExpiredAlert = () => {
  if (isSessionExpiredAlertActive) return
  isSessionExpiredAlertActive = true
  void themedSwal
    .fire({
      title: 'Session timed out',
      text: 'Your session timed out. Please log in again to continue.',
      icon: 'warning',
      confirmButtonText: 'Login again',
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: true,
      showCancelButton: false,
    })
    .finally(() => {
      isSessionExpiredAlertActive = false
      const redirectPath = window.location.pathname + window.location.search + window.location.hash
      void router.push({ name: 'login', query: { redirect: redirectPath } })
    })
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status
    const originalRequest = error.config as RetryableAxiosRequestConfig
    const isRefreshRequest = originalRequest?.url?.includes('/auth/token/refresh')

    if (status === 401) {
      const auth = useAuthStore()
      const hasRefreshToken = !!auth.refreshToken

      if (hasRefreshToken && !originalRequest?._retry && !isRefreshRequest) {
        if (!refreshPromise) {
          refreshPromise = auth
            .refreshTokens()
            .finally(() => {
              refreshPromise = null
            })
        }

        try {
          const newAccessToken = await refreshPromise
          originalRequest._retry = true
          originalRequest.headers = originalRequest.headers ?? {}
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return api(originalRequest)
        } catch (refreshError) {
          auth.clearAuthState()
          showSessionExpiredAlert()
          return Promise.reject(refreshError)
        }
      }

      auth.clearAuthState()
      showSessionExpiredAlert()
    }
    return Promise.reject(error)
  },
)

export default api
