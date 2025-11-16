import { createRouter, createWebHistory } from 'vue-router'
// import HomePage from '@/screens/HomePage.vue'
import WailistPage from '@/screens/WailistPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: HomePage,
    // },
        {
      path: '/',
      name: 'waitlist',
      component: WailistPage,
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
