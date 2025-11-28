<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useAuthStore } from '@/stores/auth-store'
import { useInvitationStore } from '@/stores/invitation-store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const invitationStore = useInvitationStore()

const accepting = ref(false)

const processInvite = async (token: string, silent = false) => {
  accepting.value = true
  try {
    const result = await invitationStore.acceptInvitation(token)
    if (!silent) {
      await Swal.fire('Invitation Accepted', result, 'success')
    }
    router.replace({ name: 'organizations' })
  } catch (err) {
    void err
    if (!silent) {
      await Swal.fire('Could not accept invitation', invitationStore.error || 'Something went wrong', 'error')
    }
  } finally {
    accepting.value = false
  }
}

onMounted(async () => {
  const token = typeof route.params.token === 'string' ? route.params.token : ''
  if (!token) {
    await Swal.fire('Invalid invitation link', 'No invitation token found.', 'error')
    router.replace({ name: 'home' })
    return
  }

  invitationStore.setToken(token)

  if (authStore.isAuthenticated) {
    await processInvite(token, true)
    return
  }

  const result = await Swal.fire({
    title: 'Sign in to accept invite',
    text: 'Login or create an account to accept and view your invitations.',
    icon: 'info',
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Login',
    denyButtonText: 'Sign up',
    cancelButtonText: 'Maybe later',
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
      <div class="mx-auto mb-4 h-12 w-12 rounded-full bg-orange-100 text-2xl font-bold text-[#401903]">
        <div class="flex h-full items-center justify-center">WD</div>
      </div>
      <h1 class="text-xl font-semibold text-gray-900">Processing invitation</h1>
      <p class="mt-2 text-sm text-gray-600">
        {{ accepting ? 'Hang tight while we confirm your invitation...' : 'Follow the prompts to continue.' }}
      </p>
    </div>
  </main>
</template>
