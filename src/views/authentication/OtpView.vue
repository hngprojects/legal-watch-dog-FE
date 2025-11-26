<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import AuthLayout from '@/components/authentication/AuthLayout.vue'
import { useAuthStore } from '@/stores/auth-store'
import AuthCard from '@/components/authentication/AuthCard.vue'
import { ArrowLeftIcon } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const DIGIT_COUNT = 6

const otpDigits = ref<string[]>(Array(DIGIT_COUNT).fill(''))
const digitInputs = ref<Array<HTMLInputElement | null>>([])
const timer = ref(0)
const errorMessage = ref('')
const successMessage = ref('')
const isVerifying = ref(false)
const isResending = ref(false)
let interval: ReturnType<typeof setInterval> | null = null

const email = computed(() => authStore.email)
const otpPurpose = computed(
  () =>
    authStore.otpPurpose ?? (route.query.flow === 'password-reset' ? 'password-reset' : 'signup'),
)

const obfuscatedEmail = computed(() => {
  if (!email.value) return ''
  const [username, domain] = email.value.split('@')
  if (!domain) return email.value
  const firstChar = username && username.length > 0 ? username[0] : ''
  return `${firstChar}*****@${domain}`
})

const subtitle = computed(() =>
  otpPurpose.value === 'password-reset'
    ? 'We have sent an email with password reset information to'
    : 'We sent a verification code to',
)
const headingText = computed(() =>
  otpPurpose.value === 'password-reset' ? 'Check your email' : 'Verify your email',
)
const backRoute = computed(() =>
  otpPurpose.value === 'password-reset' ? { name: 'forgot-password' } : { name: 'signup' },
)
const isPasswordResetFlow = computed(() => otpPurpose.value === 'password-reset')
const backText = computed(() => (isPasswordResetFlow.value ? 'Back to login' : 'Back to sign up'))
const isComplete = computed(() => otpDigits.value.join('').length === DIGIT_COUNT)
const timerDuration = computed(() => (isPasswordResetFlow.value ? 0.3 * 60 : 0.2 * 60))

const startTimer = (seconds?: number) => {
  timer.value = typeof seconds === 'number' ? seconds : timerDuration.value
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
  if (!authStore.otpPurpose) {
    authStore.setOtpPurpose(otpPurpose.value)
  }
  if (!email.value) {
    router.replace(backRoute.value)
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
    router.replace(backRoute.value)
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
  const digits = paste
    .replace(/\D/g, '')
    .slice(0, DIGIT_COUNT - index)
    .split('')

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
    router.replace(backRoute.value)
    return
  }

  const code = otpDigits.value.join('').trim()

  if (!code || code.length < DIGIT_COUNT) {
    errorMessage.value = 'Enter the 6-digit OTP sent to your email.'
    return
  }

  isVerifying.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    if (isPasswordResetFlow.value) {
      const response = await authStore.verifyPasswordReset({ email: email.value, code })
      const resetToken =
        response?.reset_token ?? response?.data?.reset_token ?? authStore.resetToken
      if (!resetToken) {
        throw new Error('Missing reset token from server response.')
      }
      successMessage.value =
        response?.message ?? 'Code verified. You can now create a new password.'
      router.replace({ name: 'reset-password' })
    } else {
      const response = await authStore.verifyOTP({ email: email.value, code })

      successMessage.value = (response?.message as string) ?? 'Your account is verified.'
      router.replace({
        name: 'auth-status',
        query: {
          status: 'success',
          context: 'signup',
          message: successMessage.value,
        },
      })
    }
  } catch (error) {
    if (isAxiosError(error)) {
      errorMessage.value =
        (error.response?.data as { message?: string })?.message ?? 'OTP verification failed.'
    } else {
      errorMessage.value = 'Unable to verify OTP. Please try again.'
    }

    if (!isPasswordResetFlow.value) {
      router.push({
        name: 'auth-status',
        query: {
          status: 'error',
          context: 'signup',
          message: errorMessage.value,
        },
      })
    }
  } finally {
    isVerifying.value = false
  }
}

const handleResend = async () => {
  if (timer.value > 0) return
  if (!email.value) {
    router.replace(backRoute.value)
    return
  }

  isResending.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = isPasswordResetFlow.value
      ? await authStore.requestPasswordReset(email.value)
      : await authStore.resendOTP(email.value)

    otpDigits.value = Array(DIGIT_COUNT).fill('')
    digitInputs.value.forEach((input) => {
      if (input) input.value = ''
    })

    successMessage.value = response?.message ?? 'A new OTP has been sent to your email.'
    startTimer(5 * 60)
  } catch (error) {
    if (isAxiosError(error)) {
      errorMessage.value =
        (error.response?.data as { message?: string })?.message ?? 'Unable to resend OTP.'
    } else {
      errorMessage.value = 'Unable to resend OTP. Please try again.'
    }
  } finally {
    isResending.value = false
  }
}
</script>

<template>
  <AuthLayout wrapper-class="bg-white" main-class="bg-white" container-class="p-4 lg:p-10">
    <AuthCard :header-text="headingText">
      <template v-slot:desc>
        <p class="text-base text-gray-500">
          {{ subtitle }}
          <span class="font-semibold text-gray-800">{{ obfuscatedEmail }}</span>
        </p>
      </template>
      <div
        class="flex w-full max-w-5xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="w-full max-w-xl space-y-8">
          <div class="flex justify-between gap-3">
            <input
              v-for="(_, index) in otpDigits"
              :key="index"
              ref="digitInputs"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              maxlength="1"
              class="focus:border-accent-main h-14 w-14 rounded-md border border-gray-300 text-center text-lg font-medium text-gray-900 focus:ring-2 focus:ring-[#F4E4D4]"
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
              class="btn--primary disabled:btn--disabled w-full"
            >
              <span v-if="!isVerifying">Continue</span>
              <span v-else>Verifying...</span>
            </button>

            <div class="flex items-center justify-center gap-2 text-sm text-gray-700">
              <span>Didn't receive the link?</span>
              <button
                type="button"
                @click="handleResend"
                :disabled="timer > 0 || isResending"
                class="btn--link disabled:link--disabled"
              >
                <span v-if="isResending">Sending...</span>
                <span v-else-if="timer > 0">{{ formatTime(timer) }}</span>
                <span v-else>Resend Code</span>
              </button>
            </div>

            <RouterLink
              :to="backRoute"
              class="btn--link flex items-center justify-center gap-2 text-sm"
            >
              <ArrowLeftIcon :size="18" />
              <span>{{ backText }}</span>
            </RouterLink>
          </div>

          <div
            v-if="errorMessage"
            class="bg-destructive/70 text-surface rounded-md border border-red-200 p-3 text-sm"
          >
            {{ errorMessage }}
          </div>
          <div
            v-if="successMessage"
            class="rounded-md border border-emerald-200 bg-emerald-50/70 p-3 text-sm text-emerald-700"
          >
            {{ successMessage }}
          </div>
        </div>
      </div>
    </AuthCard>
  </AuthLayout>
</template>
