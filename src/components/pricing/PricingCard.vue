<script setup lang="ts">
import Icon from '@/components/reusable/Icon.vue'
import type { BillingPlan } from '@/types/billing'
import {
  CheckmarkSquare02Icon,
  Briefcase01Icon,
  Building03Icon,
  Target01Icon,
} from '@hugeicons/core-free-icons'
import { RouterLink } from 'vue-router'

const { i, activeBillingCycle, plan } = defineProps<{
  i: number
  activeBillingCycle: 'month' | 'year'
  plan: BillingPlan
}>()
</script>

<template>
  <article
    class="card-gradient relative w-auto max-w-sm min-w-3xs space-y-8 overflow-hidden rounded-4xl bg-white px-6 pt-10 pb-4 shadow-md"
    :class="[i === 1 && 'card-gradient--popular lg:py-12']"
  >
    <div class="text flex items-center justify-between">
      <div class="bg-chocolate-brown-main size-fit rounded-full p-4">
        <Icon
          :icon="i === 0 ? Briefcase01Icon : i === 1 ? Target01Icon : Building03Icon"
          :size="24"
          color="var(--peach-amber-200)"
        />
      </div>

      <p v-if="i === 1" class="bg-chocolate-brown-main rounded-md px-2 py-1 text-sm text-white">
        Most popular
      </p>
    </div>
    <div class="space-y-5">
      <h2 class="text-2xl font-medium">{{ plan.label }}</h2>
      <p class="text-gray-600">{{ plan.description }}</p>
    </div>
    <p>
      <span class="text-3xl font-medium">${{ plan.amount }}</span
      ><span class="text-gray-500">
        {{ activeBillingCycle === 'month' ? '/month' : '/year' }}
      </span>
    </p>

    <RouterLink
      :to="{
        name: 'payment-method',
        params: { plan: plan.label.toLowerCase() },
        query: { cycle: activeBillingCycle },
      }"
      class="btn--secondary btn--xl block w-full border text-center"
      :class="[i == 1 && 'btn--default']"
    >
      {{ i == 1 ? 'Get started now' : 'Choose this plan' }}
    </RouterLink>

    <ul class="space-y-5 pt-4">
      <li :key="i" v-for="(feature, i) in plan.features" class="flex items-center gap-2">
        <Icon :icon="CheckmarkSquare02Icon" :size="20" color="var(--chocolate-brown-main)" />
        <span class="text-gray-600">{{ feature }}</span>
      </li>
    </ul>
  </article>
</template>

<style scoped>
.card-gradient::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 150px;
  background-image: linear-gradient(to bottom, var(--peach-amber-50), transparent 80%);
  z-index: 0;
}

.card-gradient--popular::before {
  background-image: linear-gradient(to bottom, var(--peach-amber-100) 65%, transparent 95%);
}

.card-gradient > * {
  position: relative;
  z-index: 1;
}
</style>
