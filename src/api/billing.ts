import api from '@/lib/api'
import { Briefcase01Icon, Building03Icon, Target01Icon } from '@hugeicons/core-free-icons'

export const PRICINGS = [
  {
    title: 'Essential',
    description: 'Best for individual consultants and small teams.',
    icon: Target01Icon,
    price: 29,
    yearly: 288,
    benefits: [
      '1 Projects',
      '2 Jurisdictions',
      '1-day snapshot history',
      '20 monthly scans',
      'Email summaries',
      'AI summaries',
    ],
  },
  {
    title: 'Professional',
    description: 'Designed for growing legal and compliance teams.',
    price: 79,
    yearly: 768,
    icon: Briefcase01Icon,
    benefits: [
      '20 Projects',
      '50 Jurisdictions',
      'Unlimited scans',
      'Priority AI summaries',
      'Team notifications',
      'API access',
      '1-year snapshot history',
    ],
  },
  {
    title: 'Enterprise',
    description: 'For large companies with complex regulatory needs.',
    price: 99,
    yearly: 960,
    icon: Building03Icon,
    benefits: [
      'Unlimited projects and jurisdictions',
      'Dedicated CSM',
      'Custom AI configuration',
      'SSO & advanced roles',
      'Unlimited snapshot history',
      'Full audit logs',
    ],
  },
]

export const billingService = {
  getOrganizationSubscriptionStatus: async (organizationId: string) =>
    api.get(`/organizations/${organizationId}/billing/subscription`),

  getOrganizationBillingAccount: async (organizationId: string) =>
    api.get(`/organizations/${organizationId}/billing`),

  checkout: async (organizationId: string, plan: string) =>
    api.post(`/organizations/${organizationId}/billing/checkout`, {
      plan,
      description: `Subscription for ${organizationId}`,
    }),

  addPaymentMethod: async (organizationId: string, paymentMethodId: string) =>
    api.post(`/organizations/${organizationId}/billing/payment-methods/${paymentMethodId}`),

  getOrganizationBillingPlans: async (organizationId: string) =>
    api.get(`/organizations/${organizationId}/billing/plans`),

  cancelOrganizationSubscription: async (organizationId: string) =>
    api.post(`/organizations/${organizationId}/billing/subscription/cancel`, {
      cancel_at_period_end: true,
    }),
}
