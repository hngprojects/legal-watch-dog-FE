import './assets/styles/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)

if (!import.meta.env.SSR) {
  app.use(createPinia())
  app.use(router)
}

app.mount('#app')

const loadingScreen = document.getElementById('loading-screen')
if (loadingScreen) {
  loadingScreen.style.opacity = '0'
  loadingScreen.style.transition = 'opacity 0.3s ease-out'
  setTimeout(() => {
    loadingScreen.remove()
  }, 300)
}
