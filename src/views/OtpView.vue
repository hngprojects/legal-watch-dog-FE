<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watchEffect, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import AuthBranding from '@/components/authentication/AuthBranding.vue'
import { useAuthStore } from '@/stores/auth-store'

const authStore = useAuthStore()
const router = useRouter()

const otpDigits = ref<string[]>(['', '', '', '', '', ''])
const inputRefs = ref<(HTMLInputElement | null)[]>([])
const timer = ref(60)
const errorMessage = ref('')
const successMessage = ref('')
const isVerifying = ref(false)
let interval: ReturnType<typeof setInterval> | null = null

const email = computed(() => authStore.email)
const otpPurpose = computed(() => authStore.otpPurpose)

const otpCode = computed(() => otpDigits.value.join(''))

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
  timer.value = 60
  interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--
    }
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

const handleInput = (index: number, event: Event) => {
  const input = event.target as HTMLInputElement
  const value = input.value

  // Only allow numbers
  if (value && !/^\d$/.test(value)) {
    input.value = otpDigits.value[index] || ''
    return
  }

  otpDigits.value[index] = value

  // Auto-focus next input
  if (value && index < 5) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus()
    })
  }
}

const handleKeyDown = (index: number, event: KeyboardEvent) => {
  // Handle backspace
  if (event.key === 'Backspace') {
    if (!otpDigits.value[index] && index > 0) {
      nextTick(() => {
        inputRefs.value[index - 1]?.focus()
      })
    }
  }
  // Handle arrow keys
  else if (event.key === 'ArrowLeft' && index > 0) {
    nextTick(() => {
      inputRefs.value[index - 1]?.focus()
    })
  } else if (event.key === 'ArrowRight' && index < 5) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus()
    })
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text') || ''
  const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('')

  digits.forEach((digit, index) => {
    if (index < 6) {
      otpDigits.value[index] = digit
    }
  })

  // Focus the next empty input or the last one
  const nextEmptyIndex = otpDigits.value.findIndex((d) => !d)
  const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
  nextTick(() => {
    inputRefs.value[focusIndex]?.focus()
  })
}

const handleContinue = async () => {
  if (!email.value) {
    router.replace({ name: 'login' })
    return
  }

  const code = otpCode.value

  if (!code || code.length < 6) {
    errorMessage.value = 'Enter the 6 digit OTP sent to your email.'
    return
  }

  isVerifying.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await authStore.verifyOTP({ email: email.value, code })

    successMessage.value = response.message
    if (response.next === 'login') {
      router.push({ name: 'login' })
    } else if (response.next === 'dashboard') {
      router.push({ name: 'dashboard' })
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
  otpDigits.value = ['', '', '', '', '', '']
  successMessage.value = 'A new OTP has been sent to your email.'
  startTimer()
  nextTick(() => {
    inputRefs.value[0]?.focus()
  })
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
          <div class="flex justify-center gap-2">
            <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              :ref="(el) => (inputRefs[index] = el as HTMLInputElement | null)"
              v-model="otpDigits[index]"
              type="text"
              maxlength="1"
              inputmode="numeric"
              @input="handleInput(index, $event)"
              @keydown="handleKeyDown(index, $event)"
              @paste="handlePaste"
              class="h-14 w-12 rounded-lg border border-gray-300 text-center text-2xl font-medium focus:border-transparent focus:ring-2 focus:ring-amber-900 focus:outline-none"
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