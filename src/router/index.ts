import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutUsView from '@/views/AboutUsView.vue'
import Contact from '@/views/Contact.vue'
import Career from '@/views/Career.vue'
import Terms from '@/views/Terms.vue'
import HelpCenter from '@/views/HelpCenter.vue'
import Features from '@/views/Features.vue'
import Blogs from '@/views/Blogs.vue'
import WaitlistView from '@/views/WaitlistView.vue'
import LoginView from '@/views/authentication/LoginView.vue'
import SignupView from '@/views/authentication/SignupView.vue'
import OtpView from '@/views/authentication/OtpView.vue'
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
import AuthStatusView from '@/views/authentication/AuthStatusView.vue'
import OrganizationView from '@/views/dashboard/OrganizationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about-us',
      name: 'about-us',
      component: AboutUsView,
    },
    {
      path: '/contact-us',
      name: 'contact-us',
      component: Contact,
    },
    {
      path: '/career',
      name: 'career',
      component: Career,
    },
    {
      path: '/helpcenter',
      name: 'helpcenter',
      component: HelpCenter,
    },
    {
      path: '/terms',
      name: 'terms',
      component: Terms,
    },
    {
      path: '/blogs',
      name: 'blogs',
      component: Blogs,
    },
    {
      path: '/features',
      name: 'features',
      component: Features,
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
      path: '/onboarding', // Onboarding page
      name: 'onboarding',
      component: OnboardingView,
    },
    {
      path: '/auth-status',
      name: 'auth-status',
      component: AuthStatusView,
      alias: '/success',
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
      path: '/faq', 
      name: 'faq',
      component: () => import('@/views/FAQView.vue'),
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
            name: 'organizations',
          },
        },
        {
          path: 'organizations',
          name: 'organizations',
          component: OrganizationView,
          alias: '/organizations',
          meta: { requiresAuth: true },
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/dashboard/profile/ProfileView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'organizations/:organizationId/projects',
          name: 'organization-projects',
          component: ProjectView,
          meta: { requiresAuth: true },
        },
        {
          path: 'organizations/:organizationId/projects/:id',
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
          path: 'jurisdictions/:id/sources',
          name: 'jurisdiction-sources',
          component: () => import('@/views/dashboard/sources/Source.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'settings/billing',
          name: 'billing',
          component: () => import('@/views/dashboard/settings/BillingView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'payment/plan',
          name: 'payment-plan',
          component: () => import('@/views/dashboard/payments/PlanView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'payment/method/:plan',
          name: 'payment-method',
          component: () => import('@/views/dashboard/payments/PaymentMethodView.vue'),
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
