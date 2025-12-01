<script setup lang="ts">
import { onMounted, ref } from 'vue'
import PricingCard from './PricingCard.vue'
import { useBillingStore } from '@/stores/billing-store'
import type { BillingPlan } from '@/types/billing'
import Swal from '@/lib/swal'

const activeBillingCycle = ref<'month' | 'year'>('month')
const billingStore = useBillingStore()
const plans = ref<BillingPlan[] | null>(null)

onMounted(async () => {
  const res = await billingStore.fetchPlans()

  if (res) {
    plans.value = res
  }
  if (billingStore.error) {
    Swal.fire({
      icon: 'error',
      title: 'An error occurred',
      text: billingStore.error,
    })
  }
})
</script>

<template>
  <main class="app-container flex flex-1 flex-col items-center px-6 py-20 text-center md:px-12">
    <section class="mb-10 max-w-3xl">
      <h1 class="text-preset-display-md text-primary mb-5 capitalize">
        Choose the plan that fits your team.
      </h1>
      <p class="text-lg text-gray-600">
        Upgrade to unlock continuous monitoring, AI summaries, and team-wide compliance insights.
      </p>
    </section>

    <template v-if="billingStore.loading">
      <!-- create skeletons with divs and .animate-pulse class for the components in the v-else section. Don't use SkeletonBlock-->

      <div
        class="mx-auto mb-16 flex w-fit animate-pulse items-center justify-center gap-2 rounded-md bg-white p-1 ring-1 ring-[#D9DBE9] *:rounded-md *:p-3"
      >
        <div class="h-10 w-24 rounded-md bg-gray-200"></div>
        <div class="h-10 w-24 rounded-md bg-gray-200"></div>
      </div>

      <div
        class="flex w-full flex-col justify-start gap-x-6 gap-y-12 text-start md:flex-row md:flex-wrap md:justify-center xl:flex-nowrap xl:items-center"
      >
        <div
          v-for="i in 3"
          :key="i"
          class="flex h-[500px] w-full animate-pulse flex-col rounded-lg border border-gray-200 p-6 shadow-sm md:w-[calc(50%-12px)] xl:w-[384px]"
        >
          <div class="mb-4 h-full w-full rounded-md bg-gray-200"></div>
        </div>
      </div>
    </template>
    <template v-else>
      <section>
        <div
          class="mx-auto mb-16 flex w-fit items-center justify-center gap-2 rounded-md bg-white p-1 ring-1 ring-[#D9DBE9] *:rounded-md *:p-3"
        >
          <button
            :class="{ 'bg-chocolate-brown-main text-white': activeBillingCycle === 'month' }"
            @click="() => (activeBillingCycle = 'month')"
          >
            Monthly
          </button>
          <button
            class="relative"
            :class="{ 'bg-chocolate-brown-main text-white': activeBillingCycle === 'year' }"
            @click="() => (activeBillingCycle = 'year')"
          >
            <div class="bg-accent-main absolute -top-6 -right-6 rounded-full p-2">
              <p class="text-xs text-nowrap text-white">Save 20%</p>
            </div>
            Yearly
          </button>
        </div>

        <div
          class="flex flex-col justify-start gap-x-6 gap-y-12 text-start md:flex-row md:flex-wrap md:justify-center xl:flex-nowrap xl:items-center"
        >
          <template
            :key="i"
            v-for="(plan, i) in plans?.filter((plan) => plan.interval === activeBillingCycle)"
          >
            <PricingCard :i="i" :activeBillingCycle="activeBillingCycle" :plan="plan" />
          </template>
        </div>
      </section>
    </template>
  </main>
</template>
