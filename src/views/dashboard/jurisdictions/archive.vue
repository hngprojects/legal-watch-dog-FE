<script setup lang="ts">
import { onMounted } from 'vue'
import { useJurisdictionStore } from '@/stores/jurisdiction-store'
import { useOrganizationStore } from '@/stores/organization-store'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const jurisdictionStore = useJurisdictionStore()
const orgStore = useOrganizationStore()

const orgId = orgStore.currentOrganizationId

onMounted(() => {
  jurisdictionStore.fetchJurisdictions(undefined, orgId)
})

const restoreItem = async (id: string) => {
  const confirm = await Swal.fire({
    title: 'Restore?',
    showCancelButton: true,
  })

  if (!confirm.isConfirmed) return

  await jurisdictionStore.restoreJurisdiction(id, orgId)

  Swal.fire('Restored!', '', 'success')
}
</script>

<template>
  <main class="p-8">
    <h1 class="mb-6 text-2xl font-bold">Archived Jurisdictions</h1>

    <div
      v-if="jurisdictionStore.archivedJurisdictions.length === 0"
      class="rounded-lg border border-dashed p-6 text-center text-gray-500"
    >
      No archived jurisdictions.
    </div>

    <div class="space-y-4">
      <div
        v-for="j in jurisdictionStore.archivedJurisdictions"
        :key="j.id"
        class="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm"
      >
        <div>
          <p class="text-lg font-semibold text-gray-900">{{ j.name }}</p>
          <p class="text-sm text-gray-500">{{ j.description }}</p>
          <p class="mt-1 text-xs text-gray-400">
            Deleted: {{ new Date(j.deleted_at!).toLocaleString() }}
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            class="rounded-lg bg-green-600 px-3 py-1 text-sm font-medium text-white"
            @click="restoreItem(j.id)"
          >
            Restore
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
