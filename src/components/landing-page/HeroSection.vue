<script setup lang="ts">
import BodyText from '../reusable/BodyText.vue'
import HeadingText from '../reusable/HeadingText.vue'
import PillTag from '../reusable/PillTag.vue'
import { Button } from '../ui/button';
</script>

<template>
  <section id="hero" class="relative flex w-full flex-1 items-center justify-center py-8 sm:py-16">
    <div
      class="mx-auto flex w-full items-center max-w-[900px] flex-col gap-7 px-6 py-12 text-center sm:px-8 sm:py-16"
    >
      <PillTag>AI-Powered Regulatory Intelligence</PillTag>
      <HeadingText tag="h1" align="center">
        Automate Legal Monitoring,<br />
        Never Miss A Critical Update
      </HeadingText>
      <BodyText class="mx-auto max-w-[600px]" align="center" tone="muted">
        LegalWatchDog uses AI to track all changes on any website, from Visa portals to employment
        laws and delivers concise actionable summaries.
      </BodyText>
      <Button class="self-center cursor-pointer" size="lg">
        Get Monitoring For Free
      </Button>
    </div>
  </section>
</template>
