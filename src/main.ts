import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import "vue-sonner/style.css"
import { createConfirmDialog } from "@/composables/useConfirmDialog"


const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(createConfirmDialog())

app.mount('#app')

const loadingScreen = document.getElementById('loading-screen')
if (loadingScreen) {
  loadingScreen.style.opacity = '0'
  loadingScreen.style.transition = 'opacity 0.3s ease-out'
  setTimeout(() => {
    loadingScreen.remove()
  }, 300)
}
