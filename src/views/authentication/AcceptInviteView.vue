<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth-store'
import { useInvitationStore } from '@/stores/invitation-store'
import { useInvitationPrompt } from '@/composables/useInvitationPrompt'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const invitationStore = useInvitationStore()
const { promptToAcceptInvite } = useInvitationPrompt()
const { confirm: openConfirm } = useConfirmDialog()

const accepting = ref(false)

onMounted(async () => {
  const token = typeof route.params.token === 'string' ? route.params.token : ''
  if (!token) {
    toast.error('Invalid invitation link. No invitation token found.')
    router.replace({ name: 'home' })
    return
  }

  invitationStore.setToken(token)
  authStore.syncAuthFromStorage()

  // If already authenticated → go straight to accepting flow
  if (authStore.isAuthenticated) {
    await promptToAcceptInvite(token, {
      onProcessingChange: (isProcessing) => {
        accepting.value = isProcessing
      },
    })
    return
  }

  // Otherwise show confirm dialog with Login / Signup / Cancel options
  openConfirm({
    title: 'Sign in to accept invite',
    description:
      'To accept this invitation, please sign in. If you already have an account, login; otherwise create one.',
    confirmText: 'Login',
    cancelText: 'Maybe later',
    onCancel() {
      router.replace({ name: 'home' })
    },
    async onConfirm() {
      router.push({ name: 'login', query: { redirect: route.fullPath } })
    },
  })

  // Add "Sign up" as a *secondary action* using a second confirm after cancel
  openConfirm({
    title: 'Don’t have an account?',
    description: 'Create an account to continue with your invitation.',
    confirmText: 'Sign up',
    cancelText: 'Back',
    onConfirm() {
      router.push({ name: 'signup', query: { redirect: route.fullPath } })
    },
  })
})
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
    <div class="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-200">
      <div
        class="mx-auto mb-4 h-12 w-12 rounded-full bg-orange-100 text-2xl font-bold text-[#401903]"
      >
        <div class="flex h-full items-center justify-center">WD</div>
      </div>
      <h1 class="text-xl font-semibold text-gray-900">Processing invitation</h1>
      <p class="mt-2 text-sm text-gray-600">
        {{
          accepting
            ? 'Hang tight while we confirm your invitation...'
            : 'Follow the prompts to continue.'
        }}
      </p>
    </div>
  </main>
</template>
