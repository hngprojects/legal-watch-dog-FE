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

  checkout: (organizationId: string, plan_id: string) =>
    api.post(`/organizations/${organizationId}/billing/checkout`, {
      plan_id,
      description: `Subscription for ${organizationId}`,
    }),

  getOrganizationPaymentHistory: (organizationId: string) =>
    api.get(`/organizations/${organizationId}/billing/invoices`),

  changeOrganizationSubscription: (organizationId: string, plan_id: string) =>
    api.post(`/organizations/${organizationId}/billing/subscription/change-plan`, {
      plan_id,
    }),

  cancelOrganizationSubscriptionAtPeriodEnd: (organizationId: string) =>
    api.post(`/organizations/${organizationId}/billing/subscription/cancel`),
}
