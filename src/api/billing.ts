import api from '@/lib/api'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.staging.legalwatch.dog/api/v1'

export const billingService = {
  getOrganizationSubscriptionStatus: (organizationId: string) =>
    api.get(`/organizations/${organizationId}/billing/subscription`),

  getOrganizationBillingAccount: (organizationId: string) =>
    api.get(`/organizations/${organizationId}/billing`),

  createOrganizationBillingAccount: (organizationId: string) =>
    api.post(`/organizations/${organizationId}/billing/accounts`, {
      currency: 'USD',
    }),

  getPlans: () => axios.get(BASE_URL + '/billing/plans'),

  checkout: (organizationId: string, plan: string) =>
    api.post(`/organizations/${organizationId}/billing/checkout`, {
      plan,
      description: `Subscription for ${organizationId}`,
    }),

  addPaymentMethod: (organizationId: string, paymentMethodId: string) =>
    api.post(`/organizations/${organizationId}/billing/payment-methods/${paymentMethodId}`),

  getOrganizationBillingPlans: (organizationId: string) =>
    api.get(`/organizations/${organizationId}/billing/plans`),

  cancelOrganizationSubscription: (organizationId: string) =>
    api.post(`/organizations/${organizationId}/billing/subscription/cancel`, {
      cancel_at_period_end: true,
    }),
}
