<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AuthLayout from '@/components/authentication/AuthLayout.vue'
import { useAuthStore } from '@/stores/auth-store'

type StatusType = 'success' | 'error'
type StatusContext = 'signup' | 'reset-password'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const getQueryValue = (value: unknown) => {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value[0] ?? ''
  return ''
}

const statusType = computed<StatusType>(() =>
  route.query.status === 'error' ? 'error' : 'success',
)

const context = computed<StatusContext>(() =>
  route.query.context === 'reset-password' ? 'reset-password' : 'signup',
)

const statusCopy = computed(() => {
  const customTitle = getQueryValue(route.query.title).trim() || null
  const customSubtitle = getQueryValue(route.query.subtitle).trim() || null
  const customMessage = getQueryValue(route.query.message).trim() || null

  const map: Record<
    StatusContext,
    Record<
      StatusType,
      { title: string; subtitle: string; message: string; cta: string; redirectName: string }
    >
  > = {
    signup: {
      success: {
        title: 'Your Account Successfully Created',
        subtitle: 'Let’s start your journey',
        message: 'We have set everything up. Continue to login to get started.',
        cta: 'Continue to Login',
        redirectName: 'login',
      },
      error: {
        title: 'We Could Not Create Your Account',
        subtitle: 'Please review your details and try again',
        message: 'Use the button below to return to signup and adjust your information.',
        cta: 'Back to Signup',
        redirectName: 'signup',
      },
    },
    'reset-password': {
      success: {
        title: 'Password Successfully Changed',
        subtitle: 'Sign in with your new password',
        message: 'Your credentials have been updated. Continue to login.',
        cta: 'Continue to Login',
        redirectName: 'login',
      },
      error: {
        title: 'Password Change Was Not Completed',
        subtitle: 'Please try resetting your password again',
        message: 'Return to the reset form to fix the issue and resubmit.',
        cta: 'Back to Reset Password',
        redirectName: 'reset-password',
      },
    },
  }

  const defaults = map[context.value][statusType.value]

  return {
    title: customTitle ?? defaults.title,
    subtitle: customSubtitle ?? defaults.subtitle,
    message: customMessage ?? defaults.message,
    cta: defaults.cta,
    redirectName: defaults.redirectName,
  }
})

const targetRoute = computed(() => {
  const redirectName = getQueryValue(route.query.redirect).trim() || statusCopy.value.redirectName
  return { name: redirectName }
})

const isNavigating = ref(false)

const handleRedirect = () => {
  if (isNavigating.value) return
  isNavigating.value = true
  if (statusType.value === 'success') {
    if (context.value === 'signup') authStore.clearSignupDraft()
    if (context.value === 'reset-password') authStore.clearResetPasswordDraft()
  }
  router.replace(targetRoute.value)
}

const isSuccess = computed(() => statusType.value === 'success')
</script>

<template>
  <AuthLayout container-class="p-6 lg:p-12">
    <div class="flex min-h-[80vh] flex-col items-center justify-center">
      <div class="w-full max-w-xl space-y-8 text-center">
        <div class="flex justify-center">
          <div
            class="flex h-16 w-16 items-center justify-center rounded-full"
            :class="isSuccess ? 'bg-green-100' : 'bg-red-100'"
          >
            <svg
              v-if="isSuccess"
              class="h-8 w-8 text-green-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <svg
              v-else
              class="h-8 w-8 text-red-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </div>
        </div>

        <div class="space-y-3">
          <h1 class="text-3xl leading-tight font-semibold text-gray-900 lg:text-[40px]">
            {{ statusCopy.title }}
          </h1>
          <p class="text-base font-medium text-gray-500 lg:text-lg">
            {{ statusCopy.subtitle }}
          </p>
          <p class="text-sm text-gray-500">
            {{ statusCopy.message }}
          </p>
        </div>

        <div class="space-y-3">
          <button
            type="button"
            @click="handleRedirect"
            class="bg-accent-main hover:bg-accent-subtle focus:ring-focus flex w-full items-center justify-center gap-2 rounded-md px-6 py-4 text-base font-semibold text-white transition-colors focus:ring-2 focus:outline-none"
            :disabled="isNavigating"
          >
            <span>{{ isNavigating ? 'Redirecting...' : statusCopy.cta }}</span>
          </button>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>
