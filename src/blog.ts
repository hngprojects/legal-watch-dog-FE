import './assets/styles/main.css'

import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router/blog'
import { createPinia } from 'pinia'

export const createApp = ViteSSG(App, { routes }, ({ app }) => {
  const pinia = createPinia()
  app.use(pinia)
})
