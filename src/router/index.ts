import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import LandingLayout from '@/layout/LandingLayout.vue'
import DashboardLayout from '@/layout/DashboardLayout.vue'
import AuthLayout from '@/layout/AuthLayout.vue'

// Landing pages
import HomeView from '@/views/HomeView.vue'
import AboutUsView from '@/views/AboutUsView.vue'
import Contact from '@/views/ContactView.vue'
import Careers from '@/views/CareersView.vue'
import Terms from '@/views/TermsView.vue'
import HelpCenter from '@/views/HelpCenterView.vue'
import Features from '@/views/FeaturesView.vue'
import BlogView from '@/views/BlogView.vue'
import WaitlistView from '@/views/WaitlistView.vue'
import SkeletonView from '@/views/SkeletonView.vue'
import LearnMore from '@/views/LearnMore.vue'
import OnboardingView from '@/views/OnboardingView.vue'
import PrivacyPolicyView from '@/views/PrivacyPolicyView.vue'

// Auth pages
import LoginView from '@/views/authentication/LoginView.vue'
import SignupView from '@/views/authentication/SignupView.vue'
import OtpView from '@/views/authentication/OtpView.vue'
import ForgotPasswordView from '@/views/authentication/ForgotPasswordView.vue'
import ResetPasswordView from '@/views/authentication/ResetPasswordView.vue'
import AuthStatusView from '@/views/authentication/AuthStatusView.vue'
import AcceptInviteView from '@/views/authentication/AcceptInviteView.vue'
import GoogleCallbackView from '@/views/authentication/GoogleCallbackView.vue'
import ComponentCatalogueView from '@/views/ComponentCatalogueView.vue'

// Dashboard pages
import OrganizationView from '@/views/dashboard/OrganizationView.vue'
import DashboardEntryView from '@/views/dashboard/DashboardEntryView.vue'
import ProjectView from '@/views/dashboard/ProjectView.vue'
import JurisdictionView from '@/views/dashboard/JurisdictionView.vue'
import AssignedTicket from '@/views/dashboard/Tickets/AssignedTicket.vue'

// Store
import { useAuthStore } from '@/stores/auth-store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/billing/cancel',
      name: 'billing-cancel',
      component: () => import('@/views/dashboard/payments/CancelView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/billing/success',
      name: 'billing-success',
      component: () => import('@/views/dashboard/payments/SuccessView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/component-catalogue',
      name: 'component-catalogue',
      component: ComponentCatalogueView,
    },
    {
      path: '/',
      component: LandingLayout,
      children: [
        { path: '', name: 'home', component: HomeView },
        { path: 'about-us', name: 'about-us', component: AboutUsView },
        { path: 'contact-us', name: 'contact-us', component: Contact },
        { path: 'careers', name: 'careers', component: Careers },
        { path: 'help-center', name: 'help-center', component: HelpCenter },
        { path: 'terms', name: 'terms', component: Terms },
        { path: 'blog', name: 'blog', component: BlogView },
        {
          path: 'blog/:id',
          name: 'blog-detail',
          component: () => import('@/views/BlogDetailView.vue'),
          props: true,
        },
        { path: 'features', name: 'features', component: Features },
        { path: 'waitlist', name: 'waitlist', component: WaitlistView },

        {
          path: 'how-it-works',
          name: 'how-it-works',
          component: () => import('@/views/HowItWorksView.vue'),
        },
        {
          path: 'coming-soon',
          name: 'coming-soon',
          component: () => import('@/views/ComingSoonView.vue'),
        },
        { path: 'privacy-policy', name: 'privacy-policy', component: PrivacyPolicyView },
        {
          path: 'faq',
          name: 'faq',
          component: () => import('@/views/FAQView.vue'),
        },
        {
          path: 'pricing',
          name: 'pricing',
          component: () => import('@/views/PricingView.vue'),
        },
        { path: 'skeleton', name: 'skeleton', component: SkeletonView },
        { path: 'onboarding', name: 'onboarding', component: OnboardingView },
      ],
    },

    {
      path: '/',
      component: AuthLayout,
      children: [
        { path: 'login', name: 'login', component: LoginView },
        {
          path: 'signup',
          name: 'signup',
          component: SignupView,
          meta: { authLayoutProps: { containerClass: 'p-6 lg:p-12' } },
        },
        { path: 'forgot-password', name: 'forgot-password', component: ForgotPasswordView },
        {
          path: 'reset-password',
          name: 'reset-password',
          component: ResetPasswordView,
          meta: { authLayoutProps: { containerClass: 'p-4 lg:p-10' } },
        },
        {
          path: 'otp',
          name: 'otp',
          component: OtpView,
          meta: {
            authLayoutProps: {
              wrapperClass: 'bg-white',
              mainClass: 'bg-white',
              containerClass: 'p-4 lg:p-10',
            },
          },
        },
        {
          path: 'auth-status',
          name: 'auth-status',
          component: AuthStatusView,
          alias: '/success',
          meta: { authLayoutProps: { containerClass: 'p-6 lg:p-12' } },
        },
        {
          path: 'auth/google/callback',
          name: 'google-callback',
          component: GoogleCallbackView,
          meta: { authLayoutProps: { containerClass: 'p-6 lg:p-12' } },
        },
        { path: 'auth/accept-invite/:token', name: 'accept-invite', component: AcceptInviteView },
        {
          path: 'auth/invitations/:token?/accept',
          name: 'accept-org-invite',
          component: () => import('@/views/authentication/InvitationAcceptView.vue'),
        },
      ],
    },
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardEntryView,
        },
        {
          path: 'organizations',
          name: 'organizations',
          component: OrganizationView,
          alias: '/organizations',
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/dashboard/profile/ProfileView.vue'),
        },
        {
          path: 'organizations/:organizationId',
          name: 'organization-profile',
          component: () => import('@/views/dashboard/OrganizationProfileView.vue'),
        },
        {
          path: 'organizations/:organizationId/projects',
          name: 'organization-projects',
          component: ProjectView,
        },
        {
          path: 'organizations/:organizationId/projects/:id',
          name: 'project-detail',
          component: () => import('@/views/dashboard/projects/SingleProjectView.vue'),
        },
        {
          path: 'jurisdictions',
          name: 'jurisdictions',
          component: JurisdictionView,
          alias: '/jurisdictions',
        },
        {
          path: 'jurisdictions/:id',
          name: 'jurisdiction-detail',
          component: () => import('@/views/dashboard/jurisdictions/Jurisdiction.vue'),
        },
        {
          path: 'jurisdictions/archive',
          name: 'jurisdictions-archive',
          component: () => import('@/views/dashboard/jurisdictions/archive.vue'),
        },
        {
          path: 'jurisdictions/:id/sources',
          name: 'jurisdiction-sources',
          component: () => import('@/views/dashboard/sources/Source.vue'),
        },
        {
          path: 'settings/billing',
          name: 'billing',
          component: () => import('@/views/dashboard/settings/BillingView.vue'),
        },
        {
          path: 'tickets',
          name: 'tickets',
          component: AssignedTicket,
        },
        {
          path: 'tickets/:ticketId',
          name: 'ticket-detail',
          component: () => import('@/views/dashboard/Tickets/TicketDetail.vue'),
        },
        {
          path: 'tickets/:ticketId/invited-users',
          name: 'ticket-invited-users',
          component: () => import('@/views/dashboard/Tickets/TicketInvitesView.vue'),
        },
        { path: 'learn-more', name: 'learn-more', component: LearnMore },
        {
          path: 'payment/plan',
          name: 'payment-plan',
          component: () => import('@/views/dashboard/payments/PlanView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'coming-soon',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],

  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  auth.syncAuthFromStorage()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const isAuthRoute = to.name === 'login' || to.name === 'signup'
  const isOtpRoute = to.name === 'otp'

  if (to.name === 'auth-status') {
    const issued = to.query.issued === 'true'
    if (auth.isAuthenticated || issued) return true
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (isOtpRoute) return true

  if (isAuthRoute && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }

  if (!requiresAuth) return true

  if (auth.isAuthenticated) return true

  return { name: 'login', query: { redirect: to.fullPath } }
})

export default router
