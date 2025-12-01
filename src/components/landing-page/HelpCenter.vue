<template>
  <div class="help-center-page font-inter min-h-screen bg-white">
    <main class="bg-[#F8FAFC] py-12 md:py-20 lg:py-24">
      <!-- Main Titles -->
      <div class="mb-12 px-4 text-center sm:px-6 lg:px-8 lg:mb-16">
        <TypographyHeading
          level="h1"
          class="mb-3 text-center text-4xl font-extrabold tracking-tight text-[#5D2D18] sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Help Center
        </TypographyHeading>

        <TypographyText class="block text-center text-base font-medium text-gray-700 sm:text-lg md:text-xl">
          How can we help you today?
        </TypographyText>
      </div>

      <!-- Hero Section (3 Action Cards) -->
      <div class="app-container mx-auto mb-16 px-4 sm:px-6 lg:px-8 lg:mb-24">
        <div class="grid grid-cols-1 gap-6 text-center sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          <!-- Card 1: Contact Support -->
          <RouterLink
            to="/contact-us"
            class="flex h-[180px] flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition duration-300 hover:shadow-2xl sm:h-[200px] sm:p-8"
          >
            <div class="mb-4 h-10 w-4 sm:h-12 sm:w-5">
              <img :src="help1" alt="Phone Icon" class="h-full w-full object-contain" />
            </div>

            <TypographyHeading
              level="h3"
              class="mb-1 text-center text-lg font-semibold text-gray-900 sm:text-xl"
            >
              Contact Support
            </TypographyHeading>

            <TypographyText class="block text-center text-xs text-gray-500 sm:text-sm">
              Get in touch with our support team.
            </TypographyText>
          </RouterLink>

          <!-- Card 2: Search Articles -->
          <RouterLink
            to="/blog"
            class="flex h-[180px] flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-6 text-center shadow-lg transition duration-300 hover:shadow-2xl sm:h-[200px] sm:p-8"
          >
            <div class="mb-4 h-10 w-4 sm:h-12 sm:w-5">
              <img :src="help2" alt="Search Icon" class="h-full w-full object-contain" />
            </div>

            <TypographyHeading
              level="h3"
              class="mb-3 text-center text-lg font-semibold text-gray-900 sm:text-xl sm:mb-4"
            >
              Search Articles
            </TypographyHeading>
          </RouterLink>

          <!-- Card 3: User Guide -->
          <RouterLink
            to="/how-it-works"
            class="flex h-[180px] flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition duration-300 hover:shadow-2xl sm:h-[200px] sm:p-8"
          >
            <div class="mb-4 h-10 w-4 sm:h-12 sm:w-5">
              <img :src="help3" alt="User Icon" class="h-full w-full object-contain" />
            </div>

            <TypographyHeading
              level="h3"
              class="mb-1 text-center text-lg font-semibold text-gray-900 sm:text-xl"
            >
              User Guide
            </TypographyHeading>

            <TypographyText class="block text-center text-xs text-gray-500 sm:text-sm">
              Complete documentation and tutorials.
            </TypographyText>
          </RouterLink>
        </div>
      </div>

      <!-- Need Help Section Title -->
      <div class="app-container mb-12 px-4 text-center sm:px-6 lg:mb-16 lg:px-0">
        <TypographyHeading
          level="h2"
          class="mb-3 text-center text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl"
        >
          Need Help?
        </TypographyHeading>

        <TypographyText class="mx-auto block max-w-2xl text-center text-sm text-gray-700 sm:text-base md:text-lg">
          Get answers, find support, and learn how to make the most of Legal Watchdog.
        </TypographyText>
      </div>

      <!-- Features Grid -->
      <div class="app-container mx-auto max-w-7xl px-4 sm:px-6 lg:px-0">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          <div
            v-for="feature in helpFeatures"
            :key="feature.title"
            class="flex flex-col items-center rounded-xl border border-gray-100 bg-white p-6 text-center shadow-md transition duration-300 hover:shadow-xl sm:p-8"
          >
            <!-- ICON -->
            <div
              class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FCEBD8] sm:h-16 sm:w-16"
            >
              <img
                :src="feature.icon"
                :alt="feature.title + ' Icon'"
                class="h-8 w-4 object-contain sm:h-10 sm:w-5"
              />
            </div>

            <!-- Title -->
            <TypographyHeading level="h3" class="mb-2 text-center text-lg font-bold text-gray-900 sm:text-xl">
              {{ feature.title }}
            </TypographyHeading>

            <!-- Description -->
            <TypographyText class="mb-3 block text-center text-xs text-gray-600 sm:text-sm sm:mb-4">
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
import { RouterLink } from 'vue-router'

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

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .app-container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Ensure images maintain aspect ratio */
img {
  max-width: 100%;
  height: auto;
}

/* Better touch targets for mobile */
@media (max-width: 768px) {
  a {
    min-height: 44px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

/* Prevent content from being too wide on large screens */
@media (min-width: 1536px) {
  .app-container {
    max-width: 1280px;
  }
}

/* Smooth transitions */
a, div[class*="hover:shadow"] {
  transition: all 0.3s ease;
}

/* Remove default link styles */
a {
  text-decoration: none;
  color: inherit;
}

/* Improve card hover states */
a:hover {
  transform: translateY(-4px);
}

/* Make sure RouterLink cards look clickable */
a[href] {
  cursor: pointer;
}
</style>