<script setup lang="ts">
import AddPaymentModal from '@/components/pricing/AddPaymentModal.vue'
import Icon from '@/components/reusable/Icon.vue'
import Button from '@/components/ui/button/Button.vue'
import { FileNotFoundIcon } from '@hugeicons/core-free-icons'
import { ref } from 'vue'

const hasHistory = ref(false)
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

      <h3 class="mb-4 text-3xl font-semibold">Free Trial</h3>
      <p class="mb-10 text-gray-600">
        You're currently on a free trial. No charges until your trial ends.
      </p>

      <div class="flex flex-col gap-x-6 gap-y-4 *:flex-1 md:flex-row">
        <Button class="text-white"> Upgrade Plan </Button>
        <Button variant="outline"> Cancel Subscription </Button>
      </div>
    </article>

    <article class="flex flex-col justify-end">
      <h2 class="mb-6 text-2xl font-medium">Payment Method</h2>
      <p class="mb-10">
        You don't have a payment method on file yet. Add one to seamlessly activate your plan after
        trial.
      </p>

      <AddPaymentModal>
        <Button variant="outline"> Add Payment Method </Button>
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
