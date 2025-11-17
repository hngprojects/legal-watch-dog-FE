<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue'
import BodyText from '@/components/atoms/BodyText.vue'
import HeadingText from '@/components/atoms/HeadingText.vue'
import PillTag from '@/components/atoms/PillTag.vue'
</script>

<template>
  <section class="relative flex w-full flex-1 items-center justify-center pt-4 pb-8 sm:pt-6 sm:pb-16">
    <div class="mx-auto flex w-full items-center max-w-[900px] flex-col gap-6 px-6 pt-12  text-center sm:px-8 sm:py-16">
      <PillTag>Join the Waitlist</PillTag>

      <HeadingText tag="h1" align="center" class="text-4xl sm:text-5xl lg:text-5xl font-bold leading-tight">
        Stay Ahead of Legal Changes<br />
        Without the Weekly Stress
      </HeadingText>

      <BodyText class="mx-auto max-w-[800px] text-base sm:text-lg" align="center" tone="muted">
        LegalWatchdog tracks government updates, policy shifts, and regulatory changes for you.
        Get clear summaries, real-time alerts, and complete visibility across all your jurisdictions.
      </BodyText>

      <div class="flex flex-col sm:flex-row items-center gap-3 w-full max-w-[520px] mt-2">
        <input type="email" placeholder="Enter Email"
          class="flex-1 w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        <BaseButton class="w-full sm:w-auto whitespace-nowrap px-6" size="lg" variant="primary">
          Join the Waitlist
        </BaseButton>
      </div>
      <p class="text-xs text-[#6A7282]">We respect your privacy. No spam, Unsuscribe anytime.</p>

      <!-- <div class="mt-8 w-full max-w-[800px]">
        <img
          src="/images/dashboard.png"
          alt="Legal WatchDog Dashboard"
          class="w-full h-auto rounded-lg shadow-2xl"
        />
      </div> -->

    </div>
  </section>
</template>
