<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import AuthLayout from '@/components/authentication/AuthLayout.vue'
import { useAuthStore } from '@/stores/auth-store'
import AuthCard from '@/components/authentication/AuthCard.vue'
import FormControl from '@/components/composables/FormControl.vue'
import SocialLogins from '@/components/authentication/SocialLogins.vue'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const errors = ref<string[]>([])
const serverError = ref('')
const isSubmitting = ref(false)

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8
const sanitize = (value: string) => value.trim()

const handleLogin = async () => {
  const sanitizedEmail = sanitize(email.value).toLowerCase()
  const sanitizedPassword = sanitize(password.value)

  const validationErrors: string[] = []

  if (!sanitizedEmail || !emailPattern.test(sanitizedEmail)) {
    validationErrors.push('Enter a valid company email.')
  }

  if (!sanitizedPassword) {
    validationErrors.push('Password is required.')
  } else if (sanitizedPassword.length < MIN_PASSWORD_LENGTH) {
    validationErrors.push('Password must be at least 8 characters long.')
  }

  errors.value = validationErrors
  if (validationErrors.length > 0) return

  isSubmitting.value = true
  serverError.value = ''

  try {
    const success = await authStore.login({
      email: sanitizedEmail,
      password: sanitizedPassword,
    })

    if (success) {
      router.push({ name: 'dashboard' })
    }
  } catch (error) {
    if (isAxiosError(error)) {
      serverError.value =
        (error.response?.data as { message?: string })?.message ?? 'Unable to log in.'
    } else {
      serverError.value = 'An unexpected error occurred. Please try again.'
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AuthLayout>
    <AuthCard header-text="Welcome Back">
      <template v-slot:desc>
        <p>Don't have an account?
          <RouterLink to="/signup" class="btn--link">Sign up</RouterLink></p>
      </template>
      <form @submit.prevent="handleLogin" class="space-y-6">
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
              class="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                v-if="!showPassword"
                class="h-5 w-5 me-4"
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
              <svg v-else class="h-5 w-5 me-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
          </template>
        </FormControl>

        <div class="flex items-center justify-between">
          <label class="group flex cursor-pointer items-center">
            <div class="relative flex items-center">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 cursor-pointer rounded border-gray-300 text-accent-subtle transition duration-150 ease-in-out focus:ring-accent-subtle"
              />
            </div>
            <span class="ml-2 text-sm text-gray-600 group-hover:text-gray-800">Remember me</span>
          </label>
          <RouterLink to="/coming-soon" class="btn--link">Forgot password?</RouterLink>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full cursor-pointer rounded-md bg-accent-subtle py-4 px-5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#2a1b0b] disabled:cursor-not-allowed disabled:opacity-70 mt-3"
        >
          <span v-if="!isSubmitting">Login</span>
          <span v-else>Checking credentials...</span>
        </button>

        <div class="relative py-2">
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
