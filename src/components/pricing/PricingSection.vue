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
  <main
    class="app-container flex flex-1 flex-col items-center px-4 py-12 text-center sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-12"
  >
    <!-- Hero Section -->
    <section class="mb-8 max-w-3xl sm:mb-10 lg:mb-12">
      <h1
        class="text-primary lg:text-preset-display-md mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl"
      >
        Choose the plan that fits your team.
      </h1>
      <p class="text-sm text-gray-600 sm:text-base md:text-lg">
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
      <section class="w-full max-w-md">
        <div
          class="mx-auto mb-10 flex w-fit items-center justify-center gap-1 rounded-md bg-white p-1 ring-1 ring-[#D9DBE9] sm:mb-12 sm:gap-2 sm:*:rounded-md sm:*:p-3 md:mb-16"
        >
          <button
            class="relative rounded px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm"
            :class="{ 'bg-chocolate-brown-main text-white': activeBillingCycle === 'month' }"
            @click="() => (activeBillingCycle = 'month')"
          >
            Monthly
          </button>
          <button
            class="relative overflow-visible rounded px-3 py-2 text-xs sm:px-4 sm:py-3 sm:text-sm"
            :class="{ 'bg-chocolate-brown-main text-white': activeBillingCycle === 'year' }"
            @click="() => (activeBillingCycle = 'year')"
          >
            <div
              class="bg-accent-main absolute -top-4 -right-2 z-10 rounded-full p-1.5 sm:-top-5 sm:-right-3 sm:p-2"
            >
              <p class="text-[10px] font-medium whitespace-nowrap text-white sm:text-xs">
                Save 20%
              </p>
            </div>
            Yearly
          </button>
        </div>
      </section>

      <section class="w-full">
        <div
          class="grid grid-cols-1 gap-8 text-start sm:gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:flex xl:flex-nowrap xl:items-stretch xl:justify-center xl:gap-6"
        >
          <template
            :key="i"
            v-for="(plan, i) in plans?.filter((plan) => plan.interval === activeBillingCycle)"
          >
            <PricingCard
              :i="i"
              :activeBillingCycle="activeBillingCycle"
              :plan="plan"
              class="w-full"
            />
          </template>
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .app-container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Better touch targets for mobile */
@media (max-width: 768px) {
  button {
    min-height: 44px;
    min-width: 80px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  /* Ensure the badge is fully visible */
  .overflow-visible {
    overflow: visible !important;
  }

  /* Prevent badge from being cut off */
  .relative:last-child {
    overflow: visible;
  }
}

/* Ensure badge is visible on all screens */
.relative {
  overflow: visible;
}

/* Make sure badge has proper z-index */
.bg-accent-main {
  z-index: 10;
}

/* Tablet layout (2 columns) */
@media (min-width: 768px) and (max-width: 1024px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* Center the two-column layout */
  .md\:grid-cols-2 > *:last-child:nth-child(odd) {
    grid-column: span 2;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
}

/* Desktop layout (3 columns) */
@media (min-width: 1024px) and (max-width: 1280px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Large desktop (flex row) */
@media (min-width: 1280px) {
  /* Ensure cards maintain consistent width */
  .xl\:flex > * {
    flex: 1;
    max-width: 380px;
    min-width: 320px;
  }
}

/* Prevent content from being too wide on large screens */
@media (min-width: 1536px) {
  .app-container {
    max-width: 1280px;
  }
}
</style>
