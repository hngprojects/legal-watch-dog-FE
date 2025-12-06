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
              Expert Assistance for Your & Compliance Monitoring
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
            @click="openHireSpecialistModal"
            class="cursor-pointer rounded-[8px] bg-[#401903] px-8 py-4 text-center text-lg font-medium text-white capitalize shadow-md transition-all hover:bg-[#301403] hover:shadow-lg"
          >
            Hire a Specialist
          </button>
        </div>
      </div>
    </div>
    <Dialog
      :open="showHireSpecialistModal"
      @update:open="(value) => !value && closeHireSpecialistModal()"
    >
      <DialogScrollContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Hire a Specialist</DialogTitle>
        </DialogHeader>

        <form @submit.prevent="submitHireForm" class="space-y-6">
          <div>
            <label for="companyName" class="mb-2 block text-sm font-semibold text-gray-900">
              Company Name
            </label>
            <input
              placeholder="United UI"
              id="companyName"
              type="text"
              required
              class="w-full rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-4 py-3 text-sm text-gray-900 placeholder-[#6B7280] transition-colors focus:border-blue-500 focus:ring-0"
            />
          </div>

          <div>
            <label for="companyEmail" class="mb-2 block text-sm font-semibold text-gray-900">
              Company Email Address
            </label>
            <input
              placeholder="olivia@untitledui.com"
              type="email"
              required
              class="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm text-gray-900 placeholder-[#6B7280] transition-colors focus:border-blue-500 focus:ring-0"
            />
          </div>

          <div>
            <label for="industry" class="mb-2 block text-sm font-semibold text-gray-900">
              Industry
            </label>
            <div class="relative">
              <select
                id="industry"
                class="w-full cursor-pointer appearance-none rounded-xl border border-blue-500 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-blue-700 focus:ring-0"
              >
                <option value="Immigration & Global Mobility">Immigration & Global Mobility</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
              </select>
              <ChevronDown
                :size="16"
                class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 transform text-gray-500"
              />
            </div>
          </div>

          <div>
            <label for="description" class="mb-2 block text-sm font-semibold text-gray-900">
              Brief Description
            </label>
            <textarea
              placeholder="Monitor changes to EU travel rules, visa requirements, entry conditions, and policy updates across all Schengen and EU member states"
              id="description"
              rows="3"
              required
              class="h-24 w-full resize-none rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm text-gray-900 placeholder-[#6B7280] transition-colors focus:border-blue-500 focus:ring-0"
            />
          </div>

          <DialogFooter class="flex justify-end gap-2 pt-4">
            <button type="button" @click="closeHireSpecialistModal" class="btn--secondary btn--lg">
              Cancel
            </button>
            <button type="submit" class="btn--default btn--lg">Hire Specialist</button>
          </DialogFooter>
        </form>
      </DialogScrollContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TypographyHeading, TypographyText } from '../ui/typography'
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogScrollContent,
  DialogFooter,
} from '@/components/ui/dialog'
import { ChevronDown } from 'lucide-vue-next'
import Swal from '@/lib/swal'

// Modal state
const showHireSpecialistModal = ref(false)

const openHireSpecialistModal = () => {
  showHireSpecialistModal.value = true
}

const closeHireSpecialistModal = () => {
  showHireSpecialistModal.value = false
}

const submitHireForm = async () => {
  closeHireSpecialistModal()
  await Swal.fire('Request Submitted', 'Your specialist request is being reviewed.', 'success')
}

const specialistTasks = [
  {
    title: 'Document Analysis',
    description:
      'Expert review and analysis of documents, contracts, and regulatory filings to ensure compliance.',
  },
  {
    title: 'Risk Assessment',
    description:
      'Comprehensive evaluation of potential and compliance risks specific to your industry.',
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
