<script setup lang="ts">
import HeadingText from '@/components/reusable/HeadingText.vue'
import BodyText from '@/components/reusable/BodyText.vue'
import backleft from '@/assets/Images/backleft.png'
import backright from '@/assets/Images/backright.png'
import { RouterLink } from 'vue-router'

// Import images
import Rectangle from '@/assets/Images/Rectangle.png'
import SearchSource from '@/assets/Images/SearchSource.png'
import Timeline from '@/assets/Images/Timeline.png'
</script>

<template>
  <div class="w-full">
    <!-- Features Section -->
    <section class="app-container relative w-full px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div class="mx-auto">
        <!-- Section Header -->
        <div class="mb-8 text-center sm:mb-12 lg:mb-16">
          <HeadingText
            tag="h2"
            align="center"
            class="mb-3 text-2xl leading-tight sm:mb-4 sm:text-3xl lg:text-4xl"
          >
            Powerful <span class="text-accent">Features</span> to <br class="hidden sm:inline" />
            <span class="sm:hidden"> </span>Keep You Informed
          </HeadingText>
          <BodyText
            align="center"
            tone="muted"
            class="mx-auto max-w-full text-sm leading-relaxed font-semibold sm:max-w-[600px] sm:text-base lg:max-w-[700px] lg:text-lg"
          >
            Our platform is designed to provide clarity and save you time, ensuring you're always
            ahead of regulatory changes
          </BodyText>
        </div>

        <!-- Features Cards -->
        <div class="flex flex-col gap-5 sm:gap-6 lg:gap-8">
          <!-- Card 1: AI Powered Summaries -->
          <div
            class="bg-accent relative flex min-h-80 flex-col gap-4 overflow-hidden rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:min-h-[340px] sm:gap-6 sm:rounded-3xl sm:p-8 lg:min-h-[380px] lg:rounded-4xl lg:p-12"
          >
            <!-- Text Section -->
            <div
              class="relative z-10 flex flex-col justify-center sm:max-w-[52%] md:mt-8 lg:mt-20 xl:mt-28 xl:max-w-[46%]"
            >
              <h3
                class="mb-3 text-2xl leading-tight font-bold text-[#000000] sm:mb-4 sm:text-3xl lg:text-[2.5rem]"
              >
                AI Powered Summaries
              </h3>
              <p
                class="max-w-full text-sm leading-relaxed font-semibold text-white/80 sm:max-w-sm sm:text-base lg:text-[1.05rem]"
              >
                Turn Complex jargon into plain English summaries you can act on immediately
              </p>
            </div>

            <!-- Image Section (White Card) -->
            <div
              class="relative mt-auto overflow-hidden rounded-xl bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.1)] sm:absolute sm:top-12 sm:right-0 sm:bottom-0 sm:mt-0 sm:w-[48%] sm:rounded-r-none sm:rounded-b-none sm:p-5 lg:top-16 lg:w-[50%] lg:rounded-[20px] lg:px-6 lg:pt-6 lg:pb-0"
            >
              <img
                :src="Rectangle"
                alt="AI Brain illustration"
                class="h-auto w-full object-contain"
              />
            </div>
          </div>

          <!-- Card 2: Change Timeline -->
          <div
            class="bg-accent relative flex min-h-80 flex-col gap-4 overflow-hidden rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:min-h-[340px] sm:gap-6 sm:rounded-3xl sm:p-8 lg:min-h-[380px] lg:rounded-4xl lg:p-12"
          >
            <!-- Image Section (White Card) -->
            <div
              class="relative order-2 mt-auto overflow-hidden rounded-xl bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.1)] sm:absolute sm:top-12 sm:bottom-0 sm:left-0 sm:order-1 sm:mt-0 sm:w-[48%] sm:rounded-l-none sm:rounded-b-none sm:p-5 lg:top-16 lg:w-[50%] lg:rounded-[20px] lg:px-6 lg:pt-6 lg:pb-0"
            >
              <img :src="SearchSource" alt="SearchSource" class="h-auto w-full object-contain" />
            </div>

            <!-- Text Section -->
            <div
              class="relative z-10 order-1 flex flex-col justify-center sm:order-2 sm:ml-auto sm:max-w-[52%] md:mt-8 lg:mt-20 xl:max-w-[46%]"
            >
              <h3
                class="mb-3 text-2xl leading-tight font-bold text-[#000000] sm:mb-4 sm:text-3xl lg:text-[2.5rem]"
              >
                Change Timeline
              </h3>
              <p
                class="max-w-full text-sm leading-relaxed font-semibold text-white/80 sm:max-w-sm sm:text-base lg:text-[1.05rem]"
              >
                Visually track historical changes to understand the evolution or that document or
                policy.
              </p>
            </div>
          </div>

          <!-- Card 3: Source Verification -->
          <div
            class="bg-accent relative flex min-h-80 flex-col gap-4 overflow-hidden rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:min-h-[340px] sm:gap-6 sm:rounded-3xl sm:p-8 lg:min-h-[380px] lg:rounded-4xl lg:p-12"
          >
            <!-- Text Section -->
            <div
              class="relative z-10 flex flex-col justify-center sm:max-w-[52%] md:mt-8 lg:mt-20 xl:mt-28 xl:max-w-[46%]"
            >
              <h3
                class="mb-3 text-2xl leading-tight font-bold text-[#000000] sm:mb-4 sm:text-3xl lg:text-[2.5rem]"
              >
                Source Verification
              </h3>
              <p
                class="max-w-full text-sm leading-relaxed font-semibold text-white/80 sm:max-w-sm sm:text-base lg:text-[1.05rem]"
              >
                Get real time notifications with direct links to the source of any change or full
                transparency.
              </p>
            </div>

            <!-- Image Section -->
            <div
              class="relative mt-auto overflow-hidden rounded-xl bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.1)] sm:absolute sm:top-12 sm:right-0 sm:bottom-0 sm:mt-0 sm:w-[48%] sm:rounded-r-none sm:rounded-b-none sm:p-5 lg:top-16 lg:w-[50%] lg:rounded-[20px] lg:px-6 lg:pt-6 lg:pb-0"
            >
              <img :src="Timeline" alt="Timeline" class="h-auto w-full object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="app-container px-4 py-12 sm:px-6 lg:py-16">
      <div class="rounded-2xl bg-white p-6 shadow-xl sm:p-8 md:p-10">
        <div class="mx-auto max-w-3xl space-y-4 text-center sm:space-y-6">
          <h2 class="text-2xl leading-tight font-bold sm:text-3xl lg:text-4xl">
            Your Global Pulse,<br class="hidden sm:block" />
            All in One Map
          </h2>

          <BodyText
            align="center"
            tone="muted"
            class="mx-auto max-w-full text-sm leading-relaxed font-semibold sm:max-w-[600px] sm:text-base lg:max-w-[700px] lg:text-lg"
          >
            Our AI monitors and summarizes updates from verified sources across continents, ensuring
            nothing slips through the cracks.
          </BodyText>

          <!-- Map Image -->
          <div class="flex justify-center pt-4 sm:pt-6">
            <img
              src="/images/mapbase.png"
              alt="World Map"
              class="w-full max-w-md sm:max-w-xl lg:max-w-2xl"
            />
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-1 gap-6 pt-6 text-center sm:grid-cols-3 sm:gap-8 sm:pt-8">
            <div>
              <p class="text-2xl font-bold sm:text-3xl lg:text-4xl">5,000+</p>
              <p class="text-xs text-gray-600 sm:text-sm">Data Sources Worldwide</p>
            </div>

            <div>
              <p class="text-2xl font-bold sm:text-3xl lg:text-4xl">200+</p>
              <p class="text-xs text-gray-600 sm:text-sm">Countries being monitored</p>
            </div>

            <div>
              <p class="text-2xl font-bold sm:text-3xl lg:text-4xl">100%</p>
              <p class="text-xs text-gray-600 sm:text-sm">Regulatory Compliance Assured</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="app-container px-4 py-12 sm:px-6 lg:py-16">
      <div
        class="relative mx-auto w-full overflow-hidden rounded-2xl bg-[#3C2610] px-6 py-12 sm:rounded-3xl sm:px-8 sm:py-16 lg:px-12 lg:py-24"
      >
        <img
          :src="backleft"
          alt=""
          class="pointer-events-none absolute bottom-0 left-0 w-32 opacity-50 sm:w-40 md:w-48 lg:w-64"
        />
        <img
          :src="backright"
          alt=""
          class="pointer-events-none absolute right-0 bottom-0 w-32 opacity-50 sm:w-40 md:w-48 lg:w-64"
        />

        <div
          class="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center sm:gap-8"
        >
          <h2 class="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Gain your Strategic Advantage
          </h2>
          <p class="text-base leading-relaxed text-white/80 sm:text-lg">
            Stop worrying about regulatory blindsides. Start tracking changes with precision and
            confidence today.
          </p>
          <RouterLink
            to="/signup"
            class="btn--default btn--lg bg-accent-subtle hover:bg-accent-main mt-2 sm:mt-4"
          >
            Start monitoring now
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Ensure images maintain aspect ratio */
img {
  max-width: 100%;
  height: auto;
}

/* Responsive container adjustments */
@media (max-width: 640px) {
  .app-container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
