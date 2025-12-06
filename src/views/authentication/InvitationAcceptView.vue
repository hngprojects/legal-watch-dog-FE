<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth-store'
import { useInvitationStore } from '@/stores/invitation-store'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const invitationStore = useInvitationStore()
const { confirm: openConfirm } = useConfirmDialog()

const token = computed(() => (typeof route.params.token === 'string' ? route.params.token : ''))
const loading = ref(true)
const statusMessage = ref('Preparing invitation...')

const redirectHome = () => {
  router.replace(authStore.isAuthenticated ? { name: 'dashboard' } : { name: 'login' })
}

const promptAuth = () => {
  return new Promise<boolean>((resolve) => {
    openConfirm({
      title: 'Sign in required',
      description: 'Log in or sign up to accept this invitation.',
      confirmText: 'Log in',
      cancelText: 'Cancel',
      async onConfirm() {
        router.push({ name: 'login', query: { redirect: route.fullPath } })
        resolve(true)
      },
      onCancel() {
        /* After cancel, offer Sign Up as a secondary dialog */
        openConfirm({
          title: 'Don’t have an account?',
          description: 'Create an account to continue with your invitation.',
          confirmText: 'Sign up',
          cancelText: 'Back',
          onConfirm() {
            router.push({ name: 'signup', query: { redirect: route.fullPath } })
            resolve(true)
          },
          onCancel() {
            redirectHome()
            resolve(false)
          },
        })
      },
    })
  })
}

const acceptInvite = async () => {
  if (!token.value) {
    toast.error('Invalid invitation link. Token missing.')
    redirectHome()
    return
  }

  if (!authStore.isAuthenticated) {
    const navigated = await promptAuth()
    if (navigated) return
  }

  try {
    statusMessage.value = 'Accepting invitation...'

    const result = await invitationStore.acceptInvitation(token.value)

    toast.success(result || 'Invitation accepted! 🎉')

    router.replace({ name: 'organizations' })
  } catch {
    toast.error(invitationStore.error || 'Could not accept invitation. Please try again.')
    redirectHome()
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void acceptInvite()
})
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-[#f8f7f5] px-6 py-12">
    <div
      class="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-md ring-1 ring-gray-100"
    >
      <div
        v-if="loading"
        class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#401903]/20 border-t-[#401903]"
      ></div>

      <p class="text-sm font-medium text-gray-700">
        {{ statusMessage }}
      </p>
    </div>
  </main>
</template>
