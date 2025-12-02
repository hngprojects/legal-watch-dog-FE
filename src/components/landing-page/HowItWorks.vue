<script setup lang="ts">
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { TypographyHeading, TypographyText } from '../ui/typography'

import IconContainer from '@/assets/icons/IconContainer.png'
import IconBackground from '@/assets/icons/IconBackground.png'
import IconRing from '@/assets/icons/IconRing.png'

const cards = [
  {
    title: 'Monitor',
    icon: IconContainer,
    description:
      'Tell us which websites to track. From government portals to internal policy pages',
  },
  {
    title: 'Analyze',
    icon: IconBackground,
    description:
      'Our AI detects changes, analyzes the content and generates clear concise summaries',
  },
  {
    title: 'Notify',
    icon: IconRing,
    description: 'Receive instant alerts via email or slack the moment a critical change occur.',
  },
]
</script>

<template>
  <section
    id="how-it-works"
    class="app-container relative flex items-center justify-center py-12 sm:py-16 lg:py-20"
  >
    <div class="flex w-full flex-col gap-8 sm:gap-10 lg:gap-11">
      <!-- Header Section -->
      <div
        class="mx-auto flex w-full flex-col items-center gap-3 px-4 text-center sm:gap-4 sm:px-6 lg:gap-5"
      >
        <TypographyHeading
          level="h2"
          align="center"
          class="text-2xl leading-tight sm:text-3xl sm:leading-tight lg:text-4xl lg:leading-tight"
        >
          How <span class="text-[#F2AB6D]">Legal WatchDog</span> Works
        </TypographyHeading>
        <TypographyText
          align="center"
          tone="muted"
          class="max-w-full text-sm leading-relaxed font-semibold text-gray-600 sm:max-w-xl sm:text-base lg:max-w-2xl lg:text-lg"
        >
          Discover how LegalWatchDog continuously monitors legal sources, detects changes, and
          delivers reliable, AI-summarized updates — all in just a few steps.
        </TypographyText>
      </div>

      <!-- Cards Grid -->
      <div
        class="mx-auto flex w-full flex-col items-stretch gap-4 px-4 sm:gap-5 sm:px-6 md:flex-row md:flex-wrap lg:flex-nowrap"
      >
        <Card
          v-for="(card, i) in cards"
          :key="i"
          class="flex-1 space-y-3 rounded-2xl bg-white px-5 py-6 text-left sm:space-y-4 sm:px-6 sm:py-8 md:max-w-[380px] md:min-w-[280px] md:basis-[calc(50%-0.625rem)] lg:max-w-none lg:basis-0 lg:px-8 lg:py-10"
        >
          <CardHeader class="gap-3 p-0 sm:gap-4">
            <!-- Icon -->
            <div
              class="text-accent-fg flex h-12 w-12 items-center justify-center sm:h-14 sm:w-14 lg:h-16 lg:w-16"
            >
              <img
                :src="card.icon"
                :alt="`${card.title} icon`"
                class="h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12"
              />
            </div>
            <!-- Title -->
            <CardTitle class="text-fg text-xl font-semibold sm:text-2xl">
              {{ card.title }}
            </CardTitle>
          </CardHeader>
          <!-- Description -->
          <CardDescription class="text-sm leading-relaxed sm:text-base">
            {{ card.description }}
          </CardDescription>
        </Card>
      </div>
    </div>
  </section>
</template>
