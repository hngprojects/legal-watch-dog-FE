<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import AuthBranding from '@/components/authentication/AuthBranding.vue'
import MainHeader from '@/components/landing-page/MainHeader.vue'
// import MainFooter from '@/components/landing-page/MainFooter.vue'
import { useAuthStore } from '@/stores/auth-store'
import type { LoginOtpChallenge } from '@/types/auth'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const errors = ref<string[]>([])
const serverError = ref('')
const isSubmitting = ref(false)

const router = useRouter()

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8
const sanitize = (value: string) => value.trim()

const isOtpChallenge = (payload: unknown): payload is LoginOtpChallenge => {
  return !!payload && typeof payload === 'object' && 'requires_otp' in payload
}

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
    const result = await authStore.login({
      email: sanitizedEmail,
      password: sanitizedPassword,
    })

    if (isOtpChallenge(result) && result.requires_otp) {
      router.push({ name: 'otp' })
      return
    }

    router.push({ name: 'dashboard' })
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
  <div class="flex min-h-screen flex-col bg-white">
    <MainHeader />

    <main class="relative flex flex-1">
      <AuthBranding />

      <div class="flex w-full items-center justify-center p-8 lg:w-1/2 lg:p-16">
        <div class="w-full max-w-[440px]">
          <div class="mb-8 text-center lg:hidden">
            <h1 class="text-2xl font-bold text-[#3C2610]">Legal WatchDog</h1>
          </div>

          <div class="mb-10 text-center">
            <h2 class="mb-3 text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p class="text-sm text-gray-500">
              Enter your organizational credentials to access the platform.
            </p>
          </div>

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

            <div class="relative">
              <label
                class="pointer-events-none absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500"
              >
                Company Email
              </label>
              <input
                v-model="email"
                type="email"
                placeholder="Enter your company's email"
                class="w-full rounded-md border border-gray-300 px-4 py-3.5 text-sm placeholder-gray-400 transition-colors focus:border-[#3C2610] focus:ring-1 focus:ring-[#3C2610] focus:outline-none"
              />
            </div>

            <div class="relative">
              <label
                class="pointer-events-none absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500"
              >
                Password
              </label>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                class="w-full rounded-md border border-gray-300 px-4 py-3.5 pr-12 text-sm placeholder-gray-400 transition-colors focus:border-[#3C2610] focus:ring-1 focus:ring-[#3C2610] focus:outline-none"
              />

              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  v-if="!showPassword"
                  class="h-5 w-5"
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
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            </div>

            <div class="flex items-center justify-between">
              <label class="group flex cursor-pointer items-center">
                <div class="relative flex items-center">
                  <input
                    v-model="rememberMe"
                    type="checkbox"
                    class="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#3C2610] transition duration-150 ease-in-out focus:ring-[#3C2610]"
                  />
                </div>
                <span class="ml-2 text-sm text-gray-600 group-hover:text-gray-800"
                  >Remember me</span
                >
              </label>
              <a href="#" class="text-xs font-bold text-gray-900 hover:underline"
                >Forgot password?</a
              >
            </div>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full cursor-pointer rounded-md bg-[#3C2610] py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#2a1b0b] disabled:cursor-not-allowed disabled:opacity-70"
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

            <div class="space-y-3">
              <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-center gap-3 rounded-md border border-gray-300 bg-white py-3 transition-colors hover:bg-gray-50"
              >
                <img src="/images/google.png" alt="Google" class="h-5 w-5" />
                <span class="text-sm font-medium text-gray-700">Continue with Google</span>
              </button>

              <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-center gap-3 rounded-md border border-gray-300 bg-white py-3 transition-colors hover:bg-gray-50"
              >
                <img src="/images/apple.png" alt="Apple" class="h-5 w-5" />
                <span class="text-sm font-medium text-gray-700">Continue with Apple</span>
              </button>

              <button
                type="button"
                class="flex w-full cursor-pointer items-center justify-center gap-3 rounded-md border border-gray-300 bg-white py-3 transition-colors hover:bg-gray-50"
              >
                <img src="/images/microsoft.png" alt="Microsoft" class="h-5 w-5" />
                <span class="text-sm font-medium text-gray-700">Continue with Microsoft</span>
              </button>
            </div>

            <div class="pt-2 pb-4 text-center">
              <p class="text-sm text-gray-600">
                Don't have an account?
                <router-link
                  to="/signup"
                  class="ml-1 font-bold text-gray-900 underline hover:text-[#3C2610]"
                >
                  Create Account
                </router-link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>

    <!-- <MainFooter /> -->
  </div>
</template>
