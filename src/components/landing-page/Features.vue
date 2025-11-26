<template>
  <div class="features-page">
    <!-- Hero Section -->
    <section class="bg-[#3F1A0F] py-24 text-center md:py-36">
      <div class="mx-auto max-w-5xl px-6">
        <div
          class="mb-6 inline-flex items-center space-x-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#3F1A0F]"
        >
          <img :src="starIcon" alt="Star Icon" class="h-4 w-4" />
          <span>Features</span>
        </div>

        <TypographyHeading
          level="h1"
          class="mb-6 text-4xl leading-tight font-extrabold text-white sm:text-5xl md:text-6xl"
        >
          Never Miss a Legal Update Again
        </TypographyHeading>

        <TypographyText class="mx-auto mb-10 max-w-3xl text-lg text-gray-300 md:text-xl">
          Stay ahead of legal change by automating the monitoring process and saving hours of manual
          research every week.
        </TypographyText>

        <button
          class="rounded-lg bg-white px-8 py-3 font-semibold text-[#3F1A0F] shadow-lg transition duration-200 hover:bg-gray-100"
        >
          Get Started
        </button>
      </div>
    </section>

    <!-- Main Features -->
    <main class="bg-gray-50 pt-20 pb-16">
      <div class="mx-auto max-w-7xl px-6">
        <div class="mx-auto flex justify-center text-center">
          <TypographyHeading level="h2" class="text-3xl font-bold text-gray-900 md:text-4xl">
            Exploring the <span class="text-[#F2AB6D]">Uniqueness</span> of our Product
          </TypographyHeading>
        </div>

        <!-- 1. Real-Time Alerts -->
        <div class="mb-24 grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <div class="order-2 md:order-1">
            <TypographyHeading level="h3" class="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
              Real-Time Legislative Alerts
            </TypographyHeading>
            <TypographyText class="text-lg text-gray-600">
              Receive instant updates whenever relevant laws or regulations change. Never miss a
              critical compliance deadline.
            </TypographyText>
          </div>
          <div class="relative order-1 md:order-2">
            <div class="overflow-hidden rounded-3xl p-6 md:p-10">
              <img :src="feature1" alt="Dashboard" class="w-full rounded-2xl shadow-xl" />
            </div>
            <!-- Bell floating at bottom-right -->
            <img
              :src="featureChild1"
              alt="Notification Bell"
              class="absolute right-0 bottom-0 z-10 h-28 w-35 -translate-x-[430px] -translate-y-6 rounded-2xl object-cover md:h-40 md:w-40"
            />
          </div>
        </div>

        <!-- 2. Customizable Watchlists -->
        <div class="mb-24 grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <div class="relative order-1">
            <div class="overflow-hidden p-6 md:p-10">
              <img :src="feature2" alt="Jurisdiction Modal" class="w-full" />
            </div>
            <!-- AI Toolkit floating at bottom-left -->
            <img
              :src="featureChild2"
              alt="AI Toolkit"
              class="absolute bottom-0 left-0 z-10 h-28 w-32 translate-x-[410px] -translate-y-6 rounded-2xl object-cover md:h-40 md:w-40"
            />
          </div>
          <div class="order-2">
            <TypographyHeading level="h3" class="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
              Customizable Watchlists
            </TypographyHeading>
            <TypographyText class="text-lg text-gray-600">
              Track only the projects, areas, or jurisdictions that matter to you. Your updates,
              your focus.
            </TypographyText>
          </div>
        </div>

        <!-- 3. AI-Powered Insights -->
        <div class="mb-24 grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <div class="order-2 md:order-1">
            <TypographyHeading level="h3" class="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
              AI-Powered Legal Insights
            </TypographyHeading>
            <TypographyText class="text-lg text-gray-600">
              AI helps you quickly summarize regulations, flags critical changes, and identifies
              cross-jurisdictional risks so you stay compliant with minimal effort.
            </TypographyText>
          </div>
          <div class="relative order-1 md:order-2">
            <div class="overflow-hidden p-6 md:p-10">
              <img :src="feature3" alt="AI Summary" class="w-full rounded-2xl shadow-xl" />
            </div>
            <!-- AI Brain floating at bottom-center-ish -->
            <img
              :src="featureChild3"
              alt="AI Brain"
              class="absolute bottom-0 left-1/2 z-10 h-32 w-32 -translate-x-[280px] -translate-y-6 md:h-40 md:w-60"
            />
          </div>
        </div>

        <!-- 4. Task Management & Ticketing -->
        <div class="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <div class="relative order-1">
            <div class="overflow-hidden p-6 md:p-10">
              <img :src="feature4" alt="Team Invite" class="w-full rounded-2xl" />
            </div>
            <!-- Tickets floating at bottom-left -->
            <img
              :src="featureChild4"
              alt="Tickets"
              class="absolute bottom-0 left-0 z-10 h-28 w-28 translate-x-[400px] -translate-y-6 md:h-40 md:w-40"
            />
          </div>
          <div class="order-2">
            <TypographyHeading level="h3" class="mb-4 text-2xl font-bold text-gray-900 md:text-3xl">
              Task Management & Ticketing
            </TypographyHeading>
            <TypographyText class="text-lg text-gray-600">
              Create actionable tickets for each legal update, keeping your team informed and
              accountable.
            </TypographyText>
          </div>
        </div>
      </div>
    </main>

    <!-- Final CTA -->
    <section class="bg-white py-20 text-center md:py-28">
      <div class="mx-auto max-w-5xl px-6">
        <TypographyHeading
          level="h2"
          class="mb-6 text-center text-4xl leading-tight font-bold text-[#401903]"
        >
          Turn <span class="text-[#F2AB6D]"> Legal Changes </span>Into Clear Actions
        </TypographyHeading>

        <TypographyText class="mb-10 text-center text-lg text-gray-600 md:text-xl">
          Stay informed. Stay compliant. Stay ahead.
        </TypographyText>

        <button
          class="rounded-lg bg-[#3F1A0F] px-8 py-4 text-lg font-semibold text-white shadow-xl transition duration-200 hover:bg-[#2F140A]"
        >
          Get Started
        </button>
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
</script>

<style scoped>
/* All magic is done with Tailwind + precise absolute positioning */
</style>
