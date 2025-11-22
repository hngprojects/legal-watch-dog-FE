<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

// Newsletter form
const newsletterEmail = ref('')

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

const handleNewsletterSubmit = () => {
  console.log('Newsletter subscription:', newsletterEmail.value)
  newsletterEmail.value = ''
}

const features = [
  {
    icon: '🔔',
    title: 'Automated Monitoring',
    description: 'Continuous scanning of government and legal websites for regulatory changes'
  },
  {
    icon: '📄',
    title: 'AI Summaries',
    description: 'Intelligent summarization that extracts key points and impact analysis'
  },
  {
    icon: '✓',
    title: 'Confidence Scoring',
    description: 'ML-powered confidence metrics to prioritize critical updates'
  },
  {
    icon: '🌍',
    title: 'Multi-Jurisdiction',
    description: 'Track regulations across multiple regions and government bodies'
  }
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
  {
    quote: "LegalWatchDog has transformed how we monitor compliance. Real-time updates mean we're never caught off guard.",
    name: "Sarah Chen",
    role: "Legal Operations Director"
  },
  {
    quote: "The confidence scoring helps us prioritize critical updates without getting overwhelmed by noise.",
    name: "Michael Torres",
    role: "Compliance Manager"
  },
  {
    quote: "Multi-jurisdiction tracking in one place is exactly what our global team needed.",
    name: "Emma Watson",
    role: "Regulatory Affairs Head"
  }
]

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-[#FAF7F4] to-[#F5F1EC]">
    
    <!-- Hero Section -->
    <section class="pt-12 pb-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto text-center">
        <Badge 
          variant="secondary"
          class="text-[#3a1f14] border border-gray-200 bg-white px-6 py-1.5 text-sm font-semibold shadow-sm mb-8"
        >
          Join the Waitlist
        </Badge>
        
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Stay Ahead of Legal Changes<br />Without the Weekly Stress
        </h1>
        
        <p class="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
          LegalWatchDog tracks government updates, policy shifts, and regulatory changes for you.
          Get clear summaries, real-time alerts, and complete visibility across all your jurisdictions.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-2">
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
            class="px-6 py-3 bg-[#3a1f14] text-white hover:bg-[#2d1810] whitespace-nowrap"
          >
            Join the Waitlist
          </Button>
        </div>
        
        <p
          v-if="feedback"
          class="text-sm mb-4"
          :class="feedback.type === 'success' ? 'text-green-600' : 'text-red-600'"
        >
          {{ feedback.message }}
        </p>

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
            <img
              src="/images/dashboard-preview.png"
              alt="Dashboard Preview"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
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

    <!-- Dashboard Section -->
    <section class="py-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-4">
          Powerful <span class="text-[#F59E0B]">Dashboard</span>, Simple <span class="text-[#F59E0B]">Interface</span>
        </h2>
        <p class="text-center text-gray-600 mb-12">
          Everything you need to stay compliant in one clean, intuitive platform
        </p>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Active Projects -->
          <Card class="bg-white shadow-sm p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-lg">Active Projects</h3>
              <span class="text-sm text-gray-500">12 total</span>
            </div>
            <div class="space-y-3">
              <div
                v-for="(project, idx) in activeProjects"
                :key="idx"
                class="flex justify-between items-center py-2"
              >
                <span class="text-sm text-gray-700">{{ project.name }}</span>
                <span :class="`text-xs px-2 py-1 rounded-full font-medium ${project.color}`">
                  {{ project.status }}
                </span>
              </div>
            </div>
          </Card>

          <!-- Recent Updates -->
          <Card class="bg-white shadow-sm p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-lg">Recent Updates</h3>
              <span class="text-sm text-gray-500">Today</span>
            </div>
            <div class="space-y-3">
              <div
                v-for="(update, idx) in recentUpdates"
                :key="idx"
                class="flex justify-between items-center py-2"
              >
                <span class="text-sm text-gray-700">{{ update.title }}</span>
                <span class="text-xs font-medium text-[#F59E0B]">{{ update.confidence }}</span>
              </div>
            </div>
          </Card>

          <!-- Jurisdictions -->
          <Card class="bg-white shadow-sm p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-lg">Jurisdictions</h3>
              <span class="text-sm text-gray-500">8 tracked</span>
            </div>
            <div class="space-y-3">
              <div
                v-for="(jurisdiction, idx) in jurisdictions"
                :key="idx"
                class="flex justify-between items-center py-2"
              >
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-[#F59E0B] rounded-full"></div>
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
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 text-left">Full Name</label>
              <Input
                v-model="earlyAccessForm.fullName"
                type="text"
                placeholder="John Smith"
                required
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 text-left">Work Email</label>
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
            class="w-full px-6 py-3 bg-[#3a1f14] text-white hover:bg-[#2d1810]"
          >
            Get Early Access →
          </Button>
          
          <p class="text-xs text-gray-500 mt-4">
            We respect your privacy. No spam, unsubscribe anytime.
          </p>
        </Card>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-[#FDB863]">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
          Trusted by Compliance Professionals
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            v-for="(testimonial, idx) in testimonials"
            :key="idx"
            class="bg-white rounded-xl p-6 shadow-sm"
          >
            <p class="text-gray-700 mb-6 italic">"{{ testimonial.quote }}"</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-[#3a1f14] rounded-full flex items-center justify-center text-white font-bold">
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

    <!-- Footer -->
    <footer class="bg-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
          <div class="col-span-2 md:col-span-1">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 bg-[#3a1f14] rounded-full flex items-center justify-center text-white">
                🔔
              </div>
              <span class="text-xl font-bold text-[#3a1f14]">WatchDog</span>
            </div>
            <p class="text-sm text-gray-600">
              LegalWatchDog helps you track cross-border regulation updates in hours, not weeks.
            </p>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 mb-3">Product</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-gray-900">Features</a></li>
              <li><a href="#" class="hover:text-gray-900">Pricing</a></li>
              <li><a href="#" class="hover:text-gray-900">Case studies</a></li>
              <li><a href="#" class="hover:text-gray-900">Reviews</a></li>
              <li><a href="#" class="hover:text-gray-900">Updates</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 mb-3">Company</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-gray-900">About</a></li>
              <li><a href="#" class="hover:text-gray-900">Contact us</a></li>
              <li><a href="#" class="hover:text-gray-900">Careers</a></li>
              <li><a href="#" class="hover:text-gray-900">Culture</a></li>
              <li><a href="#" class="hover:text-gray-900">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 mb-3">Support</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-gray-900">Getting started</a></li>
              <li><a href="#" class="hover:text-gray-900">Help center</a></li>
              <li><a href="#" class="hover:text-gray-900">Server status</a></li>
              <li><a href="#" class="hover:text-gray-900">Report a bug</a></li>
              <li><a href="#" class="hover:text-gray-900">Chat support</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-gray-900 mb-3">Subscribe to our newsletter</h4>
            <p class="text-sm text-gray-600 mb-3">
              Join our newsletter to get regulatory updates, priced notifications, and actionable insights.
            </p>
            <div class="flex gap-2">
              <Input
                v-model="newsletterEmail"
                type="email"
                placeholder="Enter your email"
                class="flex-1 text-sm"
              />
              <Button
                @click="handleNewsletterSubmit"
                class="px-4 py-2 bg-[#3a1f14] text-white hover:bg-[#2d1810] text-sm"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div class="pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p class="text-sm text-gray-600">
            Copyright © 2025 LegalWatchDog | All Rights Reserved
          </p>
          <div class="flex gap-4">
            <a href="#" class="text-gray-600 hover:text-gray-900">
              <div class="w-6 h-6 bg-gray-300 rounded-full"></div>
            </a>
            <a href="#" class="text-gray-600 hover:text-gray-900">
              <div class="w-6 h-6 bg-gray-300 rounded-full"></div>
            </a>
            <a href="#" class="text-gray-600 hover:text-gray-900">
              <div class="w-6 h-6 bg-gray-300 rounded-full"></div>
            </a>
            <a href="#" class="text-gray-600 hover:text-gray-900">
              <div class="w-6 h-6 bg-gray-300 rounded-full"></div>
            </a>
            <a href="#" class="text-gray-600 hover:text-gray-900">
              <div class="w-6 h-6 bg-gray-300 rounded-full"></div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>