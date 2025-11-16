<script setup lang="ts">
import BaseButton from '../atoms/BaseButton.vue'
import BodyText from '../atoms/BodyText.vue'
import HeadingText from '../atoms/HeadingText.vue'

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
  <section class="relative flex w-full items-center justify-center py-8 sm:py-16">
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
        <article
          :key="i"
          v-for="(card, i) in cards"
          class="flex flex-col bg-white rounded-2xl shadow-md px-10 py-12 basis-full md:basis-[calc(50%-0.625rem)] md:max-w-[400px]"
        >
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-accent mb-5">
            <img :src="card.icon" :alt="`${card.title} icon`" class="size-8" />
          </div>

          <HeadingText tag="h3" align="left" class="mb-2.5 font-semibold!">
            {{ card.title }}
          </HeadingText>
          <BodyText align="left" tone="muted">
            {{ card.description }}
          </BodyText>
        </article>
      </div>

      <BaseButton size="lg" class="self-center"
        ><span class="font-normal!">How it Works</span></BaseButton
      >
    </div>
  </section>
</template>
