<script setup lang="ts">
import MainFooter from '@/components/landing-page/MainFooter.vue'
import MainHeader from '@/components/landing-page/MainHeader.vue'
import Icon from '@/components/reusable/Icon.vue'
import Button from '@/components/ui/button/Button.vue'
import {
  Briefcase01Icon,
  Building03Icon,
  CheckmarkSquare02Icon,
  Target01Icon,
} from '@hugeicons/core-free-icons'
import { ref } from 'vue'

const activeBillingCycle = ref<'monthly' | 'yearly'>('monthly')

const pricings = [
  {
    title: 'Free',
    description: 'Best for individual consultants and small teams.',
    icon: Target01Icon,
    price: 0,
    benefits: [
      '1 Projects',
      '2 Jurisdictions',
      '1-day snapshot history',
      '20 monthly scans',
      'Email summaries',
      'AI summaries',
    ],
  },
  {
    title: 'Professional',
    description: 'Designed for growing legal and compliance teams.',
    price: 79,
    icon: Briefcase01Icon,
    benefits: [
      '20 Projects',
      '50 Jurisdictions',
      'Unlimited scans',
      'Priority AI summaries',
      'Team notifications',
      'API access',
      '1-year snapshot history',
    ],
  },
  {
    title: 'Enterprise',
    description: 'For large companies with complex regulatory needs.',
    price: 99,
    icon: Building03Icon,
    benefits: [
      'Unlimited projects and jurisdictions',
      'Dedicated CSM',
      'Custom AI configuration',
      'SSO & advanced roles',
      'Unlimited snapshot history',
      'Full audit logs',
    ],
  },
]
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <MainHeader />
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
            :class="{ 'bg-chocolate-brown-main text-white': activeBillingCycle === 'yearly' }"
            @click="() => (activeBillingCycle = 'yearly')"
          >
            Yearly
          </button>
        </div>

        <div
          class="flex flex-col justify-start gap-x-6 gap-y-12 text-start md:flex-row md:flex-wrap md:justify-center xl:items-center"
        >
          <article
            :key="i"
            v-for="(plan, i) in pricings"
            class="card-gradient relative w-sm space-y-8 overflow-hidden rounded-4xl bg-white px-6 pt-10 pb-4 shadow-md"
            :class="[i === 1 && 'card-gradient--popular lg:py-12']"
          >
            <div class="text flex items-center justify-between">
              <div class="bg-chocolate-brown-main size-fit rounded-full p-4">
                <Icon :icon="plan.icon" :size="24" color="var(--peach-amber-200)" />
              </div>

              <p
                v-if="i === 1"
                class="bg-chocolate-brown-main rounded-md px-2 py-1 text-sm text-white"
              >
                Most popular
              </p>
            </div>
            <div class="space-y-5">
              <h2 class="text-2xl font-medium">{{ plan.title }}</h2>
              <p class="text-gray-600">{{ plan.description }}</p>
            </div>
            <p>
              <span class="text-3xl font-medium">${{ plan.price }}</span> /month
            </p>

            <Button
              variant="outline"
              class="border-chocolate-brown-main text-chocolate-brown-main hover:bg-chocolate-brown-main w-full bg-gray-50 py-8 text-xl font-medium hover:text-white"
              :class="[
                i === 1 &&
                  'bg-chocolate-brown-main hover:text-chocolate-brown-main text-white hover:bg-gray-50',
              ]"
            >
              {{ i == 1 ? 'Get started now' : 'Choose this plan' }}
            </Button>

            <ul class="space-y-5 pt-4">
              <li :key="i" v-for="(benefit, i) in plan.benefits" class="flex items-center gap-2">
                <Icon
                  :icon="CheckmarkSquare02Icon"
                  :size="20"
                  color="var(--chocolate-brown-main)"
                />
                <span class="text-gray-600">{{ benefit }}</span>
              </li>
            </ul>
          </article>
        </div>
      </section>
    </main>
    <MainFooter />
  </div>
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
