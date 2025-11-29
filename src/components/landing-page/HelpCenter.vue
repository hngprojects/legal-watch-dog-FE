<template>
  <div class="help-center-page font-inter min-h-screen bg-white">
    <main class="bg-[#F8FAFC] py-16 md:py-24">
      <!-- Main Titles -->
      <div class="mb-16 px-4 text-center sm:px-6 lg:px-8">
        <TypographyHeading
          level="h1"
          class="mb-4 text-center text-6xl font-extrabold tracking-tighter text-[#5D2D18] md:text-7xl"
        >
          Help Center
        </TypographyHeading>

        <TypographyText class="block text-center text-xl font-medium text-gray-700">
          How can we help you today?
        </TypographyText>
      </div>

      <!-- Hero Section (3 Action Cards) -->
      <div class="mx-auto mb-24 app-container px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 text-center md:grid-cols-3">
          <!-- Card 1 -->
          <div
            class="flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-8 shadow-lg transition duration-300 hover:shadow-2xl"
          >
            <div class="mb-4 h-12 w-5">
              <img :src="help1" alt="Phone Icon" class="h-full w-full object-contain" />
            </div>

            <TypographyHeading
              level="h3"
              class="mb-1 text-center text-xl font-semibold text-gray-900"
            >
              Contact Support
            </TypographyHeading>

            <TypographyText class="block text-center text-sm text-gray-500">
              Get in touch with our support team.
            </TypographyText>
          </div>

          <!-- Card 2 -->
          <div
            class="flex h-[200px] flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-8 text-center shadow-lg"
          >
            <div class="mb-4 h-12 w-5">
              <img :src="help2" alt="Search Icon" class="h-full w-full object-contain" />
            </div>

            <TypographyHeading
              level="h3"
              class="mb-4 text-center text-xl font-semibold text-gray-900"
            >
              Search Articles
            </TypographyHeading>
          </div>

          <!-- Card 3 -->
          <div
            class="flex h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-8 shadow-lg transition duration-300 hover:shadow-2xl"
          >
            <div class="mb-4 h-12 w-5">
              <img :src="help3" alt="User Icon" class="h-full w-full object-contain" />
            </div>

            <TypographyHeading
              level="h3"
              class="mb-1 text-center text-xl font-semibold text-gray-900"
            >
              User Guide
            </TypographyHeading>

            <TypographyText class="block text-center text-sm text-gray-500">
              Complete documentation and tutorials.
            </TypographyText>
          </div>
        </div>
      </div>

      <!-- Need Help Section Title -->
      <div class="mb-16 px-4 text-center sm:px-6 lg:px-0 app-container">
        <TypographyHeading
          level="h2"
          class="mb-3 text-center text-4xl font-extrabold text-gray-900 md:text-5xl"
        >
          Need Help?
        </TypographyHeading>

        <TypographyText class="mx-auto block max-w-2xl text-center text-lg text-gray-700">
          Get answers, find support, and learn how to make the most of Legal Watchdog.
        </TypographyText>
      </div>

      <!-- Features Grid -->
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-0 app-container">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <div
            v-for="feature in helpFeatures"
            :key="feature.title"
            class="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-8 text-center shadow-md transition duration-300 hover:shadow-xl"
          >
            <!-- ICON -->
            <div
              class="mb-4 flex h-16 w-16 items-center justify-center rounded-[75.9px] bg-[#FCEBD8]"
            >
              <img
                :src="feature.icon"
                :alt="feature.title + ' Icon'"
                class="h-10 w-5 object-contain"
              />
            </div>

            <!-- Title -->
            <TypographyHeading level="h3" class="mb-2 text-center text-xl font-bold text-gray-900">
              {{ feature.title }}
            </TypographyHeading>

            <!-- Description -->
            <TypographyText class="mb-4 block text-center text-sm text-gray-600">
              {{ feature.description }}
            </TypographyText>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { TypographyHeading, TypographyText } from '../ui/typography'

import help1 from '@/assets/icons/help1.png'
import help2 from '@/assets/icons/help2.png'
import help3 from '@/assets/icons/help3.png'

import needhelp1 from '@/assets/icons/needhelp1.png'
import needhelp2 from '@/assets/icons/needhelp2.png'
import needhelp3 from '@/assets/icons/needhelp3.png'
import needhelp4 from '@/assets/icons/needhelp4.png'
import needhelp5 from '@/assets/icons/needhelp5.png'
import needhelp6 from '@/assets/icons/needhelp6.png'

const helpFeatures = [
  {
    icon: needhelp1,
    title: 'Getting Started',
    description: 'Set up your account and create your first monitoring project.',
  },
  {
    icon: needhelp2,
    title: 'Monitoring & Alerts',
    description: 'Learn how updates, alerts, and jurisdictions work.',
  },
  {
    icon: needhelp3,
    title: 'Legal Summaries & Sources',
    description: 'Understand how we verify, summarize, and source legal updates.',
  },
  {
    icon: needhelp4,
    title: 'Account & Billing',
    description: 'Manage subscriptions, payments, and team access.',
  },
  {
    icon: needhelp5,
    title: 'Privacy & Security',
    description: 'Your data protection and compliance details.',
  },
  {
    icon: needhelp6,
    title: 'Troubleshooting',
    description: 'Fix common issues and report problems quickly.',
  },
]
</script>
