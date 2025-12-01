<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { isAxiosError } from 'axios'
import AuthCard from '@/components/authentication/AuthCard.vue'
import FormControl from '@/components/composables/FormControl.vue'
import { useAuthStore } from '@/stores/auth-store'
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errors = ref<string[]>([])
const serverError = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)

const resetToken = computed(() => authStore.resetToken)
const passwordCriteria = [
  (value: string) => value.length >= 8,
  (value: string) => /[A-Z]/.test(value),
  (value: string) => /[0-9]/.test(value),
  (value: string) => /[^A-Za-z0-9]/.test(value),
]

const strengthScore = computed(
  () => passwordCriteria.filter((check) => check(newPassword.value.trim())).length,
)

const sanitize = (value: string) => value.trim()

const hydrateFromDraft = () => {
  if (authStore.resetPasswordDraft) {
    newPassword.value = authStore.resetPasswordDraft.newPassword
    confirmPassword.value = authStore.resetPasswordDraft.confirmPassword
  }
}

onMounted(hydrateFromDraft)

watchEffect(() => {
  if (!resetToken.value && !successMessage.value) {
    router.replace({ name: 'forgot-password' })
  }
})

const validateForm = () => {
  const validationErrors: string[] = []
  const password = sanitize(newPassword.value)
  const confirm = sanitize(confirmPassword.value)

  if (!password || password.length < 8) {
    validationErrors.push('Password must be at least 8 characters long.')
  }
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    validationErrors.push('Include an uppercase letter, number, and symbol in your password.')
  }
  if (password !== confirm) {
    validationErrors.push('Passwords do not match.')
  }

  errors.value = validationErrors
  return validationErrors.length === 0
}

const handleSubmit = async () => {
  if (!resetToken.value) {
    router.replace({ name: 'forgot-password' })
    return
  }

  if (!validateForm()) return

  isSubmitting.value = true
  serverError.value = ''
  successMessage.value = ''
  authStore.setResetPasswordDraft({
    newPassword: newPassword.value,
    confirmPassword: confirmPassword.value,
  })

  try {
    const payload = {
      reset_token: resetToken.value,
      new_password: sanitize(newPassword.value),
      confirm_password: sanitize(confirmPassword.value),
    }
    const response = await authStore.confirmPasswordReset(payload)
    successMessage.value = response?.message ?? 'Password updated successfully.'
    newPassword.value = ''
    confirmPassword.value = ''
    authStore.clearResetPasswordDraft()
    router.replace({
      name: 'auth-status',
      query: {
        status: 'success',
        context: 'reset-password',
        message: successMessage.value,
      },
    })
  } catch (error) {
    if (isAxiosError(error)) {
      serverError.value =
        (error.response?.data as { message?: string })?.message ??
        'Unable to update password. Please try again.'
    } else {
      serverError.value = 'An unexpected error occurred. Please try again.'
    }

    router.push({
      name: 'auth-status',
      query: {
        status: 'error',
        context: 'reset-password',
        message: serverError.value,
      },
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AuthCard header-text="New Password">
    <template #desc>
      <p class="text-gray-600">Choose a strong password that you haven't used before.</p>
    </template>

    <div class="grid grid-cols-1 gap-8">
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
        <div
          v-if="successMessage"
          class="rounded-md border border-emerald-200 bg-emerald-50/70 p-3 text-sm text-emerald-700"
        >
          {{ successMessage }}
        </div>

        <FormControl
          v-model="newPassword"
          :type="showPassword ? 'text' : 'password'"
          label="New Password"
          placeholder="Enter a new password"
          autocomplete="new-password"
          required
        >
          <template #trailing>
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="cursor-pointer px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <EyeOffIcon v-if="showPassword" :size="18" aria-hidden="true" />
              <EyeIcon v-else :size="18" aria-hidden="true" />
              <span class="sr-only">{{ showPassword ? 'Hide password' : 'Show password' }}</span>
            </button>
          </template>
        </FormControl>

        <div class="flex items-center gap-2">
          <div
            v-for="index in passwordCriteria.length"
            :key="index"
            class="h-1 flex-1 rounded-full transition-all"
            :class="index <= strengthScore ? 'bg-emerald-500' : 'bg-gray-200'"
          />
        </div>
        <p class="text-sm text-gray-600">
          Hint: Password must be at least 8 characters and include an uppercase letter, a number,
          and a symbol.
        </p>

        <FormControl
          v-model="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          label="Confirm New Password"
          placeholder="Confirm password"
          autocomplete="new-password"
          required
        >
          <template #trailing>
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="cursor-pointer px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <EyeOffIcon v-if="showConfirmPassword" :size="18" aria-hidden="true" />
              <EyeIcon v-else :size="18" aria-hidden="true" />
              <span class="sr-only">
                {{ showConfirmPassword ? 'Hide password' : 'Show password' }}
              </span>
            </button>
          </template>
        </FormControl>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="btn--default btn--lg disabled:btn--disabled"
        >
          <span v-if="!isSubmitting">Confirm</span>
          <span v-else>Updating password...</span>
        </button>

        <RouterLink
          :to="{ name: 'login' }"
          class="btn--link flex items-center justify-center gap-2 text-sm"
        >
          <ArrowLeftIcon :size="18" />
          <span>Back to login</span>
        </RouterLink>
      </form>

      <div class="rounded-xl border border-gray-200 bg-blue-50 p-5 text-sm text-gray-800">
        <div class="mb-3 font-semibold text-blue-900">Security Best Practices</div>
        <ul class="list-disc space-y-2 pl-5 text-blue-900">
          <li>Use a unique password you haven't used on other websites.</li>
          <li>Avoid personal information like birthdays or names.</li>
          <li>Consider using a password manager to generate and store strong passwords.</li>
        </ul>
      </div>
    </div>
  </AuthCard>
</template>
