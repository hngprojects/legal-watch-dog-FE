<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Plus, Search, X } from 'lucide-vue-next'
import { useJurisdictionStore } from '@/stores/jurisdiction-store'
import Swal from 'sweetalert2'
import type { Jurisdiction } from '@/api/jurisdiction'

const props = defineProps<{
  jurisdictionId: string
}>()

const jurisdictionStore = useJurisdictionStore()
const instructions = ref('')
const loading = ref(false)
const saving = ref(false)
const isSearching = ref(false)
const searchQuery = ref('')

interface SourceItem {
  id: string
  url: string
  added: boolean
}

const searchResults = ref<SourceItem[]>([])
const savedSources = ref<SourceItem[]>([])

const loadData = async () => {
  loading.value = true
  if (!props.jurisdictionId) {
    loading.value = false
    return
  }

  try {
    const jurisdiction: Jurisdiction | null = await jurisdictionStore.fetchOne(props.jurisdictionId)
    if (jurisdiction) {
      instructions.value = jurisdiction.prompt || ''
      savedSources.value = (jurisdiction.sources ?? []).map((url: string, i: number) => ({
        id: `saved-${i}`,
        url,
        added: true,
      }))
    }
  } catch (err) {
    console.error('Failed to load jurisdiction data:', err)
  } finally {
    loading.value = false
  }
}

const handleSaveInstructions = async () => {
  saving.value = true
  try {
    await jurisdictionStore.updateJurisdiction(props.jurisdictionId, {
      prompt: instructions.value,
    })

    await Swal.fire({
      title: 'Saved',
      text: 'Instructions updated successfully',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    })
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string }
    const msg = err.response?.data?.message || err.message || 'Failed to save instructions'
    Swal.fire('Error', msg, 'error')
  } finally {
    saving.value = false
  }
}

const toggleAddSource = (id: string) => {
  const item = searchResults.value.find((i) => i.id === id)
  if (item) item.added = !item.added
}

const removeSearchResult = (id: string) => {
  searchResults.value = searchResults.value.filter((i) => i.id !== id)
}

const removeSavedSource = (id: string) => {
  savedSources.value = savedSources.value.filter((i) => i.id !== id)
  const searchItem = searchResults.value.find((i) => i.id === id)
  if (searchItem) searchItem.added = false
}

const handleSaveSearch = () => {
  const newSources = searchResults.value.filter((item) => item.added)
  newSources.forEach((newItem) => {
    if (!savedSources.value.some((saved) => saved.id === newItem.id)) {
      savedSources.value.push({ ...newItem })
    }
  })

  isSearching.value = false
  searchQuery.value = ''
}

onMounted(loadData)

watch(
  () => props.jurisdictionId,
  (newVal) => {
    if (newVal) loadData()
  },
)
</script>

<template>
  <div>
    <div v-if="!isSearching" class="flex flex-col">
      <div class="px-6 py-6">
        <div class="space-y-3">
          <label class="block text-sm font-medium text-[#1F1F1F]">Instructions</label>
          <div class="relative">
            <textarea
              v-model="instructions"
              rows="6"
              placeholder="Enter a brief description of what this source contains"
              class="w-full resize-none rounded-lg border border-[#E5E7EB] bg-white p-4 text-sm text-[#1F1F1F] placeholder-[#9CA3AF] shadow-sm focus:border-[#401903] focus:ring-1 focus:ring-[#401903] focus:outline-none"
            />
          </div>
          <div class="flex justify-end">
            <button
              @click="handleSaveInstructions"
              :disabled="saving"
              class="rounded-lg bg-[#401903] px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2a1102] disabled:opacity-70"
            >
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </div>

      <div class="rounded-b-2xl border-t border-gray-100 bg-white px-6 py-8">
        <div class="mb-6 flex items-center justify-between">
          <h3 class="text-sm font-bold text-[#1F1F1F]">Data Sources</h3>
          <button
            @click="isSearching = true"
            class="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#401903] transition-colors hover:bg-gray-50"
          >
            <Plus :size="16" class="text-[#401903]" />
            Find New Sources
          </button>
        </div>

        <div v-if="savedSources.length > 0" class="space-y-3">
          <div
            v-for="source in savedSources"
            :key="source.id"
            class="flex items-center justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div class="flex flex-col">
              <span class="text-sm font-medium text-[#1F1F1F]">{{ source.url }}</span>
              <span class="text-xs text-gray-400">{{ source.url }}</span>
            </div>
            <div class="flex items-center gap-4">
              <input
                type="checkbox"
                class="h-5 w-5 rounded border-gray-300 text-[#401903] focus:ring-[#401903]"
              />
              <button
                @click="removeSavedSource(source.id)"
                class="text-gray-400 transition-colors hover:text-gray-600"
              >
                <X :size="20" />
              </button>
            </div>
          </div>
        </div>

        <div v-else class="py-4 text-center text-sm text-gray-500">
          No sources added yet. Click "Find New Sources" to begin.
        </div>
      </div>
    </div>

    <div v-else class="rounded-2xl bg-white p-8 shadow-sm">
      <div class="space-y-6">
        <div class="relative">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search class="h-5 w-5 text-gray-400" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="UK Visa"
            class="h-12 w-full rounded-lg border border-gray-200 bg-white pr-4 pl-11 text-sm text-gray-900 placeholder-gray-400 focus:border-[#401903] focus:ring-1 focus:ring-[#401903] focus:outline-none"
          />
        </div>

        <div class="space-y-3">
          <div
            v-for="item in searchResults"
            :key="item.id"
            class="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm transition-colors hover:border-gray-200"
          >
            <span class="text-sm text-gray-600">{{ item.url }}</span>
            <div class="flex items-center gap-4">
              <button
                @click="removeSearchResult(item.id)"
                class="text-gray-400 hover:text-gray-600"
              >
                <X :size="18" />
              </button>
              <button
                @click="toggleAddSource(item.id)"
                class="h-9 w-[70px] rounded border text-sm font-medium transition-all"
                :class="
                  item.added
                    ? 'border-transparent bg-[#12B76A] text-white'
                    : 'border-gray-200 bg-transparent text-[#401903] hover:bg-gray-50'
                "
              >
                {{ item.added ? 'Added' : 'Add' }}
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <button
            @click="handleSaveSearch"
            class="rounded-lg bg-[#401903] px-8 py-2.5 text-sm font-medium text-white hover:bg-[#2a1102]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
