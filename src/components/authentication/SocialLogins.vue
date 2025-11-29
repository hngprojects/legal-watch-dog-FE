<script setup lang="ts">
import { authService } from '@/api/auth'
import { isAxiosError } from 'axios'
import { ref } from 'vue'

const baseButtonClass =
  'flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-[0_1px_0_rgba(16,24,40,0.04)] transition hover:-translate-y-0.5 hover:shadow-sm sm:w-auto sm:min-w-[180px] cursor-pointer'

const microsoftRedirectUri = import.meta.env.VITE_MICROSOFT_REDIRECT_URI

const isMicrosoftLoading = ref(false)
const socialError = ref('')

const handleMicrosoftLogin = async () => {
  if (isMicrosoftLoading.value) return

  socialError.value = ''
  isMicrosoftLoading.value = true
  const defaultError = 'Unable to start Microsoft login. Please try again.'

  try {
    const { data } = await authService.getMicrosoftLoginUrl(microsoftRedirectUri)
    const authorizationUrl = data?.authorization_url

    if (!authorizationUrl) {
      throw new Error('Authorization URL missing from response.')
    }

    window.location.href = authorizationUrl
  } catch (error) {
    if (isAxiosError(error)) {
      const responseData = (error.response?.data ?? {}) as {
        message?: string
        detail?: string
        error?: string
      }
      socialError.value =
        responseData.message || responseData.detail || responseData.error || defaultError
    } else {
      socialError.value = defaultError
    }
  } finally {
    isMicrosoftLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        :class="baseButtonClass"
      >
        <img src="/images/google.png" alt="Google" class="h-5 w-5" />
        <span>Google</span>
      </button>

      <button
        type="button"
        :class="baseButtonClass"
      >
        <img src="/images/apple.png" alt="Apple" class="h-5 w-5" />
        <span>Apple</span>
      </button>

      <button
        type="button"
        :class="[baseButtonClass, { 'cursor-not-allowed opacity-60': isMicrosoftLoading }]"
        :disabled="isMicrosoftLoading"
        @click="handleMicrosoftLogin"
      >
        <img src="/images/microsoft.png" alt="Microsoft" class="h-5 w-5" />
        <span>{{ isMicrosoftLoading ? 'Connecting...' : 'Microsoft' }}</span>
      </button>
    </div>

    <p v-if="socialError" class="text-sm text-red-600 mt-4 text-center">
      {{ socialError }}
    </p>
  </div>
</template>
