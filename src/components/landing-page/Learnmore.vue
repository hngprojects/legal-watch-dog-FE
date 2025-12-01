<template>
  <div class="min-h-screen bg-[#F8FAFC]">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
      <div class="flex flex-col lg:space-x-12">
        <div class="space-y-12 md:space-y-16 lg:w-[70%]">
          <section>
            <TypographyHeading
              level="h1"
              class="mb-4 max-w-[710px] text-2xl leading-tight font-bold text-[#3F1A0F] sm:text-3xl"
            >
              Expert Assistance for Your Legal & Compliance Monitoring
            </TypographyHeading>
            <TypographyText class="text-lg text-gray-600">
              Connect with verified specialists who understand compliance. Whether you need document
              analysis, risk assessment, or ongoing monitoring support, our network of experts is
              ready to help your business stay compliant and secure.
            </TypographyText>
          </section>

          <section>
            <TypographyHeading
              level="h2"
              class="mb-6 border-b-2 border-transparent text-2xl font-bold text-[#401903]"
            >
              What Specialists Do
            </TypographyHeading>
            <div class="grid grid-cols-1">
              <div v-for="task in specialistTasks" :key="task.title" class="px-6 py-3">
                <TypographyHeading level="h3" class="mb-2 text-xl font-bold text-[#401903]">
                  {{ task.title }}
                </TypographyHeading>
                <TypographyText class="text-base text-gray-600">
                  {{ task.description }}
                </TypographyText>
              </div>
            </div>
          </section>
          <section class="p-6">
            <TypographyHeading level="h2" class="mb-6 text-2xl font-bold text-[#401903]">
              How It Works
            </TypographyHeading>

            <div class="space-y-6">
              <div
                v-for="(step, index) in howItWorksSteps"
                :key="index"
                class="flex items-start space-x-4"
              >
                <div
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#401903] text-sm font-bold text-white"
                >
                  {{ index + 1 }}
                </div>
                <!-- Step Title -->
                <TypographyText class="mt-1 text-base font-semibold text-gray-900">
                  {{ step }}
                </TypographyText>
              </div>
            </div>
          </section>

          <section class="space-y-10">
            <div>
              <TypographyHeading level="h2" class="mb-4 text-2xl font-bold text-[#401903]">
                Security & Privacy
              </TypographyHeading>
              <ul class="space-y-3 text-gray-700">
                <li class="flex items-start">
                  <span class="mr-2 text-lg font-extrabold text-[#401903]">•</span>
                  <TypographyText class="text-base">
                    End-to-end encrypted data transmission at all times
                  </TypographyText>
                </li>
                <li class="flex items-start">
                  <span class="mr-2 text-lg font-extrabold text-[#401903]">•</span>
                  <TypographyText class="text-base">
                    Confidential information protected
                  </TypographyText>
                </li>
              </ul>
            </div>

            <div>
              <TypographyHeading level="h2" class="mb-4 text-2xl font-bold text-[#401903]">
                Transparent Pricing
              </TypographyHeading>
              <TypographyText class="text-base text-gray-700">
                Pay only for the services you need. Pricing is based on task complexity and
                specialist expertise. No hidden fees.
              </TypographyText>
            </div>
          </section>
        </div>
        <div class="flex flex-col items-center py-4 sm:items-end">
          <button
            class="cursor-pointer rounded-[8px] bg-[#401903] p-4 text-center text-white capitalize"
          >
            hire a specialist
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TypographyHeading, TypographyText } from '../ui/typography'
const specialistTasks = [
  {
    title: 'Document Analysis',
    description:
      'Expert review and analysis of legal documents, contracts, and regulatory filings to ensure compliance.',
  },
  {
    title: 'Risk Assessment',
    description:
      'Comprehensive evaluation of potential legal and compliance risks specific to your industry.',
  },
  {
    title: 'Watchdog Task Management',
    description:
      'Ongoing monitoring of regulatory changes and proactive management of compliance requirements.',
  },
  {
    title: 'Report Preparation',
    description:
      'Professional preparation of compliance reports, audit documentation, and regulatory submissions.',
  },
]

const howItWorksSteps = [
  'Submit a Request',
  'We Match a Specialist',
  'Specialist Works on Your Task',
  'Delivery & Review',
]
</script>
