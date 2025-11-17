import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import WailistPage from '@/pages/WailistPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/waitlist',
      name: 'waitlist',
      component: WailistPage,
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
