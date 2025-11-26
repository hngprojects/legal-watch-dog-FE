<script setup lang="ts">
import Icon from '@/components/reusable/Icon.vue'
import Button from '@/components/ui/button/Button.vue'
import { CheckmarkSquare02Icon } from '@hugeicons/core-free-icons'
import { RouterLink } from 'vue-router'

const { i, activeBillingCycle, plan } = defineProps<{
  i: number
  activeBillingCycle: 'monthly' | 'yearly'
  plan: {
    title: string
    description: string
    icon: typeof CheckmarkSquare02Icon
    price: number
    yearly: number
    benefits: string[]
  }
}>()
</script>

<template>
  <article
    class="card-gradient relative w-sm space-y-8 overflow-hidden rounded-4xl bg-white px-6 pt-10 pb-4 shadow-md"
    :class="[i === 1 && 'card-gradient--popular lg:py-12']"
  >
    <div class="text flex items-center justify-between">
      <div class="bg-chocolate-brown-main size-fit rounded-full p-4">
        <Icon :icon="plan.icon" :size="24" color="var(--peach-amber-200)" />
      </div>

      <p v-if="i === 1" class="bg-chocolate-brown-main rounded-md px-2 py-1 text-sm text-white">
        Most popular
      </p>
    </div>
    <div class="space-y-5">
      <h2 class="text-2xl font-medium">{{ plan.title }}</h2>
      <p class="text-gray-600">{{ plan.description }}</p>
    </div>
    <p>
      <span class="text-3xl font-medium"
        >${{ activeBillingCycle === 'monthly' ? plan.price : plan.yearly }}</span
      ><span class="text-gray-500">
        {{ activeBillingCycle === 'monthly' ? '/month' : '/year' }}
      </span>
    </p>

    <Button asChild :variant="i == 1 ? 'default' : 'outline'" class="w-full">
      <RouterLink
        :to="{
          name: 'payment-method',
          params: { plan: plan.title.toLowerCase() },
          query: { cycle: activeBillingCycle },
        }"
      >
        {{ i == 1 ? 'Get started now' : 'Choose this plan' }}
      </RouterLink>
    </Button>

    <ul class="space-y-5 pt-4">
      <li :key="i" v-for="(benefit, i) in plan.benefits" class="flex items-center gap-2">
        <Icon :icon="CheckmarkSquare02Icon" :size="20" color="var(--chocolate-brown-main)" />
        <span class="text-gray-600">{{ benefit }}</span>
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
