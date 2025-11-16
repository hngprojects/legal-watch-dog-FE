<script setup lang="ts">
import BaseButton from '../atoms/BaseButton.vue'
import BodyText from '../atoms/BodyText.vue'
import HeadingText from '../atoms/HeadingText.vue'
</script>

<template>
  <section class="relative flex w-full items-center justify-center py-8 sm:py-16">
    <div class="flex w-full flex-col gap-11">
      <div
        class="mx-auto flex w-full items-center flex-col gap-5 px-6 py-12 text-center sm:px-8 sm:py-16"
      >
        <HeadingText tag="h2" align="center">
          How <span class="text-accent">Legal WatchDog</span> Works
        </HeadingText>
        <BodyText align="center" tone="muted" class="max-w-lg">
          Discover how LegalWatchDog continuously monitors legal sources, detects changes, and
          delivers reliable, AI-summarized updates — all in just a few steps.
        </BodyText>
      </div>

      <BaseButton class="self-center"><span class="font-normal!">How it Works</span></BaseButton>
    </div>
  </section>
</template>
