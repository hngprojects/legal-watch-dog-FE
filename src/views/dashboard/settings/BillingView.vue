<script setup lang="ts">
import CancelSubscriptionModal from '@/components/pricing/CancelSubscriptionModal.vue'
import Icon from '@/components/reusable/Icon.vue'
import { useAuthStore } from '@/stores/auth-store'
import { useBillingStore } from '@/stores/billing-store'
import { useOrganizationStore } from '@/stores/organization-store'
import { FileNotFoundIcon } from '@hugeicons/core-free-icons'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const hasHistory = ref(false)
const isFreeTrial = ref(false)

const { user } = useAuthStore()
const { fetchOrganizations, hasOrganizations, currentOrganizationId } = useOrganizationStore()
const { hasBillingAccount, createBillingAccount } = useBillingStore()

onMounted(async () => {
  if (!user) return

  await fetchOrganizations(user.id)

  if (!hasOrganizations) return

  const [hasAccount] = await Promise.all([hasBillingAccount(currentOrganizationId!)])

  if (!hasAccount) {
    createBillingAccount(currentOrganizationId!)
  }
})
</script>

<template>
  <h1 class="mb-8 text-3xl font-semibold">Billing & Subscription</h1>
  <section
    class="mb-10 flex flex-col gap-6 *:flex-1 *:rounded-md *:bg-white *:px-6 *:py-5 *:ring-1 *:ring-gray-300 md:flex-row"
  >
    <article>
      <div class="mb-5 flex items-center justify-between">
        <h2 class="text-xl text-gray-600">Current Plan</h2>
        <div class="text-peach-amber-main bg-peach-amber-100 rounded-full px-2.5 py-1.5">
          <p>7 days left</p>
        </div>
      </div>

      <template v-if="isFreeTrial">
        <h3 class="mb-4 text-3xl font-semibold">Free Trial</h3>
        <p class="mb-10 text-gray-600">
          You're currently on a free trial. No charges until your trial ends.
        </p>
      </template>
      <template v-else>
        <h3 class="mb-4 text-3xl font-semibold">Professional</h3>
        <p class="mb-10 text-gray-600">For growing teams</p>
      </template>

      <div class="flex flex-col gap-x-6 gap-y-4 *:flex-1 md:flex-row">
        <RouterLink :to="{ name: 'payment-plan' }" class="btn--md btn--primary block text-center">
          Upgrade Plan
        </RouterLink>
        <CancelSubscriptionModal :organizationId="currentOrganizationId!">
          <button class="btn--md btn--outline border-accent-main border text-center">
            Cancel Subscription
          </button>
        </CancelSubscriptionModal>
      </div>
    </article>

    <article class="flex flex-col justify-end">
      <h2 class="mb-6 text-2xl font-medium">Payment Method</h2>
      <p class="mb-10">
        You don't have a payment method on file yet. Add one to seamlessly activate your plan after
        trial.
      </p>

      <AddPaymentModal>
        <RouterLink
          :to="{ name: 'payment-method', params: { plan: 'professional' } }"
          class="btn--md btn--outline block w-fit text-center"
        >
          Add Payment Method
        </RouterLink>
      </AddPaymentModal>
    </article>
  </section>

  <section>
    <h2 class="mb-6 text-2xl font-semibold">Payment History</h2>

    <div
      class="flex min-h-[356px] rounded-lg bg-white"
      :class="[hasHistory ? '' : 'items-center justify-center px-6 text-center']"
    >
      <div v-if="hasHistory"></div>
      <div v-else class="flex flex-col items-center justify-center gap-2">
        <div class="mb-2 w-fit rounded-full border border-gray-300 p-6">
          <Icon :icon="FileNotFoundIcon" :size="33" color="var(--gray-300)" />
        </div>
        <p class="font-medium">No Payment Made</p>
        <p>Payment history will appear here after your first payment.</p>
      </div>
    </div>
  </section>
</template>
