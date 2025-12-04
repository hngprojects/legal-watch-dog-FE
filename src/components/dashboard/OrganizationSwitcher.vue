<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth-store'
import { useOrganizationStore } from '@/stores/organization-store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const organizationStore = useOrganizationStore()
const { organizations, loading } = storeToRefs(organizationStore)

const hasOrganizations = computed(() => organizations.value.length > 0)
const syncWithRouteOrganization = () => {
  const routeId = route.params.organizationId
  if (typeof routeId === 'string' && routeId) {
    organizationStore.setCurrentOrganization(routeId)
  }
}

const selectedOrganizationId = computed({
  get: () => {
    const routeId = route.params.organizationId
    if (typeof routeId === 'string' && routeId) return routeId
    return organizationStore.currentOrganizationId || ''
  },
  set: async (value: string) => {
    if (!value) return
    organizationStore.setCurrentOrganization(value)

    if (
      route.name === 'organization-projects' &&
      route.params.organizationId === value
    ) {
      return
    }

    await router.push({
      name: 'organization-projects',
      params: { organizationId: value },
    })
  },
})

const ensureOrganizations = async () => {
  if (!authStore.isAuthenticated) return
  if (organizations.value.length || loading.value) return

  let userId = authStore.user?.id
  if (!userId) {
    const user = await authStore.loadCurrentUser?.()
    userId = user?.id
  }

  if (userId) {
    await organizationStore.fetchOrganizations(userId, { prefetchSecondPage: false })
  }

  syncWithRouteOrganization()
}

onMounted(() => {
  void ensureOrganizations()
})

watch(
  () => route.params.organizationId,
  (newId) => {
    if (typeof newId === 'string' && newId) {
      organizationStore.setCurrentOrganization(newId)
    }
  },
)

watch(
  () => organizations.value.length,
  () => syncWithRouteOrganization(),
)
</script>

<template>
  <div class="flex items-center gap-2">
    <Select v-model="selectedOrganizationId" :disabled="loading || !hasOrganizations">
      <SelectTrigger
        class="h-10 w-full text-sm font-semibold text-gray-800 hover:border-accent-main focus:border-accent-main focus:ring-1 focus:ring-accent-main/20 lg:w-60 cursor-pointer border border-transparent hover:border-2 hover:shadow-md rounded-sm"
      >
        <SelectValue
          :placeholder="loading ? 'Loading...' : hasOrganizations ? 'Select organization' : 'No organizations'"
        />
      </SelectTrigger>
      <SelectContent align="start" class="w-60">
        <SelectItem
          v-for="org in organizations"
          :key="org.id"
          :value="org.id"
          class="font-medium text-gray-800 cursor-pointer"
        >
          {{ org.name || 'Organization' }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
