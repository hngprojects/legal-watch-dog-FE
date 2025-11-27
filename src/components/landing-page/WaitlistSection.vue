<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { submitWaitlist, type WaitlistPayload, type earlyAccessPayload } from '@/api/waitlist'
import EmailIcon from '@/assets/icons/sms.svg'
import BellIcon from '@/assets/icons/bell2.svg'
import BrainIcon from '@/assets/icons/brain.svg'
import CheckedIcon from '@/assets/icons/checked.svg'
import GlobeIcon from '@/assets/icons/globe.svg'
import GlobeIcon2 from '@/assets/icons/globe2.svg'
// import BackLeft from '@/assets/Images/backleft.png'
// import BackRight from '@/assets/Images/backright.png'
import earlyAccessBg from '@/assets/Images/earlyAccess-bg.png'

// Top Waitlist Form
const form = reactive<WaitlistPayload>({
  organization_email: '',
})

// Footer Early Access Form
const earlyAccessForm = reactive<earlyAccessPayload>({
  organization_name: '',
  organization_email: '',
})

// Inline error states
const formErrors = reactive({
  organization_email: '',
})

const earlyAccessErrors = reactive({
  organization_name: '',
  organization_email: '',
})

const isSubmitting = ref(false)
const feedback = ref<{ type: 'success' | 'error'; message: string } | null>(null)

const handleSubmit = async () => {
  if (isSubmitting.value) return

  feedback.value = null
  formErrors.organization_email = ''

  if (!form.organization_email.trim()) {
    formErrors.organization_email = 'Work email is required'
  }

  if (formErrors.organization_email) return

  isSubmitting.value = true

  try {
    const response = await submitWaitlist({ ...form })

    feedback.value = {
      type: 'success',
      message: response.message ?? 'You are on the waitlist!',
    }

    form.organization_email = ''
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Please try again shortly.'
    feedback.value = {
      type: 'error',
      message: errorMessage,
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleEarlyAccessSubmit = async () => {
  if (isSubmitting.value) return

  feedback.value = null
  earlyAccessErrors.organization_name = ''
  earlyAccessErrors.organization_email = ''

  if (!earlyAccessForm.organization_name.trim()) {
    earlyAccessErrors.organization_name = 'Organization name is required'
  }

  if (!earlyAccessForm.organization_email.trim()) {
    earlyAccessErrors.organization_email = 'Work email is required'
  }

  if (earlyAccessErrors.organization_name || earlyAccessErrors.organization_email) return

  isSubmitting.value = true

  try {
    const response = await submitWaitlist({ ...earlyAccessForm })

    feedback.value = {
      type: 'success',
      message: response.message ?? "You're on the waitlist!",
    }

    earlyAccessForm.organization_name = ''
    earlyAccessForm.organization_email = ''
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unable to submit right now.'
    feedback.value = {
      type: 'error',
      message: errorMessage,
    }
  } finally {
    isSubmitting.value = false
  }
}

const features = [
  {
    icon: BellIcon,
    title: 'Automated Monitoring',
    description: 'Continuous scanning of government and legal websites for regulatory changes',
  },
  {
    icon: BrainIcon,
    title: 'AI Summaries',
    description: 'Intelligent summarization that extracts key points and impact analysis',
  },
  {
    icon: CheckedIcon,
    title: 'Confidence Scoring',
    description: 'ML-powered confidence metrics to prioritize critical updates',
  },
  {
    icon: GlobeIcon,
    title: 'Multi-Jurisdiction',
    description: 'Track regulations across multiple regions and government bodies',
  },
]

const getPriorityClasses = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'bg-[#FEE2E2] text-[#991B1B]'
    case 'medium':
      return 'bg-[#FEF3C7] text-[#92400E]'
    case 'low':
      return 'bg-[#D1FAE5] text-[#065F46]'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const activeProjects = [
  { projects: 'UK Students Visa', priority: 'High' },
  { projects: 'EU Privacy Laws', priority: 'Medium' },
  { projects: 'US Employment', priority: 'Low' },
  { projects: 'Nigeria Custom', priority: 'Low' },
]

const recentUpdates = [
  { update: 'Skilled Worker threshold updated', time: '2h ago', value: '98%' },
  { update: 'Policy revisions detected', time: '5h ago', value: '85%' },
  { update: 'Processing times changed', time: '8h ago', value: '92%' },
]

const jurisdictions = [
  { name: 'United Kingdom', sources: '5 sources' },
  { name: 'European Union', sources: '12 sources' },
  { name: 'United States', sources: '8 sources' },
  { name: 'Australia', sources: '4 sources' },
]

const testimonials = [
  {
    quote:
      'LegalWatch Dog has transformed how we stay on top of regulatory changes. The AI summaries save us hours every week.',
    name: 'Sarah Chen',
    title: 'Compliance Director',
    initials: 'SC',
  },
  {
    quote:
      "The confidence scoring helps us prioritize what matters. We've never missed a critical update since switching.",
    name: 'Michael Torres',
    title: 'Legal Operations Manager',
    initials: 'MT',
  },
  {
    quote:
      'Multi-jurisdiction tracking in one place is a game-changer. Clean interface, powerful features.',
    name: 'Emma Watson',
    title: 'Head of Regulatory Affairs',
    initials: 'EW',
  },
]
</script>

<template>
  <div class="relative flex min-h-screen flex-col gap-35 overflow-hidden bg-[#FAFAFA]">
    <!-- Gradient Background -->
    <!-- <div
      class="pointer-events-none absolute top-0 left-1/2 z-0 h-[800px] w-[1600px] -translate-x-1/2 -translate-y-[60%] rounded-[50%]"
      style="
        background: radial-gradient(
          ellipse,
          #f8d9c5 0%,
          rgba(248, 217, 197, 0.5) 40%,
          rgba(250, 250, 250, 0.8) 70%,
          #fafafa 100%
        );
      "
    ></div> -->

    <!-- HERO SECTION -->
    <section class="relative z-10 px-4 pt-12 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-5xl text-center">
        <Badge
          variant="secondary"
          class="mb-8 border-0 bg-white! px-6 py-3 text-sm font-semibold text-gray-600! shadow-sm"
        >
          Join the Waitlist
        </Badge>

        <h1 class="mb-6 text-5xl leading-tight font-bold text-[#1F1F1F] sm:text-6xl lg:text-[64px]">
          Stay Ahead of Legal Changes<br />
          Without the Weekly Stress
        </h1>

        <p class="mx-auto mb-12 max-w-3xl text-lg text-gray-600">
          LegalWatchDog tracks government updates, policy shifts, and regulatory changes for you.
          Get clear summaries, real-time alerts, and complete visibility across all your
          jurisdictions.
        </p>

        <!-- TOP FORM -->
         <div class="mx-auto mb-2 flex h-12 max-w-[496px] max-sm:flex-col justify-center max-sm:gap-3">
          <!-- Email Input -->
          <div class="relative w-full">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <img :src="EmailIcon" class="h-5 w-5" alt="email" />
            </div>
            <Input
              v-model="form.organization_email"
              type="email"
              placeholder="Enter Email"
              class="h-full w-full rounded-l-md border-[#AEB4C2] bg-white! px-4 py-3 pl-10"
            />
            <p v-if="formErrors.organization_email" class="mt-1 text-left text-xs text-red-600">
              {{ formErrors.organization_email }}
            </p>
          </div>

          <!-- Submit Button -->
          <Button
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="flex h-full items-center gap-2 rounded-l-none bg-[#3a1f14] px-6 py-3 whitespace-nowrap text-white hover:bg-[#2d1810]"
          >
            <span v-if="!isSubmitting">Join the Waitlist</span>
            <span v-else>Submitting...</span>
          </Button>
        </div>

        <!-- Global feedback -->
        <p
          v-if="feedback"
          class="mb-4 text-sm"
          :class="feedback.type === 'success' ? 'text-green-600' : 'text-red-600'"
        >
          {{ feedback.message }}
        </p>

        <!-- Dashboard Mockup -->
        <div class="mx-auto mt-24 max-w-5xl">
          <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
            <div class="flex items-center gap-2 border-b border-gray-200 bg-[#F5F5F5] px-4 py-3">
              <div class="flex gap-2">
                <div class="h-3 w-3 rounded-full bg-[#FF5F57]"></div>
                <div class="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
                <div class="h-3 w-3 rounded-full bg-[#28CA42]"></div>
              </div>
              <div class="ml-4 flex-1 rounded-md bg-white px-4 py-1.5 text-xs text-gray-500">
                Dashboard
              </div>
            </div>
            <img
              src="/images/waitlist-dashboard-preview.png"
              alt="Dashboard Preview"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="relative px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl text-center">
        <h2 class="mb-4 text-4xl font-bold text-[#1F1F1F] sm:text-5xl">
          Intelligent <span class="text-[#F2AB6D]">Legal</span> Monitoring
        </h2>
        <p class="mx-auto mb-16 max-w-2xl text-base text-[#6B7280]">
          Automated tracking, AI-powered analysis, and actionable insights for compliance
          professionals
        </p>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            v-for="(feature, idx) in features"
            :key="idx"
            class="rounded-2xl border-0 gap-6 bg-white px-6 pt-8 pb-11.5 text-left transition hover:shadow-md"
          >
            <!-- <div
              class="flex h-14 w-14 items-center justify-center rounded-full bg-[#FCEBD8] text-2xl text-white"
            >
              <img :src="feature.icon" alt="" />
          </div> -->
            <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FEF3E2]">
              <img :src="feature.icon" alt="" class="h-6 w-6" />
            </div>
            <!-- <h3 class="mb-2 text-lg font-bold text-[#1F1F1F]">{{ feature.title }}</h3>
            <p class="text-sm leading-relaxed text-[#6B7280]">{{ feature.description }}</p> -->
             <div class="flex flex-col gap-2 text-left">
              <h3 class="text-lg font-bold text-gray-900">{{ feature.title }}</h3>
              <p class="text-sm text-gray-600">{{ feature.description }}</p>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <!-- PROJECTS, RECENT UPDATES AND JURISDICTION  -->
    <section class="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl text-center">
        <h2 class="mb-4 text-4xl font-bold text-[#1F1F1F] sm:text-5xl">
          Powerful <span class="text-[#F2AB6D]">Dashboard,</span> Simple
          <span class="text-[#F2AB6D]">Interface</span>
        </h2>
        <p class="mx-auto mb-16 max-w-2xl text-base text-[#6B7280]">
          Everything you need to stay compliant in one clean, intuitive platform
        </p>
        <div class="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-3">
           <!-- Active Projects -->
          <div class="rounded-md bg-white p-6 text-left shadow-sm transition hover:shadow-md">
            <div class="mb-6 flex items-center justify-between">
              <h4 class="text-lg font-bold">Active Projects</h4>
              <p class="text-sm text-[#6a7282]">{{ activeProjects.length }} total</p>
            </div>
            <div class="flex flex-col gap-3">
              <div
                v-for="(project, idx) in activeProjects"
                :key="idx"
                class="flex flex-row items-center justify-between rounded-md border-0 bg-[#F9FAFB] p-4 transition"
              >
                <h3 class="text-sm font-medium text-[#1F1F1F]">{{ project.projects }}</h3>
                <span
                  :class="getPriorityClasses(project.priority)"
                  class="rounded-[4px] px-2 py-1 text-xs font-medium"
                >
                  {{ project.priority }}
                </span>
              </div>
            </div>
          </div>

          <!-- Recent Updates -->
          <div class="rounded-md bg-white p-6 text-left shadow-sm transition hover:shadow-md">
            <div class="mb-6 flex items-center justify-between">
              <h4 class="text-lg font-bold">Recent Updates</h4>
              <p class="text-sm text-[#6a7282]">Today</p>
            </div>
            <div class="flex flex-col gap-4">
              <Card
                v-for="(update, idx) in recentUpdates"
                :key="idx"
                class="flex flex-row items-start justify-between rounded-none border-b border-[#F3F4F6] bg-white p-3 shadow-none transition last-of-type:border-none"
              >
                <div class="flex flex-col gap-1">
                  <h3 class="text-sm font-medium text-[#1F1F1F]">{{ update.update }}</h3>
                  <p class="text-xs text-[#9CA3AF]">{{ update.time }}</p>
                </div>
                <span class="text-sm font-bold text-[#D4AF37]">
                  {{ update.value }}
                </span>
              </Card>
          </div>
          </div>

          <!-- Jurisdictions -->
          <div class="rounded-md bg-white p-6 text-left shadow-sm transition hover:shadow-md">
            <div class="mb-6 flex items-center justify-between">
              <h4 class="text-lg font-bold">Jurisdictions</h4>
              <p class="text-sm text-[#6a7282]">{{ jurisdictions.length }} tracked</p>
            </div>
            <div class="flex flex-col gap-3">
              <Card
                v-for="(jurisdiction, idx) in jurisdictions.slice(0, 4)"
                :key="idx"
                class="flex flex-row items-center justify-between rounded-md border-0 bg-[#F9FAFB] p-3 shadow-none transition"
              >
                <div class="flex items-center gap-3">
                  <div class="flex h-7 w-7 items-center justify-center rounded-full bg-[#F1A75F]">
                    <img :src="GlobeIcon2" alt="globe" />
                  </div>
                  <h3 class="text-sm font-medium text-[#364153]">{{ jurisdiction.name }}</h3>
                </div>
                <p class="text-sm text-gray-500">
                  {{ jurisdiction.sources }}
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <!-- FOOTER EARLY ACCESS -->
      <section
        class="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
        :style="{
          backgroundImage: `url(${earlyAccessBg})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }"
      >
        <!-- <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 h-64 w-64 rounded-full border-4 border-white"></div>
        <div class="absolute right-10 bottom-10 h-96 w-96 rounded-full border-4 border-white"></div>
      </div> -->

        <div class="relative z-10 mx-auto max-w-xl text-center">
          <h2 class="mb-4 text-3xl font-bold text-white sm:text-4xl">Get Early Access</h2>
          <p class="mb-8 text-white/80">
            Join legalg and compliance professionals who are transforming how they monitor
            regulatory changes
          </p>

          <Card class="rounded-xl bg-white p-6 shadow-xl">
            <div class="mb-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <!-- Footer Name Input -->
              <div>
                <label class="mb-1 block text-left text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <Input
                  v-model="earlyAccessForm.organization_name"
                  type="text"
                  placeholder="John Doe"
                  class="w-full rounded-md bg-transparent!"
                />
               <p v-if="earlyAccessErrors.organization_name" class="mt-1 text-xs text-red-600">
                  {{ earlyAccessErrors.organization_name }}
                </p>
              </div>

              <!-- Footer Email Input -->
              <div>
                <label class="mb-1 block text-left text-sm font-medium text-gray-700">
                  Work Email
                </label>
                <Input
                  v-model="earlyAccessForm.organization_email"
                  type="email"
                  placeholder="olivia@untitledui.com"
                  class="w-full rounded-md bg-transparent!"
                />
                <p v-if="earlyAccessErrors.organization_email" class="mt-1 text-xs text-red-600">
                  {{ earlyAccessErrors.organization_email }}
                </p>
              </div>
            </div>


            <!-- Footer Button -->
            <Button
              @click="handleEarlyAccessSubmit"
              :disabled="isSubmitting"
              class="flex w-full items-center justify-center gap-2 bg-[#3a1f14] px-6 py-3 text-white cursor-pointer"
            >
              <span v-if="!isSubmitting">Get Early Access →</span>
              <span v-else>Submitting...</span>
            </Button>
            <p
              v-if="feedback"
              class="mb-4 text-sm"
              :class="feedback.type === 'success' ? 'text-green-600' : 'text-red-600'"
            >
              {{ feedback.message }}
            </p>

            <p class="mt-4 text-xs text-[#9CA3AF]">
              We respect your privacy. No spam, unsubscribe anytime.
            </p>
          </Card>
        </div>
      </section>

    <!-- TESTIMONIALS -->
    <section class="bg-[#F2AB6D] px-4 py-32 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl text-center">
        <h2 class="mb-16 text-4xl font-bold text-[#1F1F1F] sm:text-5xl">
          Trusted by Compliance Professionals
        </h2>
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            v-for="(testimonial, idx) in testimonials"
            :key="idx"
            class="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:shadow-md"
          >
            <div>
              <div class="mb-4 flex items-center gap-1 text-[#FCD34D]">
                <span class="text-lg">⭐</span>
                <span class="text-lg">⭐</span>
                <span class="text-lg">⭐</span>
                <span class="text-lg">⭐</span>
                <span class="text-lg">⭐</span>
              </div>
              <p class="mb-6 text-sm leading-relaxed text-[#6B7280]">"{{ testimonial.quote }}"</p>
            </div>
            <div class="flex items-center gap-3">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold"
                style="background: #3c2610; color: #d4af37"
              >
                {{ testimonial.initials }}
              </div>
              <div>
                <h4 class="text-sm font-bold text-[#1F1F1F]">{{ testimonial.name }}</h4>
                <p class="text-xs text-[#9CA3AF]">{{ testimonial.title }}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
    </section>
  </div>
</template>
