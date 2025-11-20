<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import AuthBranding from '@/components/authentication/AuthBranding.vue'

const otpCode = ref('')
const timer = ref(32)
let interval: ReturnType<typeof setInterval> | null = null

const email = 'd*****@gmail.com'

onMounted(() => {
  interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    }
  }, 1000)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const handleContinue = () => {
  console.log('OTP Code:', otpCode.value)
}

const handleResend = () => {
  if (timer.value === 0) {
    timer.value = 32
    otpCode.value = ''
  }
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
          <p class="text-gray-400">Enter the 8 digit code sent to {{ email }}</p>
        </div>

        <!-- OTP Input Section -->
        <div class="mx-auto max-w-[400px] space-y-6">
          <!-- OTP Input -->
          <div class="flex justify-center">
            <input
              v-model="otpCode"
              type="text"
              maxlength="8"
              placeholder="8"
              class="h-14 w-20 rounded-lg border border-gray-300 text-center text-2xl font-medium focus:border-transparent focus:ring-2 focus:ring-amber-900 focus:outline-none"
            />
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
            class="w-full rounded-lg bg-[#3C2610] py-3 font-medium text-white transition-colors hover:bg-amber-800"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
