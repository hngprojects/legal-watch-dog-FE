<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { submitWaitlist, type WaitlistPayload } from '@/api/waitlist'

// Top Waitlist Form
const form = reactive<WaitlistPayload>({
  organization_name: '',
  organization_email: '',
})

// Footer Early Access Form
const earlyAccessForm = reactive<WaitlistPayload>({
  organization_name: '',
  organization_email: '',
})

// Inline error states
const formErrors = reactive({
  organization_name: '',
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
  formErrors.organization_name = ''
  formErrors.organization_email = ''

  if (!form.organization_name.trim()) {
    formErrors.organization_name = 'Organization name is required'
  }

  if (!form.organization_email.trim()) {
    formErrors.organization_email = 'Work email is required'
  }

  if (formErrors.organization_name || formErrors.organization_email) return

  isSubmitting.value = true

  try {
    const response = await submitWaitlist({ ...form })

    feedback.value = {
      type: 'success',
      message: response.message ?? 'You are on the waitlist!',
    }

    form.organization_name = ''
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
    icon: '🔔',
    title: 'Automated Monitoring',
    description: 'Continuous scanning of government and legal websites for regulatory changes',
  },
  {
    icon: '📄',
    title: 'AI Summaries',
    description: 'Intelligent summarization that extracts key points and impact analysis',
  },
  {
    icon: '✓',
    title: 'Confidence Scoring',
    description: 'ML-powered confidence metrics to prioritize critical updates',
  },
  {
    icon: '🌍',
    title: 'Multi-Jurisdiction',
    description: 'Track regulations across multiple regions and government bodies',
  },
]
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-[#F7F7F7]">
    <!-- Gradient Background -->
    <div
      class="pointer-events-none absolute top-0 left-1/2 z-0 h-[800px] w-[1600px] -translate-x-1/2 -translate-y-[60%] rounded-[50%]"
      style="
        background: radial-gradient(
          ellipse,
          #f8d9c5 0%,
          rgba(248, 217, 197, 0.5) 40%,
          rgba(247, 247, 247, 0.8) 70%,
          #f7f7f7 100%
        );
      "
    ></div>

    <!-- HERO SECTION -->
    <section class="relative z-10 px-4 pt-12 pb-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-5xl text-center">
        <Badge
          variant="secondary"
          class="mb-8 border border-gray-200 bg-white px-6 py-1.5 text-sm font-semibold text-[#3a1f14] shadow-sm"
        >
          Join the Waitlist
        </Badge>

        <h1 class="mb-6 text-4xl leading-tight font-bold text-gray-900 sm:text-5xl lg:text-6xl">
          Stay Ahead of Legal Changes <br />
          Without the Weekly Stress
        </h1>

        <p class="mx-auto mb-8 max-w-3xl text-lg text-gray-600">
          LegalWatchDog tracks government updates, policy shifts, and regulatory changes for you.
          Get clear summaries, real-time alerts, and complete visibility across all your
          jurisdictions.
        </p>

        <!-- TOP FORM -->
        <div class="mx-auto mb-2 flex max-w-xl flex-col gap-3 sm:flex-row">
          <!-- Name Input -->
          <div class="flex-1">
            <Input
              v-model="form.organization_name"
              type="text"
              placeholder="Organization / Company Name"
              class="w-full px-4 py-3"
            />
            <p v-if="formErrors.organization_name" class="mt-1 text-xs text-red-600">
              {{ formErrors.organization_name }}
            </p>
          </div>

          <!-- Email Input -->
          <div class="flex-1">
            <Input
              v-model="form.organization_email"
              type="email"
              placeholder="Work Email"
              class="w-full px-4 py-3"
            />
            <p v-if="formErrors.organization_email" class="mt-1 text-xs text-red-600">
              {{ formErrors.organization_email }}
            </p>
          </div>

          <!-- Submit Button -->
          <Button
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="flex items-center gap-2 bg-[#3a1f14] px-6 py-3 whitespace-nowrap text-white hover:bg-[#2d1810]"
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
        <div class="mx-auto mt-12 max-w-4xl">
          <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div class="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-4 py-3">
              <div class="flex gap-1.5">
                <div class="h-3 w-3 rounded-full bg-red-500"></div>
                <div class="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div class="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div class="ml-4 flex-1 rounded bg-white px-3 py-1 text-xs text-gray-500">
                Dashboard
              </div>
            </div>
            <img src="/images/dashboard-preview.png" alt="Dashboard Preview" class="w-full" />
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="relative z-10 bg-white/50 px-4 py-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl text-center">
        <h2 class="mb-4 text-3xl font-bold sm:text-4xl">
          Intelligent <span class="text-[#F59E0B]">Legal</span> Monitoring
        </h2>
        <p class="mb-12 text-gray-600">
          Automated tracking, AI-powered analysis, and actionable insights for compliance
          professionals
        </p>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            v-for="(feature, idx) in features"
            :key="idx"
            class="border-0 bg-white p-6 text-center shadow-sm transition hover:shadow-md"
          >
            <div
              class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#F59E0B] text-2xl text-white"
            >
              {{ feature.icon }}
            </div>
            <h3 class="mb-2 text-lg font-bold text-gray-900">{{ feature.title }}</h3>
            <p class="text-sm text-gray-600">{{ feature.description }}</p>
          </Card>
        </div>
      </div>
    </section>

    <!-- FOOTER EARLY ACCESS -->
    <section class="relative z-10 overflow-hidden bg-[#3a1f14] px-4 py-16 sm:px-6 lg:px-8">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 h-64 w-64 rounded-full border-4 border-white"></div>
        <div class="absolute right-10 bottom-10 h-96 w-96 rounded-full border-4 border-white"></div>
      </div>

      <div class="relative z-10 mx-auto max-w-xl text-center">
        <h2 class="mb-4 text-3xl font-bold text-white sm:text-4xl">Get Early Access</h2>
        <p class="mb-8 text-white/80">
          Join legal and compliance professionals who are transforming how they monitor regulatory
          changes
        </p>

        <Card class="rounded-xl bg-white p-6 shadow-xl">
          <div class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <!-- Footer Name Input -->
            <div>
              <label class="mb-1 block text-left text-sm font-medium text-gray-700">
                Organization Name
              </label>
              <Input
                v-model="earlyAccessForm.organization_name"
                type="text"
                placeholder="Company / Organization"
                class="w-full"
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
                placeholder="name@company.com"
                class="w-full"
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
            class="flex w-full items-center justify-center gap-2 bg-[#3a1f14] px-6 py-3 text-white hover:bg-[#2d1810]"
          >
            <span v-if="!isSubmitting">Join the Waitlist →</span>
            <span v-else>Submitting...</span>
          </Button>
          <p
            v-if="feedback"
            class="mb-4 text-sm"
            :class="feedback.type === 'success' ? 'text-green-600' : 'text-red-600'"
          >
            {{ feedback.message }}
          </p>

          <p class="mt-4 text-xs text-gray-500">
            We respect your privacy. No spam, unsubscribe anytime.
          </p>
        </Card>
      </div>
    </section>
  </div>
</template>
