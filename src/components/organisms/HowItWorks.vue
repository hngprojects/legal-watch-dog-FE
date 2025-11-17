<script setup lang="ts">
import BodyText from '../atoms/BodyText.vue'
import HeadingText from '../atoms/HeadingText.vue'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
  <section id="how-it-works" class="relative flex w-full items-center justify-center py-8 sm:py-16">
    <div class="flex w-full flex-col gap-11">
      <div class="mx-auto flex w-full items-center flex-col gap-5 text-center">
        <HeadingText tag="h2" align="center">
          How <span class="text-accent">Legal WatchDog</span> Works
        </HeadingText>
        <BodyText align="center" tone="muted" class="max-w-lg">
          Discover how LegalWatchDog continuously monitors legal sources, detects changes, and
          delivers reliable, AI-summarized updates — all in just a few steps.
        </BodyText>
      </div>

      <div class="mx-auto flex md:items-stretch flex-wrap lg:flex-nowrap items-center gap-5">
        <Card
          v-for="(card, i) in cards"
          :key="i"
          class="basis-full space-y-4 rounded-2xl bg-card px-8 py-10 text-left md:basis-[calc(50%-0.625rem)] md:max-w-[400px]"
        >
          <CardHeader class="gap-4 p-0">
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm">
              <img :src="card.icon" :alt="`${card.title} icon`" class="size-8" />
            </div>
            <CardTitle class="text-2xl font-semibold text-foreground">
              {{ card.title }}
            </CardTitle>
          </CardHeader>
          <CardDescription class="text-base leading-relaxed">
            {{ card.description }}
          </CardDescription>
        </Card>
      </div>

      <Button size="lg" variant="secondary" class="self-center px-10">
        <span class="font-normal!">How it Works</span>
      </Button>
    </div>
  </section>
</template>
