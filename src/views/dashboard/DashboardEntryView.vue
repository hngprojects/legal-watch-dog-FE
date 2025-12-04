<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth-store'
import { useOrganizationStore } from '@/stores/organization-store'

const router = useRouter()
const authStore = useAuthStore()
const organizationStore = useOrganizationStore()

const loading = ref(true)
const message = ref('Loading your organizations...')

const goToDefaultDestination = async () => {
  loading.value = true
  message.value = 'Loading your organizations...'
  try {
    let userId = authStore.user?.id
    if (!userId) {
      const user = await authStore.loadCurrentUser?.()
      userId = user?.id
    }

    if (userId && !organizationStore.organizations.length) {
      await organizationStore.fetchOrganizations(userId, { prefetchSecondPage: false })
    }

    const targetOrg = organizationStore.currentOrganization
    if (targetOrg?.id) {
      message.value = 'Redirecting to your latest projects...'
      await router.replace({
        name: 'organization-projects',
        params: { organizationId: targetOrg.id },
      })
      return
    }

    message.value = 'No organizations yet. Redirecting to create one...'
    await router.replace({ name: 'organizations' })
  } catch (error) {
    void error
    message.value = 'Unable to load organizations. Redirecting...'
    await router.replace({ name: 'organizations' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  void goToDefaultDestination()
})
</script>

<template>
  <section class="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md rounded-2xl bg-white px-6 py-10 text-center shadow-sm ring-1 ring-gray-100">
      <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#401903]"></div>
      <p class="text-sm font-medium text-gray-800">{{ message }}</p>
      <p v-if="!loading" class="mt-2 text-xs text-gray-500">
        If you're not redirected automatically, please navigate to Organizations.
      </p>
    </div>
  </section>
</template>
