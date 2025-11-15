<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue'
import BodyText from '@/components/atoms/BodyText.vue'
import HeadingText from '@/components/atoms/HeadingText.vue'
import PillTag from '@/components/atoms/PillTag.vue'
</script>

<template>
  <section class="relative flex w-full flex-1 items-center justify-center py-8 sm:py-16">
    <div
      class="mx-auto flex w-full max-w-[900px] flex-col gap-7 rounded-[40px] bg-[linear-gradient(135deg,#fff8f0,#fefefe)] px-6 py-12 text-center shadow-[0_25px_60px_rgba(82,43,14,0.15),_inset_0_1px_0_rgba(255,255,255,0.7)] sm:px-8 sm:py-16"
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
      <BaseButton class="self-center" size="lg" variant="primary">Get Monitoring For Free</BaseButton>
    </div>
  </section>
</template>
