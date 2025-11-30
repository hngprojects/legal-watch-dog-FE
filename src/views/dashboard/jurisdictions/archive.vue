<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useJurisdictionStore } from '@/stores/jurisdiction-store'
import { useOrganizationStore } from '@/stores/organization-store'
import Swal from '@/lib/swal'

const jurisdictionStore = useJurisdictionStore()
const orgStore = useOrganizationStore()

const loading = ref(false)
const orgId = computed(() => orgStore.currentOrganizationId || undefined)

const archivedJurisdictions = computed(() => {
  return jurisdictionStore.archivedJurisdictions
})

onMounted(() => {
  console.log('🏢 Archived component mounted')

  // Use initializeArchived instead of syncArchivedFromLocalStorage
  jurisdictionStore.initializeArchived()

  console.log('📊 Archived items:', jurisdictionStore.archivedJurisdictions)
})

const restoreJurisdiction = async (jurisdictionId: string) => {
  const confirm = await Swal.fire({
    title: 'Restore Jurisdiction?',
    text: 'This will make the jurisdiction active again',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, restore it!',
    cancelButtonText: 'Cancel',
  })

  if (!confirm.isConfirmed) return

  try {
    loading.value = true

    if (!orgId.value) {
      throw new Error('No organization selected')
    }

    await jurisdictionStore.restoreJurisdiction(jurisdictionId, orgId.value)

    Swal.fire({
      title: 'Restored!',
      text: 'Jurisdiction has been restored.',
      icon: 'success',
      timer: 2000,
    })
  } catch (error) {
    console.error('Restore failed:', error)
    Swal.fire('Error', 'Failed to restore jurisdiction', 'error')
  } finally {
    loading.value = false
  }
}

const permanentDelete = async (jurisdictionId: string) => {
  const confirm = await Swal.fire({
    title: 'Remove from Archive?',
    text: 'This will remove the jurisdiction from your archived list.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, remove it',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#dc2626',
  })

  if (!confirm.isConfirmed) return

  try {
    // Remove from store
    jurisdictionStore.archivedJurisdictions = jurisdictionStore.archivedJurisdictions.filter(
      (j) => j.id !== jurisdictionId,
    )

    // Remove from localStorage
    const ids = JSON.parse(localStorage.getItem('archived_jurisdiction_ids') || '[]')
    const updatedIds = ids.filter((id: string) => id !== jurisdictionId)
    localStorage.setItem('archived_jurisdiction_ids', JSON.stringify(updatedIds))
    localStorage.removeItem(`archived_jurisdiction_${jurisdictionId}`)

    Swal.fire('Removed!', 'Jurisdiction has been removed from archived list.', 'success')
  } catch {
    Swal.fire('Error', 'Failed to remove jurisdiction', 'error')
  }
}
</script>

<template>
  <main class="min-h-screen bg-gray-50 p-6">
    <div class="mx-auto max-w-6xl">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Archived Jurisdictions</h1>
            <p class="mt-2 text-gray-600">Manage your deleted jurisdictions</p>
          </div>
          <button
            @click="$router.back()"
            class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>

      <div v-if="!orgId" class="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div class="flex items-center">
          <svg
            class="mr-3 h-5 w-5 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p class="text-sm text-yellow-800">
            No organization selected. Please select an organization to view archived jurisdictions.
          </p>
        </div>
      </div>

      <div v-else-if="loading" class="flex items-center justify-center py-12">
        <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="archivedJurisdictions.length === 0" class="py-16 text-center">
        <div class="mx-auto max-w-md">
          <div class="mx-auto mb-6 h-20 w-20 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h3 class="mb-3 text-xl font-semibold text-gray-900">No Archived Jurisdictions</h3>
          <p class="mb-6 text-gray-500">
            Jurisdictions you delete will appear here for restoration.
          </p>
          <button
            @click="$router.back()"
            class="rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white"
          >
            Return to Active Jurisdictions
          </button>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div class="flex items-center">
            <svg
              class="mr-3 h-5 w-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="text-sm text-blue-800">
              You have {{ archivedJurisdictions.length }} archived jurisdiction(s). Restore them to
              make them active again.
            </p>
          </div>
        </div>

        <div
          v-for="jurisdiction in archivedJurisdictions"
          :key="jurisdiction.id"
          class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="mb-2 flex items-center">
                <span
                  class="mr-3 inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800"
                >
                  Archived
                </span>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ jurisdiction.name }}
                </h3>
              </div>

              <p class="mb-3 text-gray-600">{{ jurisdiction.description }}</p>

              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span>Created: {{ new Date(jurisdiction.created_at).toLocaleDateString() }}</span>
                <span>•</span>
                <span v-if="jurisdiction.deleted_at">
                  Archived: {{ new Date(jurisdiction.deleted_at).toLocaleDateString() }}
                </span>
              </div>
            </div>

            <div class="ml-6 flex items-center space-x-2">
              <button
                @click="restoreJurisdiction(jurisdiction.id)"
                class="rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white"
              >
                Restore
              </button>
              <button
                @click="permanentDelete(jurisdiction.id)"
                class="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
