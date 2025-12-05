<script setup lang="ts">
import HeadingText from '@/components/reusable/HeadingText.vue'
import BodyText from '@/components/reusable/BodyText.vue'

// Import images
import Rectangle from '@/assets/Images/Rectangle.png'
import SearchSource from '@/assets/Images/SearchSource.png'
import Timeline from '@/assets/Images/Timeline.png'
</script>

<template>
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
</template>
