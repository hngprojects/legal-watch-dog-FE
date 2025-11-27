<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import AuthLayout from '@/components/authentication/AuthLayout.vue'
import { useAuthStore } from '@/stores/auth-store'
import AuthCard from '@/components/authentication/AuthCard.vue'
import FormControl from '@/components/composables/FormControl.vue'
import SocialLogins from '@/components/authentication/SocialLogins.vue'

const authStore = useAuthStore()

const companyName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
// const agreeToTerms = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errors = ref<string[]>([])
const serverError = ref('')
const isSubmitting = ref(false)

const router = useRouter()

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PUBLIC_EMAIL_DENYLIST = new Set([
  // Todo: Add gmail
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
  'icloud.com',
  'mail.com',
  'protonmail.com',
  'zoho.com',
  'gmx.com',
  'yandex.com',
  'msn.com',
  'live.com',
  'ymail.com',
  'inbox.com',
  'me.com',
  'fastmail.com',
  'hushmail.com',
])
const hasUppercase = /[A-Z]/
const hasLowercase = /[a-z]/
const hasNumber = /[0-9]/
const hasSpecial = /[^A-Za-z0-9]/
const MIN_PASSWORD_LENGTH = 8

const sanitize = (value: string) => value.trim()

const hydrateFromDraft = () => {
  if (authStore.signupDraft) {
    companyName.value = authStore.signupDraft.companyName
    email.value = authStore.signupDraft.email
    password.value = authStore.signupDraft.password
    confirmPassword.value = authStore.signupDraft.confirmPassword
  }
}

onMounted(hydrateFromDraft)

const resetForm = () => {
  companyName.value = ''
  email.value = ''
  password.value = ''
  confirmPassword.value = ''
  // agreeToTerms.value = false
  showPassword.value = false
  showConfirmPassword.value = false
  errors.value = []
  serverError.value = ''
}

const validateSignupForm = () => {
  const sanitizedCompany = sanitize(companyName.value)
  const sanitizedEmail = sanitize(email.value).toLowerCase()
  const sanitizedPassword = sanitize(password.value)
  const sanitizedConfirm = sanitize(confirmPassword.value)

  const validationErrors: string[] = []

  if (!sanitizedCompany) {
    validationErrors.push('Company name is required.')
  }

  if (!sanitizedEmail || !emailPattern.test(sanitizedEmail)) {
    validationErrors.push('Enter a valid company email address.')
  } else {
    const domain = sanitizedEmail.split('@')[1] ?? ''
    if (PUBLIC_EMAIL_DENYLIST.has(domain)) {
      validationErrors.push(
        'Use your company email address (public email domains are not allowed).',
      )
    }
  }

  if (!sanitizedPassword) {
    validationErrors.push('Password is required.')
  } else {
    if (sanitizedPassword.length < MIN_PASSWORD_LENGTH) {
      validationErrors.push('Password must be at least 8 characters.')
    }
    if (
      !hasUppercase.test(sanitizedPassword) ||
      !hasLowercase.test(sanitizedPassword) ||
      !hasNumber.test(sanitizedPassword) ||
      !hasSpecial.test(sanitizedPassword)
    ) {
      validationErrors.push(
        'Password must include an uppercase letter, a lowercase letter, a number, and a special character.',
      )
    }
  }

  if (sanitizedPassword && sanitizedConfirm && sanitizedPassword !== sanitizedConfirm) {
    validationErrors.push('Passwords do not match.')
  }

  // if (!agreeToTerms.value) {
  //   validationErrors.push('You must agree to the terms to continue.')
  // }

  errors.value = validationErrors
  return validationErrors.length === 0
}

const captureDraft = () => ({
  companyName: companyName.value,
  email: email.value,
  password: password.value,
  confirmPassword: confirmPassword.value,
})

const handleCreateAccount = async () => {
  if (!validateSignupForm()) return
  serverError.value = ''
  isSubmitting.value = true
  authStore.setSignupDraft(captureDraft())

  const sanitizedEmail = sanitize(email.value).toLowerCase()

  try {
    const response = await authStore.register({
      name: sanitize(companyName.value),
      email: sanitizedEmail,
      password: sanitize(password.value),
      confirm_password: sanitize(confirmPassword.value),
      industry: 'Legal Services',
    })

    if (response && response.status_code === 201) {
      resetForm()
      router.push({ name: 'otp', query: { flow: 'signup' } })
    } else {
      serverError.value = 'Registration successful but failed to receive OTP instructions.'
    }
  } catch (error) {
    if (isAxiosError(error)) {
      const apiMessage = (error.response?.data as { message?: string })?.message
      const isPendingOtp =
        typeof apiMessage === 'string' &&
        apiMessage.toLowerCase().includes('pending otp verification')

      if (isPendingOtp) {
        try {
          authStore.setUserEmail(sanitizedEmail)
          authStore.setOtpPurpose('signup')
          await authStore.resendOTP(sanitizedEmail)
          resetForm()
          router.push({ name: 'otp' })
          return
        } catch (resendError) {
          serverError.value =
            (isAxiosError(resendError) &&
              (resendError.response?.data as { message?: string })?.message) ||
            'We could not resend your OTP. Please try again.'
          return
        }
      }

      serverError.value = apiMessage ?? 'An error occurred while creating your account.'
    } else {
      serverError.value = 'An unexpected error occurred. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AuthLayout container-class="p-6 lg:p-12">
    <AuthCard header-text="Create an account">
      <template v-slot:desc>
        <p>
          Already have an account? <RouterLink to="/login" class="btn--link">Sign in</RouterLink>
        </p>
      </template>
      <form @submit.prevent="handleCreateAccount" class="space-y-5">
        <div
          v-if="errors.length"
          class="rounded-md border border-red-200 bg-red-50/70 p-4 text-left text-sm text-red-700"
        >
          <p class="mb-2 font-semibold">Please fix the following:</p>
          <ul class="list-disc space-y-1 pl-4">
            <li v-for="issue in errors" :key="issue">{{ issue }}</li>
          </ul>
        </div>

        <FormControl
          v-model="companyName"
          label="Company Name"
          placeholder="Enter your company's name"
          required
        />

        <FormControl
          v-model="email"
          type="email"
          label="Company Email"
          placeholder="Enter your company's email"
          required
        />

        <FormControl
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          placeholder="Enter your password"
          required
        >
          <template #trailing>
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg
                v-if="!showPassword"
                class="me-3 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
              <svg
                v-else
                class="me-3 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
          </template>
        </FormControl>

        <FormControl
          v-model="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          label="Confirm Password"
          placeholder="Confirm your password"
          required
        >
          <template #trailing>
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg
                v-if="!showConfirmPassword"
                class="me-3 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
              <svg
                v-else
                class="me-3 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
          </template>
        </FormControl>

        <!-- I can't remove this in good conscience because as a policy scrapper handling organization data, policies, terms and conditions should be clear -->

        <!-- <FormControl v-model="agreeToTerms" type="checkbox" required>
          <template #label>
            <span class="text-gray-500">
              I agree to the
              <a
                href="#"
                class="font-medium text-gray-900 underline decoration-1 hover:text-[#3C2610]"
                >terms of service</a
              >
              and
              <a
                href="#"
                class="font-medium text-gray-900 underline decoration-1 hover:text-[#3C2610]"
                >Privacy policy</a
              >
            </span>
          </template>
        </FormControl> -->

        <button
          type="submit"
          :disabled="isSubmitting"
          class="bg-accent-main text-md mt-3 w-full cursor-pointer rounded-md p-4 text-sm font-bold tracking-wide text-white uppercase shadow-sm transition-colors hover:bg-[#2a1b0b] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span v-if="!isSubmitting">Signup</span>
          <span v-else>Creating account...</span>
        </button>

        <div
          v-if="serverError"
          class="rounded-md border border-red-200 bg-red-50/70 p-4 text-left text-sm text-red-700"
        >
          {{ serverError }}
        </div>

        <div class="relative mt-9 py-2">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-white px-4 tracking-wider text-gray-500">OR</span>
          </div>
        </div>
        <SocialLogins />
      </form>
    </AuthCard>
  </AuthLayout>
</template>
