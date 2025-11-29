<script setup lang="ts">
import PricingSection from '@/components/pricing/PricingSection.vue'
import { useAuthStore } from '@/stores/auth-store'
import { useBillingStore } from '@/stores/billing-store'
import { useOrganizationStore } from '@/stores/organization-store'
import { onMounted } from 'vue'

const { user } = useAuthStore()
const { fetchOrganizations, hasOrganizations, currentOrganizationId } = useOrganizationStore()
const { getBillingPlans } = useBillingStore()

onMounted(async () => {
  if (!user) return

  await fetchOrganizations(user.id)

  if (!hasOrganizations) return
  const plans = await getBillingPlans(currentOrganizationId!)
})
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <PricingSection />
  </div>
</template>
