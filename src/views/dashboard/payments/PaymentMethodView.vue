<script setup lang="ts">
import PricingCard from '@/components/pricing/PricingCard.vue'
import { useRoute } from 'vue-router'
import { PRICINGS } from '@/api/pricing'

const route = useRoute()
const plan = PRICINGS.find((plan) => plan.title.toLowerCase() === route.params.plan)!
const cycle = route.query.cycle as 'monthly' | 'yearly'
</script>

<template>
  <div
    class="flex min-h-screen flex-col *:flex-1 md:flex-row md:items-center md:justify-center lg:gap-12"
  >
    <section>
      <h1 class="mb-6 text-3xl font-semibold">Payment Method</h1>
      <p class="mb-4 font-medium text-gray-600">Choose your payment method</p>

      <div class="flex w-full items-center gap-4 rounded-md bg-white px-4 py-4">
        <input id="stripe" type="radio" value="Stripe" />
        <label for="stripe"> Stripe </label>
      </div>
    </section>

    <section>
      <PricingCard
        :i="route.params.plan === 'professional' ? 1 : 0"
        :active-billing-cycle="cycle"
        :plan="plan"
      />
    </section>
  </div>
</template>
