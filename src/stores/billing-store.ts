import { defineStore } from 'pinia'
import { useOrganizationStore } from './organization-store'
import { billingService } from '@/api/billing'
import type { AxiosError } from 'axios'

interface State {
  billing: number
  hasSubscribed: boolean
  loading: boolean
  error: string | null
}

export const useBillingStore = defineStore('billing', {
  state: (): State => ({
    billing: 0,
    hasSubscribed: false,
    loading: false,
    error: null,
  }),

  actions: {
    setError(message: string | null) {
      this.error = message
    },

    setLoading(value: boolean) {
      this.loading = value
    },

    async hasBillingAccount(organizationId: string) {
      try {
        const res = await billingService.getOrganizationBillingAccount(organizationId)

        if (res.status === 200) return true
      } catch (error) {
        if ((error as AxiosError).status === 404) return false
      }

      return false
    },

    async getBillingPlans(organizationId: string) {
      try {
        const res = await billingService.getOrganizationBillingPlans(organizationId)

        return res.data.data
      } catch (error) {}
    },

    async checkoutPlan(organizationId: string, plan: string) {
      try {
        const res = await billingService.checkout(organizationId, plan)

        return res.data.data
      } catch (error) {}
    },

    async cancelSubscription(organizationId: string) {
      try {
        const res = await billingService.cancelOrganizationSubscription(organizationId)

        return res.data.data
      } catch (error) {}
    },
  },
})
