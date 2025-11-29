<template>
  <div class="min-h-screen bg-[#F8FAFC]">
    
    <!-- Main Content Area with Layout Grid -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div class="flex flex-col  lg:space-x-12">
        <!-- LEFT COLUMN: Hero, Specialist Cards, Security/Pricing (Approx. 70%) -->
        <div class="lg:w-[70%] space-y-12 md:space-y-16">
          <!-- 2. Hero Section -->
          <section>
            <TypographyHeading
              level="h1"
              class="text-2xl sm:text-3xl font-bold text-[#3F1A0F] mb-4 leading-tight max-w-[710px]"
            >
              Expert Assistance for Your Legal & Compliance Monitoring
            </TypographyHeading>
            <TypographyText class="text-lg text-gray-600">
              Connect with verified specialists who understand compliance. Whether you need document
              analysis, risk assessment, or ongoing monitoring support, our network of experts is
              ready to help your business stay compliant and secure.
            </TypographyText>
          </section>

          <!-- 3. What Specialists Do (4 Cards) -->
          <section>
            <TypographyHeading
              level="h2"
              class="text-2xl font-bold text-[#401903] mb-6 border-b-2 border-transparent"
            >
              What Specialists Do
            </TypographyHeading>
            <div class="grid grid-cols-1">
              <div v-for="task in specialistTasks" :key="task.title" class="px-6  py-3  ">
                <TypographyHeading level="h3" class="text-xl font-bold text-[#401903] mb-2">
                  {{ task.title }}
                </TypographyHeading>
                <TypographyText class="text-base text-gray-600">
                  {{ task.description }}
                </TypographyText>
              </div>
            </div>
          </section>
            <section class=" p-6 ">
            <TypographyHeading level="h2" class="text-2xl font-bold text-[#401903] mb-6">
              How It Works
            </TypographyHeading>
            
            <div class="space-y-6">
              <div v-for="(step, index) in howItWorksSteps" :key="index" class="flex items-start space-x-4">
                <!-- Numbered Circle -->
                <div class="shrink-0 w-8 h-8 rounded-full bg-[#401903] flex items-center justify-center text-white font-bold text-sm">
                  {{ index + 1 }}
                </div>
                <!-- Step Title -->
                <TypographyText class="text-base font-semibold text-gray-900 mt-1">
                  {{ step }}
                </TypographyText>
              </div>
            </div>
          </section>
          
          <!-- 5. Security & Pricing (Bottom Section - Left Side) -->
          <section class="space-y-10">
            <!-- Security & Privacy -->
            <div>
              <TypographyHeading level="h2" class="text-2xl font-bold text-[#401903] mb-4">
                Security & Privacy
              </TypographyHeading>
              <ul class="space-y-3 text-gray-700">
                <li class="flex items-start">
                  <span class="mr-2 text-[#401903] font-extrabold text-lg">•</span>
                  <TypographyText class="text-base">
                    End-to-end encrypted data transmission at all times
                  </TypographyText>
                </li>
                <li class="flex items-start">
                  <span class="mr-2 text-[#401903] font-extrabold text-lg">•</span>
                  <TypographyText class="text-base">
                    Confidential information protected
                  </TypographyText>
                </li>
              </ul>
            </div>

            <div>
              <TypographyHeading level="h2" class="text-2xl font-bold text-[#401903] mb-4">
                Transparent Pricing
              </TypographyHeading>
              <TypographyText class="text-base text-gray-700">
                Pay only for the services you need. Pricing is based on task complexity and specialist
                expertise. No hidden fees.
              </TypographyText>
            </div>
          </section>
        </div>
        <div class=" flex flex-col items-center sm:items-end py-4">
            <button class="bg-[#401903] rounded-[8px] text-center p-4 text-white capitalize cursor-pointer">
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
    description: 'Expert review and analysis of legal documents, contracts, and regulatory filings to ensure compliance.',
  },
  {
    title: 'Risk Assessment',
    description: 'Comprehensive evaluation of potential legal and compliance risks specific to your industry.',
  },
  {
    title: 'Watchdog Task Management',
    description: 'Ongoing monitoring of regulatory changes and proactive management of compliance requirements.',
  },
  {
    title: 'Report Preparation',
    description: 'Professional preparation of compliance reports, audit documentation, and regulatory submissions.',
  },
]

const howItWorksSteps = [
  'Submit a Request',
  'We Match a Specialist',
  'Specialist Works on Your Task',
  'Delivery & Review',
]
</script>