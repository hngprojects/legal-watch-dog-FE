import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

const api = axios.create({
  baseURL: 'https://minamoto.emerj.net/api/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const auth = useAuthStore()
    const token = auth.accessToken

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const auth = useAuthStore()

        if (!auth.isAuthenticated || !auth.accessToken) {
          return Promise.reject(error)
        }

        const res = await auth.refreshToken()

        if (res) {
          originalRequest.headers.Authorization = `Bearer ${res.access_token}`
          localStorage.setItem('refreshToken', res.refresh_token)
          return api(originalRequest)
        } else {
          return Promise.reject(error)
        }
      } catch (error) {
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  },
)

export default api
