<template>
  <div class="features-page">
    <!-- Hero Section -->
    <section class="bg-[#3F1A0F] py-16 text-center sm:py-20 md:py-28 lg:py-36">
      <div class="mx-auto max-w-5xl px-4 sm:px-6">
        <div
          class="mb-4 inline-flex items-center justify-center space-x-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-[#3F1A0F] sm:mb-5 sm:px-4 sm:py-2 sm:text-sm"
        >
          <img :src="starIcon" alt="Star Icon" class="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Features</span>
        </div>

        <TypographyHeading
          level="h1"
          class="mb-4 text-3xl leading-tight font-extrabold text-white sm:mb-5 sm:text-4xl md:text-5xl lg:text-6xl"
        >
          Never Miss a Regulatory Update Again
        </TypographyHeading>

        <TypographyText
          class="mx-auto mb-8 max-w-3xl text-sm text-gray-300 sm:mb-10 sm:text-base md:text-lg lg:text-xl"
        >
          Stay ahead of regulatory change by automating the monitoring process and saving hours of
          manual research every week.
        </TypographyText>

        <RouterLink to="/signup" class="btn--contrast btn--lg">Get Started</RouterLink>
      </div>
    </section>

    <!-- Main Features -->
    <main class="app-container bg-gray-50 py-12 sm:py-16 lg:pt-20 lg:pb-16">
      <div class="mx-auto">
        <div class="mx-auto mb-12 flex justify-center text-center sm:mb-16">
          <TypographyHeading
            level="h2"
            class="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl"
          >
            Exploring the <span class="text-[#F2AB6D]">Uniqueness</span> of our Product
          </TypographyHeading>
        </div>

        <!-- 1. Real-Time Alerts -->
        <div
          class="mb-16 grid items-center gap-8 md:mb-20 md:grid-cols-2 md:gap-12 lg:mb-24 lg:gap-20"
        >
          <div class="order-2 md:order-1">
            <TypographyHeading
              level="h3"
              class="mb-3 text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl"
            >
              Real-Time Legislative Alerts
            </TypographyHeading>

            <TypographyText class="text-base text-gray-600 sm:text-lg">
              Receive instant updates whenever relevant laws or regulations change. Never miss a
              critical compliance deadline.
            </TypographyText>
          </div>

          <div class="relative order-1 md:order-2">
            <div class="overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:p-6 md:p-8 lg:p-10">
              <img
                :src="feature1"
                alt="Dashboard"
                class="w-full rounded-xl shadow-xl sm:rounded-2xl"
              />
            </div>

            <img
              :src="featureChild1"
              alt="Notification Bell"
              class="absolute right-0 bottom-0 z-10 h-20 w-20 -translate-x-4 -translate-y-4 rounded-xl object-cover sm:h-24 sm:w-24 sm:-translate-x-6 sm:-translate-y-6 md:h-32 md:w-32 lg:h-40 lg:w-40 xl:-translate-x-[430px] xl:-translate-y-6"
            />
          </div>
        </div>

        <!-- 2. Customizable Watchlists -->
        <div
          class="mb-16 grid items-center gap-8 md:mb-20 md:grid-cols-2 md:gap-12 lg:mb-24 lg:gap-20"
        >
          <div class="relative order-1">
            <div class="overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:p-6 md:p-8 lg:p-10">
              <img
                :src="feature2"
                alt="Jurisdiction Modal"
                class="w-full rounded-xl sm:rounded-2xl"
              />
            </div>

            <img
              :src="featureChild2"
              alt="AI Toolkit"
              class="absolute bottom-0 left-0 z-10 h-20 w-20 translate-x-4 -translate-y-4 rounded-xl object-cover sm:h-24 sm:w-24 sm:translate-x-6 sm:-translate-y-6 md:h-32 md:w-32 lg:h-40 lg:w-40 xl:translate-x-[410px] xl:-translate-y-6"
            />
          </div>

          <div class="order-2">
            <TypographyHeading
              level="h3"
              class="mb-3 text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl"
            >
              Customizable Watchlists
            </TypographyHeading>

            <TypographyText class="text-base text-gray-600 sm:text-lg">
              Track only the projects, areas, or jurisdictions that matter to you. Your updates,
              your focus.
            </TypographyText>
          </div>
        </div>

        <!-- 3. AI-Powered Insights -->
        <div
          class="mb-16 grid items-center gap-8 md:mb-20 md:grid-cols-2 md:gap-12 lg:mb-24 lg:gap-20"
        >
          <div class="order-2 md:order-1">
            <TypographyHeading
              level="h3"
              class="mb-3 text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl"
            >
              AI-Powered Insights
            </TypographyHeading>

            <TypographyText class="text-base text-gray-600 sm:text-lg">
              AI helps you quickly summarize regulations, flags critical changes, and identifies
              cross-jurisdictional risks so you stay compliant with minimal effort.
            </TypographyText>
          </div>

          <div class="relative order-1 md:order-2">
            <div class="overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:p-6 md:p-8 lg:p-10">
              <img
                :src="feature3"
                alt="AI Summary"
                class="w-full rounded-xl shadow-xl sm:rounded-2xl"
              />
            </div>

            <img
              :src="featureChild3"
              alt="AI Brain"
              class="absolute bottom-0 left-1/2 z-10 h-24 w-24 -translate-x-1/2 -translate-y-4 rounded-xl object-cover sm:h-28 sm:w-28 md:h-36 md:w-36 lg:h-40 lg:w-60 xl:-translate-x-[280px] xl:-translate-y-6"
            />
          </div>
        </div>

        <!-- 4. Task Management & Ticketing -->
        <div class="grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-20">
          <div class="relative order-1">
            <div class="overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:p-6 md:p-8 lg:p-10">
              <img :src="feature4" alt="Team Invite" class="w-full rounded-xl sm:rounded-2xl" />
            </div>

            <img
              :src="featureChild4"
              alt="Tickets"
              class="absolute bottom-0 left-0 z-10 h-20 w-20 translate-x-4 -translate-y-4 rounded-xl object-cover sm:h-24 sm:w-24 sm:translate-x-6 sm:-translate-y-6 md:h-32 md:w-32 lg:h-40 lg:w-40 xl:translate-x-[400px] xl:-translate-y-6"
            />
          </div>

          <div class="order-2">
            <TypographyHeading
              level="h3"
              class="mb-3 text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl"
            >
              Task Management & Ticketing
            </TypographyHeading>

            <TypographyText class="text-base text-gray-600 sm:text-lg">
              Create actionable tickets for each update, keeping your team informed and accountable.
            </TypographyText>
          </div>
        </div>
      </div>
    </main>

    <!-- Final CTA -->
    <section class="bg-white py-12 text-center sm:py-16 md:py-20 lg:py-28">
      <div class="mx-auto max-w-5xl px-4 sm:px-6">
        <TypographyHeading
          level="h2"
          class="mb-4 text-2xl leading-tight font-bold text-[#401903] sm:mb-5 sm:text-3xl md:text-4xl"
        >
          Turn <span class="text-[#F2AB6D]"> Regulatory Changes </span>Into Clear Actions
        </TypographyHeading>

        <TypographyText class="mb-8 text-base text-gray-600 sm:mb-10 sm:text-lg md:text-xl">
          Stay informed. Stay compliant. Stay ahead.
        </TypographyText>

        <RouterLink to="/signup" class="btn--default btn--lg">Get Started</RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { TypographyHeading, TypographyText } from '../ui/typography'

import starIcon from '@/assets/icons/star.png'
import feature1 from '@/assets/Images/Feature1.png'
import feature2 from '@/assets/Images/Feature2.png'
import feature3 from '@/assets/Images/Feature3.png'
import feature4 from '@/assets/Images/Feature4.png'

import featureChild1 from '@/assets/Images/Featurechild1.png'
import featureChild2 from '@/assets/Images/Featurechild2.png'
import featureChild3 from '@/assets/Images/Featurechild3.png'
import featureChild4 from '@/assets/Images/Featurechild4.png'
import { RouterLink } from 'vue-router'
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .app-container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Mobile-specific adjustments */
@media (max-width: 768px) {
  .features-page section,
  .features-page main {
    overflow-x: hidden;
  }

  /* Ensure images don't overflow on mobile */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Better touch targets for buttons */
  button {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}

/* Tablet-specific adjustments */
@media (min-width: 640px) and (max-width: 1024px) {
  /* Adjust floating image positions for tablet */
  .relative img[alt*='Notification Bell'],
  .relative img[alt*='AI Toolkit'],
  .relative img[alt*='AI Brain'],
  .relative img[alt*='Tickets'] {
    transform: translateX(0) translateY(0) !important;
    position: relative !important;
    margin-top: 1rem;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }
}

/* Ensure content doesn't become too wide on large screens */
@media (min-width: 1536px) {
  .app-container {
    max-width: 1280px;
  }
}
</style>
