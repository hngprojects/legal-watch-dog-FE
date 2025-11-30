<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from '@/lib/swal'
import { useAuthStore } from '@/stores/auth-store'
import { useInvitationStore } from '@/stores/invitation-store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const invitationStore = useInvitationStore()

const token = computed(() => (typeof route.params.token === 'string' ? route.params.token : ''))
const loading = ref(true)
const statusMessage = ref('Preparing invitation...')

const redirectHome = () => {
  router.replace(authStore.isAuthenticated ? { name: 'dashboard' } : { name: 'login' })
}

const promptAuth = async () => {
  const choice = await Swal.fire({
    title: 'Sign in required',
    text: 'Log in or sign up to accept this invitation.',
    icon: 'info',
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: 'Log in',
    denyButtonText: 'Sign up',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
  })

  if (choice.isConfirmed) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return true
  }
  if (choice.isDenied) {
    router.push({ name: 'signup', query: { redirect: route.fullPath } })
    return true
  }
  redirectHome()
  return false
}

const acceptInvite = async () => {
  if (!token.value) {
    await Swal.fire('Invalid invitation', 'This invitation link is missing a token.', 'error')
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
    await Swal.fire(
      'Invitation accepted',
      result || 'You now have access to this organization.',
      'success',
    )
    router.replace({ name: 'organizations' })
  } catch (error) {
    void error
    await Swal.fire(
      'Could not accept invitation',
      invitationStore.error || 'Please try again or request a new invite.',
      'error',
    )
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
        class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#401903]/20 border-t-[#401903]"
        v-if="loading"
      ></div>
      <p class="text-sm font-medium text-gray-700">
        {{ statusMessage }}
      </p>
    </div>
  </main>
</template>
