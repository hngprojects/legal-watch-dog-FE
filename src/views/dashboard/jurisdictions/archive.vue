<!-- pages/ArchivedJurisdictions.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useJurisdictionStore } from '@/stores/jurisdiction-store'
import { useOrganizationStore } from '@/stores/organization-store'
import Swal from 'sweetalert2'

const router = useRouter()
const jurisdictionStore = useJurisdictionStore()
const orgStore = useOrganizationStore()

const loading = ref(false)
const orgId = computed(() => orgStore.currentOrganizationId || undefined)

const archivedJurisdictions = computed(() => {
  return jurisdictionStore.archivedJurisdictions
})

onMounted(async () => {
  if (orgId.value) {
    loading.value = true
    try {
      await jurisdictionStore.syncArchivedFromLocalStorage(orgId.value)
    } catch (error) {
      console.error('Failed to load archived jurisdictions:', error)
    } finally {
      loading.value = false
    }
  } else {
    console.warn('No organization ID available')
  }
})

const restoreJurisdiction = async (jurisdictionId: string) => {
  const confirm = await Swal.fire({
    title: 'Restore Jurisdiction?',
    text: 'This will make the jurisdiction active again',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, restore it!',
    cancelButtonText: 'Cancel'
  })

  if (!confirm.isConfirmed) return

  try {
    loading.value = true
    
    if (!orgId.value) {
      throw new Error('No organization selected')
    }
    
    await jurisdictionStore.restoreJurisdiction(jurisdictionId, orgId.value)
    
    // Remove from localStorage backup
    const ids = JSON.parse(localStorage.getItem('archived_jurisdiction_ids') || '[]')
    const updatedIds = ids.filter((id: string) => id !== jurisdictionId)
    localStorage.setItem('archived_jurisdiction_ids', JSON.stringify(updatedIds))
    
    Swal.fire({
      title: 'Restored!', 
      text: 'Jurisdiction has been restored.',
      icon: 'success',
      timer: 2000
    })
  } catch (error) {
    console.error('Restore failed:', error)
    Swal.fire('Error', 'Failed to restore jurisdiction', 'error')
  } finally {
    loading.value = false
  }
}

const viewJurisdiction = (jurisdictionId: string) => {
  router.push({
    name: 'jurisdiction-detail',
    params: { id: jurisdictionId },
    query: { 
      organizationId: orgId.value,
      fromArchive: 'true' 
    }
  })
}

const permanentDelete = async (jurisdictionId: string) => {
  const confirm = await Swal.fire({
    title: 'Permanently Delete?',
    text: 'This will remove the jurisdiction from your archived list. The jurisdiction will still exist in the database but will no longer appear here.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, remove from archive',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#dc2626'
  })

  if (!confirm.isConfirmed) return

  try {
    jurisdictionStore.archivedJurisdictions = jurisdictionStore.archivedJurisdictions.filter(
      j => j.id !== jurisdictionId
    )

    const ids = JSON.parse(localStorage.getItem('archived_jurisdiction_ids') || '[]')
    const updatedIds = ids.filter((id: string) => id !== jurisdictionId)
    localStorage.setItem('archived_jurisdiction_ids', JSON.stringify(updatedIds))
    
    Swal.fire('Removed!', 'Jurisdiction has been removed from archived list.', 'success')
  } catch (error) {
    Swal.fire('Error', 'Failed to remove jurisdiction', 'error')
  }
}
</script>

<template>
  <main class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Archived Jurisdictions</h1>
            <p class="text-gray-600 mt-2">Manage your deleted jurisdictions</p>
          </div>
          <button 
            @click="$router.back()"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Back
          </button>
        </div>
      </div>

      <div v-if="!orgId" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <p class="text-yellow-800 text-sm">
            No organization selected. Please select an organization to view archived jurisdictions.
          </p>
        </div>
      </div>

      <div v-else-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="archivedJurisdictions.length === 0" class="text-center py-16">
        <div class="max-w-md mx-auto">
          <div class="w-20 h-20 mx-auto mb-6 text-gray-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-3">No Archived Jurisdictions</h3>
          <p class="text-gray-500 mb-6">Jurisdictions you delete will appear here for restoration.</p>
          <button 
            @click="$router.back()"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Active Jurisdictions
          </button>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-blue-800 text-sm">
              You have {{ archivedJurisdictions.length }} archived jurisdiction(s). 
              Restore them to make them active again.
            </p>
          </div>
        </div>

        <div
          v-for="jurisdiction in archivedJurisdictions"
          :key="jurisdiction.id"
          class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-3">
                  Archived
                </span>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ jurisdiction.name }}
                </h3>
              </div>
              
              <p class="text-gray-600 mb-3">{{ jurisdiction.description }}</p>
              
              <div class="flex items-center space-x-4 text-sm text-gray-500">
                <span>Created: {{ new Date(jurisdiction.created_at).toLocaleDateString() }}</span>
                <span>•</span>
                <span v-if="jurisdiction.deleted_at">
                  Archived: {{ new Date(jurisdiction.deleted_at).toLocaleDateString() }}
                </span>
              </div>
            </div>

            <div class="flex items-center space-x-2 ml-6">
              <button
                @click="viewJurisdiction(jurisdiction.id)"
                class="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                View
              </button>
              <button
                @click="restoreJurisdiction(jurisdiction.id)"
                class="px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                Restore
              </button>
              <button
                @click="permanentDelete(jurisdiction.id)"
                class="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
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