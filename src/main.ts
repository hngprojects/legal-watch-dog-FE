import './assets/styles/main.css'

import App from './App.vue'
import { routes } from './router'
import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg'
import { useAuthStore } from './stores/auth-store'
import { setRouter } from './router/instance'

export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior: () => ({ top: 0 }) },
  ({ app, router }) => {
    const pinia = createPinia()
    setRouter(router)
    app.use(pinia)

    router.beforeEach(async (to) => {
      const auth = useAuthStore()

      if (!import.meta.env.SSR) {
        auth.syncAuthFromStorage()
      }

      const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
      const isAuthRoute = to.name === 'login' || to.name === 'signup'
      const isOtpRoute = to.name === 'otp'

      if (to.name === 'auth-status') {
        const issued = to.query.issued === 'true'
        if (auth.isAuthenticated || issued) return true
        return { name: 'login', query: { redirect: to.fullPath } }
      }

      if (isOtpRoute) return true

      if (isAuthRoute && auth.isAuthenticated) {
        return { name: 'dashboard' }
      }

      if (!requiresAuth) return true

      if (auth.isAuthenticated) return true

      return { name: 'login', query: { redirect: to.fullPath } }
    })
  },
)
