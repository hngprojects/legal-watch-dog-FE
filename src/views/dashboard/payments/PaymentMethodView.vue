<script setup lang="ts">
import PricingCard from '@/components/pricing/PricingCard.vue'
import { useRoute } from 'vue-router'
import { PRICINGS } from '@/api/billing'
import { ref } from 'vue'
import { useBillingStore } from '@/stores/billing-store'

const route = useRoute()
const paymentMethod = ref<'stripe' | null>(null)
const plan = PRICINGS.find((plan) => plan.title.toLowerCase() === route.params.plan)!
const cycle = route.query.cycle as 'monthly' | 'yearly'
const { checkoutPlan } = useBillingStore()

const handlePay = async () => {
  if (!paymentMethod.value) return

  if (paymentMethod.value === 'stripe') {
    const checkoutUrl = await checkoutPlan('yearly')

    console.log(checkoutUrl)

    if (checkoutUrl) window.location.replace(checkoutUrl)
  }
}
</script>

<template>
  <div
    class="flex min-h-screen flex-col gap-12 *:flex-1 md:flex-row md:items-center md:justify-center"
  >
    <section>
      <div class="mx-auto max-w-md">
        <h1 class="mb-6 text-3xl font-semibold">Payment Method</h1>
        <p class="mb-4 font-medium text-gray-600">Choose your payment method</p>

        <div>
          <div class="flex w-full items-center gap-4 rounded-md bg-white px-4 py-4">
            <input id="stripe" type="radio" value="stripe" v-model="paymentMethod" />
            <label for="stripe"> Stripe </label>
          </div>
          <button v-if="paymentMethod" @click="handlePay" class="btn--md btn--primary mt-6 w-full">
            Pay now
          </button>
        </div>
      </div>
    </section>

    <section class="">
      <PricingCard
        class="mx-auto"
        :i="route.params.plan === 'professional' ? 1 : 0"
        :active-billing-cycle="cycle"
        :plan="plan"
      />
    </section>
  </div>
</template>
