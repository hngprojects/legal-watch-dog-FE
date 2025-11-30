import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

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

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      const auth = useAuthStore()
      auth.clearAuthState()
    }
    return Promise.reject(error)
  },
)

export default api
