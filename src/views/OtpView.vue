<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import AuthBranding from '@/components/authentication/AuthBranding.vue'
import { useAuthStore } from '@/stores/auth-store'

const authStore = useAuthStore()
const router = useRouter()

const OTP_TIMER_DURATION = 10 * 60

const otpCode = ref('')
const timer = ref(OTP_TIMER_DURATION)
const errorMessage = ref('')
const successMessage = ref('')
const isVerifying = ref(false)
let interval: ReturnType<typeof setInterval> | null = null

const email = computed(() => authStore.email)
const otpPurpose = computed(() => authStore.otpPurpose)

const obfuscatedEmail = computed(() => {
  if (!email.value) return ''
  const [username, domain] = email.value.split('@')
  if (!domain) return email.value
  const firstChar = username && username.length > 0 ? username[0] : ''
  return `${firstChar}*****@${domain}`
})

const subtitle = computed(() => {
  return otpPurpose.value === 'login'
    ? 'Enter the 6 digit code sent to confirm this login.'
    : 'Enter the 6 digit code sent to verify your email.'
})

const startTimer = () => {
  timer.value = OTP_TIMER_DURATION
  if (interval) {
    clearInterval(interval)
  }
  interval = setInterval(() => {
    if (timer.value <= 0) {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
      return
    }
    timer.value--
  }, 1000)
}

onMounted(() => {
  if (!email.value) {
    router.replace({ name: 'login' })
    return
  }
  startTimer()
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})

watchEffect(() => {
  if (!email.value) {
    router.replace({ name: 'login' })
  }
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const handleContinue = async () => {
  if (!email.value) {
    router.replace({ name: 'login' })
    return
  }

  const code = otpCode.value.trim()

  if (!code || code.length < 6) {
    errorMessage.value = 'Enter the 6 digit OTP sent to your email.'
    return
  }

  isVerifying.value = true
  errorMessage.value = ''
  successMessage.value = ''
  const currentPurpose = otpPurpose.value

  try {
    const response = await authStore.verifyOTP({ email: email.value, code })

    successMessage.value = response.message

    const destination =
      response.otp_purpose === 'signup' || currentPurpose === 'signup'
        ? { name: 'login' }
        : response.next === 'dashboard'
          ? { name: 'dashboard' }
          : { name: 'login' }

    if (destination.name === 'login') {
      router.replace(destination)
    } else {
      router.push(destination)
    }
  } catch (error) {
    if (isAxiosError(error)) {
      errorMessage.value =
        (error.response?.data as { message?: string })?.message ?? 'OTP verification failed.'
    } else {
      errorMessage.value = 'Unable to verify OTP. Please try again.'
    }
  } finally {
    isVerifying.value = false
  }
}

const handleResend = () => {
  if (timer.value > 0) return
  if (interval) {
    clearInterval(interval)
  }
  otpCode.value = ''
  successMessage.value = 'A new OTP has been sent to your email.'
  startTimer()
}
</script>

<template>
  <main class="flex min-h-screen bg-gray-50">
    <!-- Left Section - Branding -->
    <AuthBranding />

    <!-- Right Section - OTP Form -->
    <div class="flex w-full items-center justify-center p-8 lg:w-1/2">
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="mb-8 text-center lg:hidden">
          <h1 class="text-3xl font-bold text-amber-900">Legal WatchDog</h1>
        </div>

        <!-- OTP Card -->
        <div class="mb-8 text-center">
          <div class="mx-auto mb-6 flex items-center justify-center">
            <img src="/images/logo.png" alt="" class="h-[58px] w-[58px]" />
          </div>

          <h2 class="mb-2 text-4xl font-medium text-gray-900">Enter OTP Code</h2>
          <p class="text-gray-400">{{ subtitle }} We've sent it to {{ obfuscatedEmail }}.</p>
        </div>

        <!-- OTP Input Section -->
        <div class="mx-auto max-w-[400px] space-y-6">
          <!-- OTP Input -->
          <div class="flex justify-center">
            <input
              v-model="otpCode"
              type="text"
              maxlength="6"
              inputmode="numeric"
              placeholder="••••••"
              class="h-14 w-40 rounded-lg border border-gray-300 text-center text-2xl font-medium tracking-[0.4em] focus:border-transparent focus:ring-2 focus:ring-amber-900 focus:outline-none"
            />
          </div>

          <div
            v-if="errorMessage"
            class="rounded-md border border-red-200 bg-red-50/70 p-3 text-sm text-red-700"
          >
            {{ errorMessage }}
          </div>
          <div
            v-if="successMessage"
            class="rounded-md border border-emerald-200 bg-emerald-50/70 p-3 text-sm text-emerald-700"
          >
            {{ successMessage }}
          </div>

          <!-- Resend Section -->
          <div class="flex items-center justify-between text-sm">
            <button
              type="button"
              @click="handleResend"
              :class="[
                'text-gray-600',
                timer === 0
                  ? 'cursor-pointer underline hover:text-[#3C2610]'
                  : 'cursor-not-allowed',
              ]"
            >
              Don't receive code?
            </button>
            <span class="text-gray-500">Resend in {{ formatTime(timer) }}</span>
          </div>

          <!-- Continue Button -->
          <button
            type="button"
            @click="handleContinue"
            :disabled="isVerifying"
            class="w-full rounded-lg bg-[#3C2610] py-3 font-medium text-white transition-colors hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span v-if="!isVerifying">Continue</span>
            <span v-else>Verifying...</span>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
