import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/screens/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
