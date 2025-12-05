<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from '@/lib/swal'
import { useAuthStore } from '@/stores/auth-store'
import { useInvitationStore } from '@/stores/invitation-store'
import { useInvitationPrompt } from '@/composables/useInvitationPrompt'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const invitationStore = useInvitationStore()
const { promptToAcceptInvite } = useInvitationPrompt()

const accepting = ref(false)

onMounted(async () => {
  const token = typeof route.params.token === 'string' ? route.params.token : ''
  if (!token) {
    await Swal.fire('Invalid invitation link', 'No invitation token found.', 'error')
    router.replace({ name: 'home' })
    return
  }

  invitationStore.setToken(token)
  authStore.syncAuthFromStorage()

  if (authStore.isAuthenticated) {
    await promptToAcceptInvite(token, {
      onProcessingChange: (isProcessing) => {
        accepting.value = isProcessing
      },
    })
    return
  }

  const result = await Swal.fire({
    title: 'Sign in to accept invite',
    text: 'To accept this invitation, please sign in. If you already have an account, log in; otherwise create one.',
    icon: 'info',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Login',
    denyButtonText: 'Sign up',
    cancelButtonText: 'Maybe later',
    customClass: {
      actions: 'flex flex-wrap gap-2',
      denyButton: 'btn--default btn--sm md:btn--lg',
      confirmButton: 'btn--default btn--sm md:btn--lg',
      cancelButton: 'btn--secondary btn--sm md:btn--lg',
    },
  })

  if (result.isConfirmed) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
  } else if (result.isDenied) {
    router.push({ name: 'signup', query: { redirect: route.fullPath } })
  } else {
    router.replace({ name: 'home' })
  }
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
