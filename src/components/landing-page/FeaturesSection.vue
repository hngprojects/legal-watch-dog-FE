<script setup lang="ts">
import HeadingText from '@/components/reusable/HeadingText.vue'
import BodyText from '@/components/reusable/BodyText.vue'

// Import images
import Rectangle from '@/assets/Images/Rectangle.png'
import SearchSource from '@/assets/Images/SearchSource.png'
import Timeline from '@/assets/Images/Timeline.png'
</script>

<template>
  <section class="relative w-full app-container">
    <div class="mx-auto">
      <!-- Section Header -->
      <div class="mb-16 text-center">
        <HeadingText tag="h2" align="center" class="mb-4">
          Powerful <span class="text-accent">Features</span> to <br />
          Keep You Informed
        </HeadingText>
        <BodyText align="center" tone="muted" class="mx-auto max-w-[700px] font-semibold">
          Our platform is designed to provide clarity and save you time, ensuring you're always
          ahead of regulatory changes
        </BodyText>
      </div>

      <!-- Features Cards -->
      <div class="flex flex-col gap-8">
        <!-- Card 1: AI Powered Summaries -->
        <div
          class="bg-accent relative flex min-h-[290px] flex-col gap-6 overflow-hidden rounded-4xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:min-h-[340px] sm:p-12"
        >
          <!-- Text Section -->
          <div class="relative z-10 flex flex-col justify-center sm:mt-20 sm:max-w-[46%] lg:mt-28">
            <h3 class="mb-4 text-[2rem] leading-tight font-bold text-[#000000] sm:text-[2.5rem]">
              AI Powered Summaries
            </h3>
            <p
              class="max-w-sm text-[1rem] leading-relaxed font-semibold text-gray-600 sm:text-[1.05rem]"
            >
              Turn Complex legal jargon into plain English summaries you can act on immediately
            </p>
          </div>

          <!-- Image Section (White Card Anchored to Bottom-Right) -->
          <div
            class="relative overflow-hidden rounded-[20px] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)] sm:absolute sm:top-16 sm:right-0 sm:bottom-0 sm:w-[50%] sm:rounded-r-none sm:rounded-b-none sm:px-6 sm:pt-6 sm:pb-0"
          >
            <img :src="Rectangle" alt="AI Brain illustration" class="w-full object-contain" />
          </div>
        </div>
        <!-- Card 2: Change Timeline -->
        <div
          class="bg-accent relative flex min-h-[290px] flex-col gap-6 overflow-hidden rounded-4xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:min-h-[340px] sm:p-12"
        >
          <!-- Image Section (White Card Anchored to Bottom-Left) -->
          <div
            class="relative order-2 overflow-hidden rounded-[20px] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)] sm:absolute sm:top-16 sm:bottom-0 sm:left-0 sm:w-[50%] sm:rounded-l-none sm:rounded-b-none sm:px-6 sm:pt-6 sm:pb-0"
          >
            <img :src="SearchSource" alt="SearchSource" class="w-full object-contain" />
          </div>
          <!-- Text Section -->
          <div class="relative z-10 order-1 flex flex-col justify-center sm:ml-auto sm:max-w-[46%]">
            <h3 class="mb-4 text-[2rem] leading-tight font-bold text-[#000000] sm:text-[2.5rem]">
              Change Timeline
            </h3>
            <p
              class="max-w-sm text-[1rem] leading-relaxed font-semibold text-gray-600 sm:text-[1.05rem]"
            >
              Visually track historical changes to understand the evolution or that document or
              policy.
            </p>
          </div>
        </div>

        <!-- Card 3: Source Verification -->
        <div
          class="bg-accent relative flex min-h-[290px] flex-col gap-6 overflow-hidden rounded-4xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:min-h-[340px] sm:p-12"
        >
          <!-- Text Section -->
          <div class="relative z-10 flex flex-col justify-center sm:mt-20 sm:max-w-[46%] lg:mt-28">
            <h3 class="mb-4 text-[2rem] leading-tight font-bold text-[#000000] sm:text-[2.5rem]">
              Source Verification
            </h3>
            <p
              class="max-w-sm text-[1rem] leading-relaxed font-semibold text-gray-600 sm:text-[1.05rem]"
            >
              Get real time notifications with direct links to the source of any change or full
              transparency.
            </p>
          </div>

          <!-- Image Section -->
          <div
            class="relative overflow-hidden rounded-[20px] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)] sm:absolute sm:top-16 sm:right-0 sm:bottom-0 sm:w-[50%] sm:rounded-r-none sm:rounded-b-none sm:px-6 sm:pt-6 sm:pb-0"
          >
            <img :src="Timeline" alt="Timeline" class="w-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
