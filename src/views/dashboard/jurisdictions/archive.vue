<script setup lang="ts">
import { onMounted } from 'vue'
import { useJurisdictionStore } from '@/stores/jurisdiction-store'
import { useOrganizationStore } from '@/stores/organization-store'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const jurisdictionStore = useJurisdictionStore()
const orgStore = useOrganizationStore()

const orgId: string | undefined = orgStore.currentOrganizationId || undefined
onMounted(() => {
  console.log('🏢 Archived component mounted, orgId:', orgId)

  jurisdictionStore.fetchArchived(undefined, orgId)

  console.log('📊 Archived items from store:', jurisdictionStore.archivedJurisdictions)
})


const restoreItem = async (id: string) => {
  const confirm = await Swal.fire({
    title: 'Restore?',
    icon: 'warning',
    showCancelButton: true,
  })

  if (!confirm.isConfirmed) return

  await jurisdictionStore.restoreJurisdiction(id, orgId)

  await jurisdictionStore.fetchJurisdictions(undefined, orgId)

  Swal.fire({
    title: 'Restored!',
    icon: 'success',
  }).then(() => {
    router.push({ name: 'jurisdictions' })
  })
}
</script>

<template>
  <main class="p-8">
    <!-- Page Title + Go Back -->
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold">Archived Jurisdictions</h1>

      <button
        class="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
        @click="router.back()"
      >
        ← Go Back
      </button>
    </div>

    <!-- EMPTY STATE -->
    <div
      v-if="jurisdictionStore.archivedJurisdictions.length === 0"
      class="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center text-gray-500"
    >
      <p class="mb-4 text-lg">No archived jurisdictions.</p>

      <button
        class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
        @click="router.back()"
      >
        ← Go Back
      </button>
    </div>

    <!-- LIST STATE -->
    <div v-else class="space-y-4">
      <div
        v-for="j in jurisdictionStore.archivedJurisdictions"
        :key="j.id"
        class="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm"
      >
        <div>
          <p class="text-lg font-semibold text-gray-900">{{ j.name }}</p>
          <p class="text-sm text-gray-500">{{ j.description }}</p>

          <p class="mt-1 text-xs text-gray-400" v-if="j.deleted_at">
            Deleted: {{ new Date(j.deleted_at).toLocaleString() }}
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

      <!-- Go Back below the list -->
      <div class="pt-4">
        <button
          class="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          @click="router.back()"
        >
          ← Go Back
        </button>
      </div>
    </div>
  </main>
</template>
