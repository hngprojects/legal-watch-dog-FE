<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import AuthLayout from '@/components/authentication/AuthLayout.vue'
import { useAuthStore } from '@/stores/auth-store'
import AuthCard from '@/components/authentication/AuthCard.vue'
import { ArrowLeftIcon } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const OTP_TIMER_DURATION = 10 * 1
const DIGIT_COUNT = 6

const otpDigits = ref<string[]>(Array(DIGIT_COUNT).fill(''))
const digitInputs = ref<Array<HTMLInputElement | null>>([])
const timer = ref(OTP_TIMER_DURATION)
const errorMessage = ref('')
const successMessage = ref('')
const isVerifying = ref(false)
let interval: ReturnType<typeof setInterval> | null = null

const email = computed(() => authStore.email)

const obfuscatedEmail = computed(() => {
  if (!email.value) return ''
  const [username, domain] = email.value.split('@')
  if (!domain) return email.value
  const firstChar = username && username.length > 0 ? username[0] : ''
  return `${firstChar}*****@${domain}`
})

const subtitle = computed(() => 'We have sent an email with password reset information to')
const isComplete = computed(() => otpDigits.value.join('').length === DIGIT_COUNT)

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
    router.replace({ name: 'signup' })
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
    router.replace({ name: 'signup' })
  }
})

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const handleDigitInput = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement
  const value = target.value.replace(/\D/g, '').slice(0, 1)
  otpDigits.value[index] = value
  target.value = value

  if (value && index < digitInputs.value.length - 1) {
    digitInputs.value[index + 1]?.focus()
  }
}

const handleKeydown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace') {
    if (otpDigits.value[index]) {
      otpDigits.value[index] = ''
      return
    }
    if (index > 0) {
      digitInputs.value[index - 1]?.focus()
    }
  }
  if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    digitInputs.value[index - 1]?.focus()
  }
  if (event.key === 'ArrowRight' && index < digitInputs.value.length - 1) {
    event.preventDefault()
    digitInputs.value[index + 1]?.focus()
  }
}

const handlePaste = (event: ClipboardEvent, index: number) => {
  event.preventDefault()
  const paste = event.clipboardData?.getData('text') ?? ''
  const digits = paste.replace(/\D/g, '').slice(0, DIGIT_COUNT - index).split('')

  digits.forEach((digit, offset) => {
    const targetIndex = index + offset
    if (targetIndex < DIGIT_COUNT) {
      otpDigits.value[targetIndex] = digit
      const input = digitInputs.value[targetIndex]
      if (input) input.value = digit
    }
  })

  const focusIndex = Math.min(index + digits.length, DIGIT_COUNT - 1)
  digitInputs.value[focusIndex]?.focus()
}

const handleContinue = async () => {
  if (!email.value) {
    router.replace({ name: 'signup' })
    return
  }

  const code = otpDigits.value.join('').trim()

  if (!code || code.length < DIGIT_COUNT) {
    errorMessage.value = 'Enter the 6 digit OTP sent to your email.'
    return
  }

  isVerifying.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await authStore.verifyOTP({ email: email.value, code })

    successMessage.value = response?.message as string

    const destination = response?.next === 'dashboard' ? { name: 'dashboard' } : { name: 'login' }

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
  otpDigits.value = Array(DIGIT_COUNT).fill('')
  digitInputs.value.forEach((input) => {
    if (input) input.value = ''
  })
  successMessage.value = 'A new OTP has been sent to your email.'
  startTimer()
}
</script>

<template>
  <AuthLayout wrapper-class="bg-white" main-class="bg-white" container-class="p-4 lg:p-10">
    <AuthCard header-text="Have you checked you mail">
      <template v-slot:desc>
        <p class="text-base text-gray-500">
          {{ subtitle }}
          <span class="font-semibold text-gray-800">{{ obfuscatedEmail }}</span>
        </p>
      </template>
      <div class="flex w-full max-w-5xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div class="w-full max-w-xl space-y-8">

          <div class="flex gap-3 justify-between">
            <input
              v-for="(_, index) in otpDigits"
              :key="index"
              ref="digitInputs"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              maxlength="1"
              class="h-14 w-14 rounded-md border border-gray-300 text-center text-lg font-medium text-gray-900 focus:border-accent-main focus:ring-2 focus:ring-[#F4E4D4]"
              :value="otpDigits[index]"
              @input="handleDigitInput($event, index)"
              @keydown="handleKeydown($event, index)"
              @paste="handlePaste($event, index)"
            />
          </div>

          <div class="space-y-4">
            <button
              type="button"
              @click="handleContinue"
              :disabled="isVerifying || !isComplete"
              class="w-full btn--primary disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span v-if="!isVerifying">Continue</span>
              <span v-else>Verifying...</span>
            </button>

            <div class="flex items-center justify-center gap-2 text-sm text-gray-700">
              <span>Didn't receive the link?</span>
              <button
                type="button"
                @click="handleResend"
                :disabled="timer > 0"
                class="btn--link"
              >
                Resend Code {{ timer > 0 ? `(${formatTime(timer)})` : '' }}
              </button>
            </div>

            <RouterLink to="/signup" class="flex items-center justify-center gap-2 btn--link text-sm">
              <ArrowLeftIcon :size=18 />
              <span>Back to sign up</span>
            </RouterLink>
          </div>

          <div v-if="errorMessage" class="rounded-md border border-red-200 bg-destructive/70 p-3 text-sm text-destructive">
            {{ errorMessage }}
          </div>
          <div v-if="successMessage" class="rounded-md border border-emerald-200 bg-emerald-50/70 p-3 text-sm text-emerald-700">
            {{ successMessage }}
          </div>
        </div>
      </div>
    </AuthCard>
  </AuthLayout>
</template>
