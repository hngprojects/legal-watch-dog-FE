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
  organization_email: ''
})

const earlyAccessErrors = reactive({
  organization_name: '',
  organization_email: ''
})

const isSubmitting = ref(false)
const feedback = ref<{ type: 'success' | 'error'; message: string } | null>(null)


const handleSubmit = async () => {
  if (isSubmitting.value) return

  feedback.value = null
  formErrors.organization_name = ''
  formErrors.organization_email = ''

  if (!form.organization_name.trim()) {
    formErrors.organization_name = "Organization name is required"
  }

  if (!form.organization_email.trim()) {
    formErrors.organization_email = "Work email is required"
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

  } catch (error: any) {
    feedback.value = {
      type: 'error',
      message: error.message || 'Please try again shortly.',
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
    earlyAccessErrors.organization_name = "Organization name is required"
  }

  if (!earlyAccessForm.organization_email.trim()) {
    earlyAccessErrors.organization_email = "Work email is required"
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

  } catch (error: any) {
    feedback.value = {
      type: 'error',
      message: error.message || "Unable to submit right now.",
    }
  } finally {
    isSubmitting.value = false
  }
}


const features = [
  { icon: '🔔', title: 'Automated Monitoring', description: 'Continuous scanning of government and legal websites for regulatory changes' },
  { icon: '📄', title: 'AI Summaries', description: 'Intelligent summarization that extracts key points and impact analysis' },
  { icon: '✓', title: 'Confidence Scoring', description: 'ML-powered confidence metrics to prioritize critical updates' },
  { icon: '🌍', title: 'Multi-Jurisdiction', description: 'Track regulations across multiple regions and government bodies' }
]

const activeProjects = [
  { name: 'UK Student Visas', status: 'High', color: 'bg-red-100 text-red-700' },
  { name: 'EU Privacy Laws', status: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'US Employment', status: 'Low', color: 'bg-green-100 text-green-700' },
  { name: 'Data Location', status: 'High', color: 'bg-red-100 text-red-700' }
]

const recentUpdates = [
  { title: 'Global Worker threshold updated', confidence: '98%' },
  { title: 'Policy revisions detected', confidence: '95%' },
  { title: 'Processing times changed', confidence: '89%' },
  { title: 'Fee structure modified', confidence: '92%' }
]

const jurisdictions = [
  { country: 'United Kingdom', time: '5 seconds' },
  { country: 'European Union', time: '12 seconds' },
  { country: 'United States', time: '4 seconds' },
  { country: 'Australia', time: '4 seconds' }
]

const testimonials = [
  { quote: "LegalWatchDog has transformed how we monitor compliance. Real-time updates mean we're never caught off guard.", name: "Sarah Chen", role: "Legal Operations Director" },
  { quote: "The confidence scoring helps us prioritize critical updates without getting overwhelmed by noise.", name: "Michael Torres", role: "Compliance Manager" },
  { quote: "Multi-jurisdiction tracking in one place is exactly what our global team needed.", name: "Emma Watson", role: "Regulatory Affairs Head" }
]

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('')
}
</script>


<template>
  <div class="min-h-screen bg-linear-to-b from-[#FAF7F4] to-[#F5F1EC]">

    <!-- HERO SECTION -->
    <section class="pt-12 pb-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto text-center">

        <Badge variant="secondary"
          class="text-[#3a1f14] border border-gray-200 bg-white px-6 py-1.5 text-sm font-semibold shadow-sm mb-8">
          Join the Waitlist
        </Badge>

        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Stay Ahead of Legal Changes <br /> Without the Weekly Stress
        </h1>

        <p class="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
          LegalWatchDog tracks government updates, policy shifts, and regulatory changes for you.
          Get clear summaries, real-time alerts, and complete visibility across all your jurisdictions.
        </p>

        <!-- TOP FORM -->
        <div class="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-2">

          <!-- Name Input -->
          <div class="flex-1">
            <Input
              v-model="form.organization_name"
              type="text"
              placeholder="Organization / Company Name"
              class="w-full px-4 py-3"
            />
            <p v-if="formErrors.organization_name" class="text-red-600 text-xs mt-1">
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
            <p v-if="formErrors.organization_email" class="text-red-600 text-xs mt-1">
              {{ formErrors.organization_email }}
            </p>
          </div>

          <!-- Submit Button -->
          <Button
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="px-6 py-3 bg-[#3a1f14] text-white hover:bg-[#2d1810] whitespace-nowrap flex items-center gap-2"
          >
            <span v-if="!isSubmitting">Join the Waitlist</span>
            <span v-else>Submitting...</span>
          </Button>
        </div>

        <!-- Global feedback -->
        <p v-if="feedback" class="text-sm mb-4"
          :class="feedback.type === 'success' ? 'text-green-600' : 'text-red-600'">
          {{ feedback.message }}
        </p>

        <!-- Dashboard Mockup -->
        <div class="mt-12 max-w-4xl mx-auto">
          <div class="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div class="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
              <div class="flex gap-1.5">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div class="ml-4 flex-1 bg-white rounded px-3 py-1 text-xs text-gray-500">
                Dashboard
              </div>
            </div>
            <img src="/images/dashboard-preview.png" alt="Dashboard Preview" class="w-full" />
          </div>
        </div>
      </div>
    </section>


    <!-- FEATURES -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
      <div class="max-w-6xl mx-auto text-center">
        <h2 class="text-3xl sm:text-4xl font-bold mb-4">
          Intelligent <span class="text-[#F59E0B]">Legal</span> Monitoring
        </h2>
        <p class="text-gray-600 mb-12">
          Automated tracking, AI-powered analysis, and actionable insights for compliance professionals
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            v-for="(feature, idx) in features"
            :key="idx"
            class="bg-white p-6 shadow-sm hover:shadow-md transition text-center border-0"
          >
            <div class="w-14 h-14 bg-[#F59E0B] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
              {{ feature.icon }}
            </div>
            <h3 class="font-bold text-lg mb-2 text-gray-900">{{ feature.title }}</h3>
            <p class="text-sm text-gray-600">{{ feature.description }}</p>
          </Card>
        </div>
      </div>
    </section>

    <!-- FOOTER EARLY ACCESS -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-[#3a1f14] relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-64 h-64 border-4 border-white rounded-full"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 border-4 border-white rounded-full"></div>
      </div>

      <div class="max-w-xl mx-auto text-center relative z-10">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
          Get Early Access
        </h2>
        <p class="text-white/80 mb-8">
          Join legal and compliance professionals who are transforming how they monitor regulatory changes
        </p>

        <Card class="bg-white rounded-xl p-6 shadow-xl">

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

            <!-- Footer Name Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 text-left">
                Organization Name
              </label>
              <Input
                v-model="earlyAccessForm.organization_name"
                type="text"
                placeholder="Company / Organization"
                class="w-full"
              />
              <p v-if="earlyAccessErrors.organization_name" class="text-red-600 text-xs mt-1">
                {{ earlyAccessErrors.organization_name }}
              </p>
            </div>

            <!-- Footer Email Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 text-left">
                Work Email
              </label>
              <Input
                v-model="earlyAccessForm.organization_email"
                type="email"
                placeholder="name@company.com"
                class="w-full"
              />
              <p v-if="earlyAccessErrors.organization_email" class="text-red-600 text-xs mt-1">
                {{ earlyAccessErrors.organization_email }}
              </p>
            </div>

          </div>

          <!-- Footer Button -->
          <Button
            @click="handleEarlyAccessSubmit"
            :disabled="isSubmitting"
            class="w-full px-6 py-3 bg-[#3a1f14] text-white hover:bg-[#2d1810] flex items-center justify-center gap-2"
          >
            <span v-if="!isSubmitting">Join the Waitlist →</span>
            <span v-else>Submitting...</span>
          </Button>
           <p v-if="feedback" class="text-sm mb-4"
          :class="feedback.type === 'success' ? 'text-green-600' : 'text-red-600'">
          {{ feedback.message }}
        </p>

          <p class="text-xs text-gray-500 mt-4">
            We respect your privacy. No spam, unsubscribe anytime.
          </p>
        </Card>

      </div>
    </section>


    <!-- TESTIMONIALS / REMAINING CONTENT -->
    <!-- (everything else stays the same) -->

  </div>
</template>
