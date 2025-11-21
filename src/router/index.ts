import DashboardLayout from '@/layout/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth-store'
import ComingSoonView from '@/views/ComingSoonView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'
import JurisdictionView from '@/views/dashboard/JurisdictionView.vue'
import ProjectView from '@/views/dashboard/ProjectView.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import HomeView from '@/views/HomeView.vue'
import HowItWorksView from '@/views/HowItWorksView.vue'
import LoginView from '@/views/LoginView.vue'
import OnboardingView from '@/views/OnboardingView.vue'
import OtpView from '@/views/OtpView.vue'
import SignupView from '@/views/SignupView.vue'
import SkeletonView from '@/views/SkeletonView.vue'
import SuccessView from '@/views/SuccessView.vue'
import WaitlistView from '@/views/WaitlistView.vue'
import { createRouter, createWebHistory } from 'vue-router'

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
      props: true,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassword
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

  try {
    await auth.refreshToken()
  } catch (error) {
    console.error('Failed to refresh token before navigation', error)
  }

  if (!auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  return true
})

export default router
