import axios from 'axios'
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

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      const auth = useAuthStore()
      auth.clearAuthState()

       if (!isSessionExpiredAlertActive) {
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
             const redirectPath =
               window.location.pathname + window.location.search + window.location.hash
             void router.push({ name: 'login', query: { redirect: redirectPath } })
           })
       }
     }
    return Promise.reject(error)
  },
)

export default api
