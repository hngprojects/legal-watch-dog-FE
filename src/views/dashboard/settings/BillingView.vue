<script setup lang="ts">
import CancelSubscriptionModal from '@/components/pricing/CancelSubscriptionModal.vue'
import Icon from '@/components/reusable/Icon.vue'
import Swal from '@/lib/swal'
import { useBillingStore } from '@/stores/billing-store'
import type { BillingPlan } from '@/types/billing'
import { FileNotFoundIcon } from '@hugeicons/core-free-icons'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const hasHistory = ref(false)
const isFreeTrial = ref(true)
const currentPlan = ref<BillingPlan | null>(null)
const endDate = ref<Date | undefined>(undefined)

const billingStore = useBillingStore()

onMounted(async () => {
  const [subscriptionStatus, history] = await Promise.all([
    billingStore.getSubscriptionStatus(),
    billingStore.getPaymentHistory(),
  ])

  if (billingStore.error) {
    Swal.fire({
      icon: 'error',
      title: 'An error occurred',
      text: billingStore.error,
    })
  }

  if (subscriptionStatus?.trial_starts_at && subscriptionStatus?.trial_ends_at) {
    isFreeTrial.value = true
    endDate.value = subscriptionStatus.trial_ends_at
  } else if (subscriptionStatus?.current_plan && subscriptionStatus.current_period_end) {
    isFreeTrial.value = false
    endDate.value = subscriptionStatus.current_period_end
  }

  if (history && history.length > 0) {
    hasHistory.value = true
  }
})

//create a function that counts the number of days left before a specific date and returns a string
const calculateDaysLeft = (endDate: string | Date): string => {
  console.log(endDate)
  const today = new Date()
  const end = new Date(endDate)
  const diffTime = end.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays > 0) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} left`
  } else if (diffDays === 0) {
    return 'Ends today'
  } else {
    return 'Ended'
  }
}
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
          <p>{{ endDate ? calculateDaysLeft(endDate) : '' }}</p>
        </div>
      </div>

      <template v-if="isFreeTrial">
        <h3 class="mb-4 text-3xl font-semibold">Free Trial</h3>
        <p class="mb-10 text-gray-600">
          You're currently on a free trial. No charges until your trial ends.
        </p>
      </template>
      <template v-else-if="currentPlan && !isFreeTrial">
        <h3 class="mb-4 text-3xl font-semibold">{{ currentPlan.label }}</h3>
        <p class="mb-10 text-gray-600">{{ currentPlan.description }}</p>
      </template>

      <div class="flex flex-col gap-x-6 gap-y-4 *:flex-1 md:flex-row">
        <RouterLink
          :to="{ name: 'payment-plan' }"
          class="btn--md btn--default flex items-center justify-center text-center"
        >
          Upgrade Plan
        </RouterLink>
        <CancelSubscriptionModal>
          <button
            class="btn--md btn--secondary border-accent-main border text-center"
            :class="[isFreeTrial && 'btn--disabled']"
            :disabled="isFreeTrial"
          >
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
          :to="{ name: 'payment-plan', params: { plan: 'professional' } }"
          class="btn--md btn--secondary block w-fit text-center"
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
