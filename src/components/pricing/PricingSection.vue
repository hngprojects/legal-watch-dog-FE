<script setup lang="ts">
import { pricings } from '@/api/pricing'
import { ref } from 'vue'
import PricingCard from './PricingCard.vue'

const activeBillingCycle = ref<'monthly' | 'yearly'>('monthly')
</script>

<template>
  <main class="flex flex-1 flex-col items-center px-6 py-20 text-center md:px-12 lg:px-24">
    <section class="mb-10 max-w-3xl">
      <h1 class="text-preset-display-md text-primary mb-5 capitalize">
        Choose the plan that fits your team.
      </h1>
      <p class="text-lg text-gray-600">
        Upgrade to unlock continuous monitoring, AI summaries, and team-wide compliance insights.
      </p>
    </section>

    <section>
      <div
        class="mx-auto mb-16 flex w-fit items-center justify-center gap-2 rounded-md bg-white p-1 ring-1 ring-[#D9DBE9] *:rounded-md *:p-3"
      >
        <button
          :class="{ 'bg-chocolate-brown-main text-white': activeBillingCycle === 'monthly' }"
          @click="() => (activeBillingCycle = 'monthly')"
        >
          Monthly
        </button>
        <button
          class="relative"
          :class="{ 'bg-chocolate-brown-main text-white': activeBillingCycle === 'yearly' }"
          @click="() => (activeBillingCycle = 'yearly')"
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
        <template :key="i" v-for="(plan, i) in pricings">
          <PricingCard :i="i" :activeBillingCycle="activeBillingCycle" :plan="plan" />
        </template>
      </div>
    </section>
  </main>
</template>
