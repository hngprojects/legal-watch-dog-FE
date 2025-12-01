<template>
  <div class="terms-page flex min-h-screen flex-col bg-white">
    <main class="grow bg-[#F8FAFC]">
      <div class="mx-auto max-w-4xl px-6 py-20 lg:px-8">
        <div class="mb-12 text-center">
          <TypographyHeading
            level="h1"
            class="mb-2 text-4xl font-extrabold text-gray-900 md:text-5xl"
          >
            Terms and Conditions
          </TypographyHeading>
          <TypographyText class="text-sm text-gray-500">
            Last updated 25th November, 2025
          </TypographyText>
        </div>

        <div class="border border-gray-100 p-8 md:p-12">
          <TypographyText class="mb-8 text-base leading-relaxed text-gray-700">
            Welcome to Legal Watch Dog Terms and Conditions. Please review these terms and
            conditions carefully. These terms govern your use of our website, web application and
            related services. By accessing or using our services, you agree to comply with these
            terms. Please note that if you do not agree, please discontinue use immediately. By
            continuing to use Legal WatchDog, you are consenting to this policy.
          </TypographyText>

          <section v-for="(section, index) in termsContent" :key="index" class="mb-8">
            <TypographyHeading level="h2" class="mb-4 text-lg font-bold text-[#5D2D18]">
              {{ section.id }}. {{ section.title }}
            </TypographyHeading>

            <TypographyText v-if="section.preamble" class="mb-3 block text-base text-gray-700">
              {{ section.preamble }}
            </TypographyText>

            <ul class="list-none space-y-2 pl-4 text-base text-gray-700">
              <li
                v-for="(item, i) in section.items"
                :key="i"
                class="relative before:absolute before:-left-4 before:font-bold before:text-[#5D2D18] before:content-['•']"
              >
                {{ item }}
              </li>
            </ul>

            <TypographyText v-if="section.note" class="mt-4 block text-base text-gray-700 italic">
              {{ section.note }}
            </TypographyText>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { TypographyHeading, TypographyText } from '../ui/typography'

const termsContent = [
  {
    id: 'A.',
    title: 'Accepting Terms and Conditions',
    preamble:
      'By accessing, browsing, or using the Platform, or using any of our features, you confirm that:',
    items: [
      'You are at least 18 years old or have legal permission',
      'You have read and understood these Terms.',
      'You have the authority to accept these terms on behalf of yourself or your organization.',
    ],
    note: null,
  },
  {
    id: 'B.',
    title: 'Description of Service',
    preamble: 'The platform offers the following services:',
    items: [
      'Monitoring legal, compliance, and policy changes across selected sources.',
      'Managing and tracking multiple sources and jurisdictions.',
      'Sending notifications or alerts when changes occur.',
      'Providing data insights on tracked regulation.',
    ],
    note: 'We update or improve our services periodically.',
  },
  {
    id: 'C.',
    title: 'User Responsibilities',
    preamble: 'You agree to:',
    items: [
      'Use the platform in compliance with applicable laws and regulations.',
      'Maintain the confidentiality and security of your login credentials.',
      'You are responsible for all activity under your account.',
    ],
    note: null,
  },
  {
    id: 'D.',
    title: 'Data, Content & AI-generated Outputs',
    preamble: null,
    items: [
      'AI outputs may contain errors or omissions.',
      'You are responsible for independently verifying any critical legal information.',
      'Outputs are for informational purposes only.',
    ],
    note: null,
  },
  {
    id: 'E.',
    title: 'Source Scraping & Monitoring',
    preamble: null,
    items: [
      'Some external sites may prohibit or prevent scraping of their content.',
      'Scraping frequency is based on the site architecture.',
    ],
    note: 'We do not guarantee 100% data accuracy or availability.',
  },
]
</script>
