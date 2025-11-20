import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import WaitlistView from '@/views/WaitlistView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import OtpView from '@/views/OtpView.vue'
import SuccessView from '@/views/SuccessView.vue'
import SkeletonView from '@/views/SkeletonView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/waitlist',
      name: 'waitlist',
      component: WaitlistView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/otp',
      name: 'otp',
      component: OtpView,
    },
    {
      path: '/success',
      name: 'success',
      component: SuccessView,
    },
    {
      path: '/skeleton',
      name: 'skeleton',
      component: SkeletonView,
    },
        {
      path: '/coming-soon',
      name: 'coming-soon',
      component: NotFoundView,
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
