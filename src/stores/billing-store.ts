import { defineStore } from 'pinia'
import { useOrganizationStore } from './organization-store'
import { billingService } from '@/api/billing'
import type { AxiosError } from 'axios'
import { useAuthStore } from './auth-store'
import { useRouter } from 'vue-router'
import type { BillingErrorResponse, BillingPlan } from '@/types/billing'

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

    async fetchPlans() {
      this.setError(null)
      this.setLoading(true)

      try {
        const res = await billingService.getPlans()

        return res.data.data as BillingPlan[]
      } catch (error) {
        this.setError((error as BillingErrorResponse).message)
      } finally {
        this.setLoading(false)
      }
    },

    async getOrganizationId() {
      const router = useRouter()
      const authStore = useAuthStore()
      const organizationStore = useOrganizationStore()

      if (!authStore.user) {
        this.setError('No user found. Proceed to login')
        router.push({ name: 'login' })
        return null
      }

      await organizationStore.fetchOrganizations(authStore.user.id)

      // if (!hasOrganizations) {
      //   this.setError('No organization found')
      //   router.push({ name: 'dashboard' })
      //   return null
      // }

      console.log(organizationStore.currentOrganizationId)

      return organizationStore.currentOrganizationId
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
        console.error(error)
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
        console.error(error)
      }
    },

    async getBillingPlans() {
      this.setError(null)
      const orgId = await this.getOrganizationId()

      if (!orgId) return
      try {
        const res = await billingService.getOrganizationBillingPlans(orgId)

        return res.data.data
      } catch (error) {
        console.error('Failed to load billing plans', error)
        this.setError('Failed to load billing plans.')
      }
    },

    async checkoutPlan(plan: string) {
      this.setError(null)
      const orgId = await this.getOrganizationId()

      if (!orgId) return

      try {
        const res = await billingService.checkout(orgId, plan)

        return res.data.data.checkout_url
      } catch (error) {
        console.error('Checkout failed', error)
        this.setError('Failed to start checkout.')
      }
    },

    async cancelSubscription() {
      this.setError(null)
      const orgId = await this.getOrganizationId()

      if (!orgId) return
      try {
        const res = await billingService.cancelOrganizationSubscription(orgId)

        return res.data.data
      } catch (error) {
        console.error('Cancel subscription failed', error)
        this.setError('Failed to cancel subscription.')
      }
    },
  },
})
