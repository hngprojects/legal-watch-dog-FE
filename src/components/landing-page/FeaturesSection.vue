<script setup lang="ts">
import HeadingText from '@/components/atoms/HeadingText.vue'
import BodyText from '@/components/atoms/BodyText.vue'

// Import images
import aiBrainImage from '@/assets/images/ai-brain.png'
import timelineHandsImage from '@/assets/images/timeline-hands.png'
import verificationDashboardImage from '@/assets/images/verification-dashboard.png'
</script>

<template>
  <section class="relative w-full py-16 sm:py-24">
    <div class="mx-auto max-w-[1200px] px-6 sm:px-8">
      <!-- Section Header -->
      <div class="mb-16 text-center">
        <HeadingText tag="h2" align="center" class="mb-4">
          Powerful <span class="text-[#EB9654]">Features</span> to Keep You Informed
        </HeadingText>
        <BodyText align="center" tone="muted" class="mx-auto max-w-[700px]">
          Our platform is designed to provide clarity and save you time, ensuring you're always ahead of regulatory changes
        </BodyText>
      </div>

      <!-- Features Cards -->
      <div class="flex flex-col gap-8">
        
        <!-- Card 1: AI Powered Summaries -->
        <div class="relative flex min-h-[280px] flex-col gap-6 overflow-hidden rounded-[32px] bg-[#EB9654] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:min-h-[340px] sm:p-12">
          <!-- Text Section -->
          <div class="relative z-10 sm:max-w-[46%]">
            <h3 class="mb-4 text-[2rem] font-bold leading-tight text-[#000000] sm:text-[2.5rem]">
              AI Powered Summaries
            </h3>
            <p class="text-[1rem] leading-relaxed text-[#000000]/80 sm:text-[1.05rem]">
              Turn Complex legal jargon into plain English summaries you can act on immediately
            </p>
          </div>
          <!-- Image Section (White Card Anchored to Bottom-Right) -->
          <div class="relative overflow-hidden rounded-[20px] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)] sm:absolute sm:bottom-0 sm:right-0 sm:top-16 sm:w-[50%] sm:rounded-b-none sm:rounded-r-none sm:px-6 sm:pt-6 sm:pb-0">
            <img 
              :src="aiBrainImage" 
              alt="AI Brain illustration" 
              class="w-full object-contain"
            />
          </div>
        </div>

        <!-- Card 2: Change Timeline -->
        <div class="relative flex min-h-[280px] flex-col gap-6 overflow-hidden rounded-[32px] bg-[#EB9654] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:min-h-[340px] sm:p-12">
          <!-- Image Section (White Card Anchored to Bottom-Left) -->
          <div class="relative order-2 overflow-hidden rounded-[20px] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)] sm:absolute sm:bottom-0 sm:left-0 sm:top-16 sm:w-[50%] sm:rounded-b-none sm:rounded-l-none sm:px-6 sm:pt-6 sm:pb-0">
            <img 
              :src="timelineHandsImage" 
              alt="Timeline illustration" 
              class="w-full object-contain"
            />
          </div>
          <!-- Text Section -->
          <div class="relative order-1 z-10 sm:ml-auto sm:max-w-[46%]">
            <h3 class="mb-4 text-[2rem] font-bold leading-tight text-[#000000] sm:text-[2.5rem]">
              Change Timeline
            </h3>
            <p class="text-[1rem] leading-relaxed text-[#000000]/80 sm:text-[1.05rem]">
              Visually track historical changes to understand the evolution or that document or policy.
            </p>
          </div>
        </div>

        <!-- Card 3: Source Verification -->
        <div class="relative flex min-h-[280px] flex-col gap-6 overflow-hidden rounded-[32px] bg-[#EB9654] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:min-h-[340px] sm:p-12">
          <!-- Text Section -->
          <div class="relative z-10 sm:max-w-[46%]">
            <h3 class="mb-4 text-[2rem] font-bold leading-tight text-[#000000] sm:text-[2.5rem]">
              Source Verification
            </h3>
            <p class="text-[1rem] leading-relaxed text-[#000000]/80 sm:text-[1.05rem]">
              Get real time notifications with direct links to the source of any change or full transparency.
            </p>
          </div>
          <!-- Image Section (White Card Anchored to Bottom-Right) -->
          <div class="relative overflow-hidden rounded-[20px] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.1)] sm:absolute sm:bottom-0 sm:right-0 sm:top-16 sm:w-[50%] sm:rounded-b-none sm:rounded-r-none sm:px-6 sm:pt-6 sm:pb-0">
            <img 
              :src="verificationDashboardImage" 
              alt="Verification dashboard" 
              class="w-full object-contain"
            />
          </div>
        </div>

      </div>
    </div>
  </section>
</template>