import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './features/auth/store'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

await useAuthStore().refreshToken()

app.mount('#app')
