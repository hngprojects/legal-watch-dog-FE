<script setup lang="ts">
import PricingSection from '@/components/pricing/PricingSection.vue'
import { useBillingStore } from '@/stores/billing-store'
import { onMounted } from 'vue'

const { getBillingPlans } = useBillingStore()

onMounted(() => {
  void getBillingPlans()
})
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <PricingSection />
  </div>
</template>
