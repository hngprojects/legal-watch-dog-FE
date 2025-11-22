<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { submitWaitlist, type WaitlistPayload } from '@/api/waitlist'

// Waitlist form
const form = reactive<WaitlistPayload>({
  organization_name: '',
  organization_email: '',
})

// Early access form
const earlyAccessForm = reactive({
  fullName: '',
  workEmail: '',
})

const isSubmitting = ref(false)
const feedback = ref<{ type: 'success' | 'error'; message: string } | null>(null)

const handleSubmit = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  feedback.value = null
  try {
    const response = await submitWaitlist({ ...form })
    feedback.value = {
      type: 'success',
      message: response.message ?? 'You are on the waitlist. Check your email soon!',
    }
    form.organization_name = ''
    form.organization_email = ''
  } catch (error) {
    console.error('waitlist submission failed', error)
    feedback.value = {
      type: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Unable to submit right now. Please try again shortly.',
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleEarlyAccessSubmit = () => {
  console.log('Early access submission:', earlyAccessForm)
  feedback.value = { type: 'success', message: 'Request submitted!' }
  earlyAccessForm.fullName = ''
  earlyAccessForm.workEmail = ''
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

const activeProjects = [
  { name: 'UK Student Visas', status: 'High', color: 'bg-red-100 text-red-700' },
  { name: 'EU Privacy Laws', status: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'US Employment', status: 'Low', color: 'bg-green-100 text-green-700' },
  { name: 'Data Location', status: 'High', color: 'bg-red-100 text-red-700' },
]

const recentUpdates = [
  { title: 'Global Worker threshold updated', confidence: '98%' },
  { title: 'Policy revisions detected', confidence: '95%' },
  { title: 'Processing times changed', confidence: '89%' },
  { title: 'Fee structure modified', confidence: '92%' },
]

const jurisdictions = [
  { country: 'United Kingdom', time: '5 seconds' },
  { country: 'European Union', time: '12 seconds' },
  { country: 'United States', time: '4 seconds' },
  { country: 'Australia', time: '4 seconds' },
]

const testimonials = [
  {
    quote:
      "LegalWatchDog has transformed how we monitor compliance. Real-time updates mean we're never caught off guard.",
    name: 'Sarah Chen',
    role: 'Legal Operations Director',
  },
  {
    quote:
      'The confidence scoring helps us prioritize critical updates without getting overwhelmed by noise.',
    name: 'Michael Torres',
    role: 'Compliance Manager',
  },
  {
    quote: 'Multi-jurisdiction tracking in one place is exactly what our global team needed.',
    name: 'Emma Watson',
    role: 'Regulatory Affairs Head',
  },
]

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-[#FAF7F4] to-[#F5F1EC]">
    <!-- Hero Section -->
    <section class="px-4 pt-12 pb-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-5xl text-center">
        <Badge
          variant="secondary"
          class="mb-8 border border-gray-200 bg-white px-6 py-1.5 text-sm font-semibold text-[#3a1f14] shadow-sm"
        >
          Join the Waitlist
        </Badge>

        <h1 class="mb-6 text-4xl leading-tight font-bold text-gray-900 sm:text-5xl lg:text-6xl">
          Stay Ahead of Legal Changes<br />Without the Weekly Stress
        </h1>

        <p class="mx-auto mb-8 max-w-3xl text-lg text-gray-600">
          LegalWatchDog tracks government updates, policy shifts, and regulatory changes for you.
          Get clear summaries, real-time alerts, and complete visibility across all your
          jurisdictions.
        </p>

        <div class="mx-auto mb-2 flex max-w-xl flex-col gap-3 sm:flex-row">
          <Input
            v-model="form.organization_email"
            type="email"
            placeholder="Enter Email"
            required
            class="flex-1 px-4 py-3"
          />
          <Button
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="bg-[#3a1f14] px-6 py-3 whitespace-nowrap text-white hover:bg-[#2d1810]"
          >
            Join the Waitlist
          </Button>
        </div>

        <p
          v-if="feedback"
          class="mb-4 text-sm"
          :class="feedback.type === 'success' ? 'text-green-600' : 'text-red-600'"
        >
          {{ feedback.message }}
        </p>

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

    <!-- Features Section -->
    <section class="bg-white/50 px-4 py-16 sm:px-6 lg:px-8">
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

    <!-- Dashboard Section -->
    <section class="px-4 py-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-4 text-center text-3xl font-bold sm:text-4xl">
          Powerful <span class="text-[#F59E0B]">Dashboard</span>, Simple
          <span class="text-[#F59E0B]">Interface</span>
        </h2>
        <p class="mb-12 text-center text-gray-600">
          Everything you need to stay compliant in one clean, intuitive platform
        </p>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <!-- Active Projects -->
          <Card class="bg-white p-6 shadow-sm">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-bold">Active Projects</h3>
              <span class="text-sm text-gray-500">12 total</span>
            </div>
            <div class="space-y-3">
              <div
                v-for="(project, idx) in activeProjects"
                :key="idx"
                class="flex items-center justify-between py-2"
              >
                <span class="text-sm text-gray-700">{{ project.name }}</span>
                <span :class="`rounded-full px-2 py-1 text-xs font-medium ${project.color}`">
                  {{ project.status }}
                </span>
              </div>
            </div>
          </Card>

          <!-- Recent Updates -->
          <Card class="bg-white p-6 shadow-sm">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-bold">Recent Updates</h3>
              <span class="text-sm text-gray-500">Today</span>
            </div>
            <div class="space-y-3">
              <div
                v-for="(update, idx) in recentUpdates"
                :key="idx"
                class="flex items-center justify-between py-2"
              >
                <span class="text-sm text-gray-700">{{ update.title }}</span>
                <span class="text-xs font-medium text-[#F59E0B]">{{ update.confidence }}</span>
              </div>
            </div>
          </Card>

          <!-- Jurisdictions -->
          <Card class="bg-white p-6 shadow-sm">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-bold">Jurisdictions</h3>
              <span class="text-sm text-gray-500">8 tracked</span>
            </div>
            <div class="space-y-3">
              <div
                v-for="(jurisdiction, idx) in jurisdictions"
                :key="idx"
                class="flex items-center justify-between py-2"
              >
                <div class="flex items-center gap-2">
                  <div class="h-6 w-6 rounded-full bg-[#F59E0B]"></div>
                  <span class="text-sm text-gray-700">{{ jurisdiction.country }}</span>
                </div>
                <span class="text-xs text-gray-500">{{ jurisdiction.time }}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <!-- Early Access Section -->
    <section class="relative overflow-hidden bg-[#3a1f14] px-4 py-16 sm:px-6 lg:px-8">
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
            <div>
              <label class="mb-1 block text-left text-sm font-medium text-gray-700"
                >Full Name</label
              >
              <Input
                v-model="earlyAccessForm.fullName"
                type="text"
                placeholder="John Smith"
                required
                class="w-full"
              />
            </div>
            <div>
              <label class="mb-1 block text-left text-sm font-medium text-gray-700"
                >Work Email</label
              >
              <Input
                v-model="earlyAccessForm.workEmail"
                type="email"
                placeholder="john@company.com"
                required
                class="w-full"
              />
            </div>
          </div>

          <Button
            @click="handleEarlyAccessSubmit"
            class="w-full bg-[#3a1f14] px-6 py-3 text-white hover:bg-[#2d1810]"
          >
            Get Early Access →
          </Button>

          <p class="mt-4 text-xs text-gray-500">
            We respect your privacy. No spam, unsubscribe anytime.
          </p>
        </Card>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="bg-[#FDB863] px-4 py-16 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-6xl">
        <h2 class="mb-12 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
          Trusted by Compliance Professionals
        </h2>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card
            v-for="(testimonial, idx) in testimonials"
            :key="idx"
            class="rounded-xl bg-white p-6 shadow-sm"
          >
            <p class="mb-6 text-gray-700 italic">"{{ testimonial.quote }}"</p>
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-[#3a1f14] font-bold text-white"
              >
                {{ getInitials(testimonial.name) }}
              </div>
              <div>
                <div class="font-bold text-gray-900">{{ testimonial.name }}</div>
                <div class="text-sm text-gray-600">{{ testimonial.role }}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  </div>
</template>
