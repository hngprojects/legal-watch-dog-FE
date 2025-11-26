import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutUsView from '@/views/AboutUsView.vue'
import WaitlistView from '@/views/WaitlistView.vue'
import LoginView from '@/views/authentication/LoginView.vue'
import SignupView from '@/views/authentication/SignupView.vue'
import OtpView from '@/views/authentication/OtpView.vue'
import SuccessView from '@/views/authentication/SuccessView.vue'
import SkeletonView from '@/views/SkeletonView.vue'
import OnboardingView from '@/views/OnboardingView.vue'
import PrivacyPolicyView from '@/views/PrivacyPolicyView.vue'
import DashboardLayout from '@/layout/DashboardLayout.vue'
import ProjectView from '@/views/dashboard/ProjectView.vue'
import JurisdictionView from '@/views/dashboard/JurisdictionView.vue'
import { useAuthStore } from '@/stores/auth-store'
import ForgotPasswordView from '@/views/authentication/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/authentication/ResetPasswordView.vue'
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
      path: '/about-us', // New Route
      name: 'about-us',
      component: AboutUsView,
    },
    {
      path: '/waitlist',
      name: 'waitlist',
      component: WaitlistView,
    },
    {
      path: '/how-it-works',
      name: 'how-it-works',
      component: () => import('@/views/HowItWorksView.vue'),
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
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordView,
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
      component: () => import('@/views/ComingSoonView.vue'),
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: PrivacyPolicyView,
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: () => import('@/views/PricingView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          redirect: {
            name: 'projects',
          },
        },
        {
          path: 'projects',
          name: 'projects',
          component: ProjectView,
          alias: '/projects',
          meta: { requiresAuth: true },
        },
        {
          path: 'projects/:id',
          name: 'project-detail',
          component: () => import('@/views/dashboard/projects/Project.vue'),
          meta: { requiresAuth: true },
        },

        {
          path: 'jurisdictions',
          name: 'jurisdictions',
          component: JurisdictionView,
          alias: '/jurisdictions',
          meta: { requiresAuth: true },
        },
        {
          path: 'jurisdictions/:id',
          name: 'jurisdiction-detail',
          component: () => import('@/views/dashboard/jurisdictions/Jurisdiction.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'settings/billing',
          name: 'billing',
          component: () => import('@/views/dashboard/settings/BillingView.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isAuthRoute = to.name === 'login' || to.name === 'signup'

  if (isAuthRoute && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }

  if (!requiresAuth) {
    return true
  }

  if (auth.isAuthenticated) {
    return true
  }

  return { name: 'login', query: { redirect: to.fullPath } }
})

export default router
