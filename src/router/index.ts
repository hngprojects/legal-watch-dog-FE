import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import WaitlistView from '@/views/WaitlistView.vue'
import LoginView from '@/views/authentication/LoginView.vue'
import SignupView from '@/views/authentication/SignupView.vue'
import OtpView from '@/views/authentication/OtpView.vue'
import SuccessView from '@/views/authentication/SuccessView.vue'
import SkeletonView from '@/views/SkeletonView.vue'
import ComingSoonView from '@/views/ComingSoonView.vue'
import HowItWorksView from '@/views/HowItWorksView.vue'
import OnboardingView from '@/views/OnboardingView.vue'
import DashboardLayout from '@/layout/DashboardLayout.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import ProjectView from '@/views/dashboard/ProjectView.vue'
import JurisdictionView from '@/views/dashboard/JurisdictionView.vue'
import { useAuthStore } from '@/stores/auth-store'

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
      path: '/how-it-works',
      name: 'how-it-works',
      component: HowItWorksView,
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
      path: '/onboarding',
      name: 'onboarding',
      component: OnboardingView,
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
      component: ComingSoonView,
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView,
          meta: { requiresAuth: true },
        },
        {
          path: 'projects',
          name: 'projects',
          component: ProjectView,
          alias: '/projects',
          meta: { requiresAuth: true },
        },
        {
          path: 'jurisdictions',
          name: 'jurisdictions',
          component: JurisdictionView,
          alias: '/jurisdictions',
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (!requiresAuth) {
    return true
  }

  const auth = useAuthStore()

  if (auth.isAuthenticated) {
    return true
  }

  return { name: 'login', query: { redirect: to.fullPath } }
})

export default router
