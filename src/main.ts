import './assets/styles/main.css'

import App from './App.vue'
import { routes } from './router'
import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg'
import { setRouter } from './router/instance'

export const createApp = ViteSSG(
  App,
  { routes, scrollBehavior: () => ({ top: 0 }) },
  ({ app, router }) => {
    const pinia = createPinia()
    setRouter(router)
    app.use(pinia)
  },
)
