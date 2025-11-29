import { defineStore } from 'pinia'
import { useOrganizationStore } from './organization-store'
import { billingService } from '@/api/billing'
import type { AxiosError } from 'axios'
import { useAuthStore } from './auth-store'
import { useRouter } from 'vue-router'

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

    async getOrganizationId() {
      const router = useRouter()
      const { user } = useAuthStore()
      const { fetchOrganizations, hasOrganizations, currentOrganizationId } = useOrganizationStore()

      if (!user) {
        this.setError('No user found. Proceed to login')
        router.push({ name: 'login' })
        return null
      }

      await fetchOrganizations(user.id)

      // if (!hasOrganizations) {
      //   this.setError('No organization found')
      //   router.push({ name: 'dashboard' })
      //   return null
      // }

      console.log(currentOrganizationId)

      return currentOrganizationId
    },

    async hasBillingAccount() {
      this.setError(null)
      const orgId = await this.getOrganizationId()

      if (!orgId) return

      try {
        const res = await billingService.getOrganizationBillingAccount(orgId)

        if (res.status === 200) return true
      } catch (error) {
        if ((error as AxiosError).status === 404) return false
      }

      return false
    },

    async createBillingAccount() {
      this.setError(null)

      const orgId = await this.getOrganizationId()

      if (!orgId) return

      try {
        const res = await billingService.createOrganizationBillingAccount(orgId)

        if (res.status === 200) return true
      } catch (error) {
        this.setError('Failed to create billing account.')
      }

      return false
    },

    async getSubscriptionStatus() {
      this.setError(null)
      const orgId = await this.getOrganizationId()

      if (!orgId) return
      try {
        const res = await billingService.getOrganizationSubscriptionStatus(orgId)

        if (res.status === 200) {
          this.hasSubscribed = res.data.data.has_subscribed
        }
      } catch (error) {
        this.setError('Failed to get subscription status.')
      }
    },

    async getBillingPlans() {
      this.setError(null)
      const orgId = await this.getOrganizationId()

      if (!orgId) return
      try {
        const res = await billingService.getOrganizationBillingPlans(orgId)

        return res.data.data
      } catch (error) {}
    },

    async checkoutPlan(plan: string) {
      this.setError(null)
      const orgId = await this.getOrganizationId()

      if (!orgId) return

      try {
        const res = await billingService.checkout(orgId, plan)

        return res.data.data.checkout_url
      } catch (error) {}
    },

    async cancelSubscription() {
      this.setError(null)
      const orgId = await this.getOrganizationId()

      if (!orgId) return
      try {
        const res = await billingService.cancelOrganizationSubscription(orgId)

        return res.data.data
      } catch (error) {}
    },
  },
})
