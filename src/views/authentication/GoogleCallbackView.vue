<script setup lang="ts">
import { authService } from '@/api/auth'
import { useAuthStore } from '@/stores/auth-store'
import { isAxiosError } from 'axios'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

type ViewStatus = 'working' | 'error'

const router = useRouter()
const authStore = useAuthStore()

const status = ref<ViewStatus>('working')
const errorMessage = ref('')
const errorDetail = ref('')

const parseOauthParams = () => {
  const hashParams = new URLSearchParams(
    window.location.hash && window.location.hash.startsWith('#')
      ? window.location.hash.slice(1)
      : window.location.hash,
  )
  const queryParams = new URLSearchParams(
    window.location.search && window.location.search.startsWith('?')
      ? window.location.search.slice(1)
      : window.location.search,
  )

  const getParam = (key: string) => queryParams.get(key) ?? hashParams.get(key)

  return {
    accessToken: getParam('access_token'),
    refreshToken: getParam('refresh_token'),
    tokenType: getParam('token_type'),
    expiresIn: getParam('expires_in'),
    idToken: getParam('id_token'),
    state: getParam('state'),
    isNewUser: getParam('is_new_user'),
    error: getParam('error'),
    errorDescription:
      getParam('error_description') ?? getParam('message') ?? getParam('detail'),
  }
}

const tryFetchGoogleProfile = async () => {
  try {
    const response = await authService.getGoogleProfile()
    const payload = response.data?.data ?? response.data
    const maybeUser =
      payload && typeof payload === 'object' && 'user' in payload
        ? (payload as { user?: unknown }).user
        : payload

    const email =
      (maybeUser as { email?: string | null })?.email ||
      (payload as { email?: string | null })?.email
    if (email) authStore.setUserEmail(email, true)

    return maybeUser ?? null
  } catch (error) {
    if (isAxiosError(error)) {
      errorDetail.value =
        (error.response?.data as { message?: string; detail?: string })?.message ??
        errorDetail.value
    }
    return null
  }
}

const finishGoogleLogin = async () => {
  const params = parseOauthParams()

  if (params.error) {
    status.value = 'error'
    errorMessage.value = 'Google sign-in could not be completed.'
    errorDetail.value = params.errorDescription ?? params.error
    return
  }

  if (!params.accessToken) {
    status.value = 'error'
    errorMessage.value = 'Google sign-in did not return an access token.'
    errorDetail.value = params.errorDescription ?? ''
    return
  }

  try {
    authStore.handleLoginSuccess(params.accessToken, true)

    const profileUser = await tryFetchGoogleProfile()
    if (profileUser) {
      authStore.handleLoginSuccess(params.accessToken, true, profileUser as never)
    } else {
      await authStore.loadCurrentUser()
    }

    const isNewUser = params.isNewUser === 'true'
    if (isNewUser) {
      await router.replace({
        name: 'auth-status',
        query: { status: 'success', context: 'signup', redirect: 'organizations' },
      })
    } else {
      await router.replace({ name: 'organizations' })
    }
  } catch (error) {
    status.value = 'error'
    errorMessage.value = 'We could not finish signing you in with Google.'
    if (isAxiosError(error)) {
      errorDetail.value =
        (error.response?.data as { message?: string; detail?: string })?.message ??
        errorDetail.value
    } else {
      errorDetail.value = (error as Error)?.message || errorDetail.value
    }
  }
}

onMounted(finishGoogleLogin)

const goToLogin = () => router.replace({ name: 'login' })
</script>

<template>
  <div class="flex min-h-[70vh] items-center justify-center px-4 py-10">
    <div class="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full"
          :class="status === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'"
        >
          <svg
            v-if="status === 'error'"
            class="h-5 w-5"
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
          <svg
            v-else
            class="h-5 w-5 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" class="opacity-25" />
            <path d="M22 12a10 10 0 0 1-10 10" />
          </svg>
        </div>
        <div>
          <p class="text-lg font-semibold text-gray-900">
            {{ status === 'error' ? 'Google sign-in failed' : 'Finishing Google sign-in' }}
          </p>
          <p class="text-sm text-gray-600">
            {{
              status === 'error'
                ? 'We could not complete your Google login.'
                : 'Please wait while we finalize your session.'
            }}
          </p>
        </div>
      </div>

      <div
        v-if="status === 'error'"
        class="mt-4 rounded-lg border border-red-100 bg-red-50/70 p-4 text-sm text-red-700"
      >
        <p class="font-semibold">
          {{ errorMessage || 'We could not finish signing you in with Google.' }}
        </p>
        <p v-if="errorDetail" class="mt-1">
          {{ errorDetail }}
        </p>
      </div>

      <div class="mt-6 flex gap-3">
        <button
          v-if="status === 'error'"
          type="button"
          class="btn btn--primary w-full"
          @click="goToLogin"
        >
          Back to Login
        </button>
        <button
          v-else
          type="button"
          class="btn btn--primary w-full cursor-not-allowed opacity-80"
          disabled
        >
          Connecting...
        </button>
      </div>
    </div>
  </div>
</template>
