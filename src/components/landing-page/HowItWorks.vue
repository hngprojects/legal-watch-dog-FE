<script setup lang="ts">
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { TypographyHeading, TypographyText } from '../ui/typography'

import monitorIcon from '@/assets/icons/monitor.svg'
import analyzeIcon from '@/assets/icons/translation.svg'
import bellIcon from '@/assets/icons/bell.svg'

const cards = [
  {
    title: 'Monitor',
    icon: monitorIcon,
    description:
      'Tell us which websites to track. From government portals to internal policy pages',
  },
  {
    title: 'Analyze',
    icon: analyzeIcon,
    description:
      'Our AI detects changes, analyzes the content and generates clear concise summaries',
  },
  {
    title: 'Notify',
    icon: bellIcon,
    description: 'Receive instant alerts via email or slack the moment a critical change occur.',
  },
]
</script>

<template>
  <section id="how-it-works" class="relative flex items-center justify-center py-8 sm:py-16 px-16">
    <div class="flex w-full flex-col gap-11">
      <div class="mx-auto flex w-full flex-col items-center gap-5 text-center">
        <TypographyHeading level="h2" align="center">
          How <span class="text-[#F2AB6D]">Legal WatchDog</span> Works
        </TypographyHeading>
        <TypographyText align="center" tone="muted" class="max-w-2xl text-lg font-semibold text-gray-600">
          Discover how LegalWatchDog continuously monitors legal sources, detects changes, and
          delivers reliable, AI-summarized updates — all in just a few steps.
        </TypographyText>
      </div>

      <div class="mx-auto flex flex-wrap items-center gap-5 md:items-stretch lg:flex-nowrap">
        <Card
          v-for="(card, i) in cards"
          :key="i"
          class="bg-white basis-full space-y-4 rounded-2xl px-8 py-10 text-left md:max-w-[400px] md:basis-[calc(50%-0.625rem)]"
        >
          <CardHeader class="gap-4 p-0">
            <div
              class="bg-[#F2AB6D] text-accent-foreground flex h-16 w-16 items-center justify-center rounded-full shadow-sm"
            >
              <img :src="card.icon" :alt="`${card.title} icon`" class="size-8" />
            </div>
            <CardTitle class="text-foreground text-2xl font-semibold">
              {{ card.title }}
            </CardTitle>
          </CardHeader>
          <CardDescription class="text-base leading-relaxed">
            {{ card.description }}
          </CardDescription>
        </Card>
      </div>
    </div>
  </section>
</template>
