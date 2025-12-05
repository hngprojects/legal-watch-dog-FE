<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import AuthCard from '@/components/authentication/AuthCard.vue'
import FormControl from '@/components/composables/FormControl.vue'
import { useAuthStore } from '@/stores/auth-store'
import { ArrowLeftIcon } from 'lucide-vue-next'

const email = ref('')
const errors = ref<string[]>([])
const serverError = ref('')
const isSubmitting = ref(false)

const router = useRouter()
const authStore = useAuthStore()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const handleSubmit = async () => {
  const sanitizedEmail = email.value.trim().toLowerCase()
  const validationErrors: string[] = []

  if (!sanitizedEmail || !emailPattern.test(sanitizedEmail)) {
    validationErrors.push('Enter a valid email address.')
  }

  errors.value = validationErrors
  if (validationErrors.length) return

  isSubmitting.value = true
  serverError.value = ''

  try {
    const response = await authStore.requestPasswordReset(sanitizedEmail)
    const statusCode = (response as { status_code?: number })?.status_code
    if (typeof statusCode === 'number' && statusCode >= 400) {
      serverError.value =
        (response as { message?: string })?.message ??
        'Unable to send reset email. Please try again.'
      return
    }

    authStore.setUserEmail(sanitizedEmail)
    authStore.setOtpPurpose('password-reset')
    router.push({ name: 'otp', query: { flow: 'password-reset' } })
  } catch (error) {
    if (isAxiosError(error)) {
      serverError.value =
        (error.response?.data as { message?: string })?.message ??
        'Unable to send reset email. Please try again.'
    } else {
      serverError.value = 'An unexpected error occurred. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AuthCard header-text="Forgot Password">
    <template #desc>
      <p class="text-gray-600">Enter your email to reset your password.</p>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div
        v-if="serverError"
        class="rounded-md border border-red-200 bg-red-50/70 p-4 text-left text-sm text-red-700"
      >
        {{ serverError }}
      </div>
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
        v-model="email"
        type="email"
        label="Email address"
        placeholder="someone@email.com"
        autocomplete="email"
        required
      />

      <button
        type="submit"
        :disabled="isSubmitting"
        class="bg-accent-subtle mt-4 w-full cursor-pointer rounded-md px-5 py-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#2a1b0b] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span v-if="!isSubmitting">Continue</span>
        <span v-else>Sending reset link...</span>
      </button>
      <RouterLink
        :to="{ name: 'login' }"
        class="btn--link flex items-center justify-center gap-2 text-sm"
      >
        <ArrowLeftIcon :size="18" />
        <span>Back to login</span>
      </RouterLink>
    </form>
  </AuthCard>
</template>
