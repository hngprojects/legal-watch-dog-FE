<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Check, X, Loader2 } from 'lucide-vue-next'
import Swal from '@/lib/swal'
import aiIcon from '@/assets/icons/ai_icon.png'
import { sourceApi } from '@/api/source'
import type { SuggestedSource, SuggestSourcesRequest } from '@/types/source'

const props = defineProps<{
  jurisdictionId: string
  jurisdictionName: string
  jurisdictionDescription: string
  projectDescription: string
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'save', count: number): void
  (e: 'sources-added'): void
}>()

interface DisplaySource extends SuggestedSource {
  id: number
  added: boolean
}

const suggestions = ref<DisplaySource[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const retryCount = ref(0)
const maxRetries = 2
let idCounter = 1

const loadSuggestions = async (attempt = 1): Promise<void> => {
  if (!props.jurisdictionName || !props.jurisdictionDescription || !props.projectDescription) {
    error.value = 'Missing context to generate suggestions.'
    loading.value = false
    return
  }

  const payload: SuggestSourcesRequest = {
    jurisdiction_name: props.jurisdictionName,
    jurisdiction_description: props.jurisdictionDescription,
    project_description: props.projectDescription,
  }

  try {
    const res = await sourceApi.suggest(payload)
    const sources = res.data?.data?.sources || []

    if (sources.length === 0 && attempt <= maxRetries) throw new Error('empty')

    suggestions.value = sources.map((s: SuggestedSource) => ({
      ...s,
      id: idCounter++,
      added: false,
    }))
    error.value = null
  } catch (err) {
    if (attempt <= maxRetries) {
      retryCount.value = attempt
      setTimeout(() => loadSuggestions(attempt + 1), attempt * 3000)
      return
    }
    error.value = 'AI could not find reliable sources right now. Please try again later.'
    console.error('Failed to load suggestions', err)
  } finally {
    if (attempt > maxRetries || suggestions.value.length > 0) {
      loading.value = false
    }
  }
}

const toggleAddSuggestion = (id: number) => {
  const item = suggestions.value.find((s) => s.id === id)
  if (item) item.added = !item.added
}

const removeSuggestion = (id: number) => {
  suggestions.value = suggestions.value.filter((s) => s.id !== id)
}

const handleAddAllSuggestions = () => {
  suggestions.value.forEach((s) => (s.added = true))
}

const saveSelected = async () => {
  const toSave = suggestions.value.filter((s) => s.added)
  if (toSave.length === 0) return

  try {
    await sourceApi.acceptSuggestions({
      jurisdiction_id: props.jurisdictionId,
      source_type: 'web',
      scrape_frequency: 'DAILY',
      suggested_sources: toSave.map((s) => ({
        title: s.title,
        url: s.url,
        snippet: s.snippet,
        confidence_reason: s.confidence_reason,
        is_official: s.is_official,
      })),
    })

    const count = toSave.length
    emit('sources-added')
    emit('save', count)

    Swal.fire({
      icon: 'success',
      title: 'Done!',
      text: `${count} source${count > 1 ? 's' : ''} added and will be monitored.`,
      timer: 2500,
      showConfirmButton: false,
    })
  } catch (err) {
    const message =
      typeof err === 'object' && err && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : err instanceof Error
          ? err.message
          : null

    Swal.fire('Error', message || 'Failed to add sources', 'error')
  }
}

onMounted(() => loadSuggestions())

watch(
  () => [
    props.jurisdictionName,
    props.jurisdictionDescription,
    props.projectDescription,
    props.jurisdictionId,
  ],
  () => {
    if (props.jurisdictionName && props.jurisdictionId) {
      loading.value = true
      error.value = null
      retryCount.value = 0
      loadSuggestions()
    }
  },
)
</script>

<template>
  <div class="rounded-sm border border-gray-100 bg-white p-1 shadow-sm">
    <div
      class="mb-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex items-center gap-3">
        <div class="flex h-8 w-8 items-center justify-center rounded bg-[#401903]">
          <img :src="aiIcon" alt="AI" class="h-4 w-4 object-contain brightness-0 invert" />
        </div>
        <h2 class="text-base font-semibold text-[#1F1F1F]">AI Suggested Sources</h2>
        <span v-if="loading" class="flex items-center gap-1 text-xs text-gray-500">
          <Loader2 class="h-3 w-3 animate-spin" /> Thinking...
        </span>
      </div>

      <button
        v-if="suggestions.length > 0"
        @click="handleAddAllSuggestions"
        class="flex items-center gap-1 text-sm font-medium text-[#401903] hover:opacity-80"
      >
        Add All <Check :size="16" />
      </button>
    </div>

    <div v-if="error" class="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
      {{ error }}
    </div>

    <div v-if="loading" class="space-y-4 py-8 text-center">
      <div
        class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#401903]"
      ></div>
      <p class="text-sm font-medium text-gray-700">AI is researching official sources…</p>
      <p v-if="retryCount > 0" class="text-xs text-gray-500">
        Attempt {{ retryCount + 1 }} of {{ maxRetries + 1 }}…
      </p>
      <p class="mt-2 text-xs text-gray-400">
        This can take up to 90 seconds for complex jurisdictions.
      </p>
    </div>

    <div v-else-if="suggestions.length > 0" class="space-y-3">
      <div
        v-for="item in suggestions"
        :key="item.id"
        class="flex flex-col gap-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-gray-200"
      >
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div class="min-w-0 flex-1 space-y-1">
            <div class="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <h4 class="text-sm font-medium text-gray-900 sm:text-2xl">{{ item.title }}</h4>
              <span
                v-if="item.is_official"
                class="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
              >
                Official
              </span>
            </div>
            <a
              :href="item.url"
              target="_blank"
              class="text-sm wrap-break-word text-[#401903] underline hover:no-underline"
            >
              {{ item.url }}
            </a>
            <p class="mt-1 text-xs wrap-break-word text-gray-600 italic">{{ item.snippet }}</p>
            <p class="mt-2 text-xs wrap-break-word text-gray-500">
              <span class="font-medium">Reason:</span> {{ item.confidence_reason }}
            </p>
          </div>

          <div class="flex items-center gap-2 self-end sm:self-auto">
            <button @click="removeSuggestion(item.id)" class="text-gray-400 hover:text-red-600">
              <X :size="18" />
            </button>

            <button
              @click="toggleAddSuggestion(item.id)"
              class="w-20 rounded-lg px-3 py-1.5 text-sm font-medium transition-all"
              :class="item.added ? 'bg-[#12B76A] text-white' : 'btn--secondary btn--sm'"
            >
              {{ item.added ? 'Added' : 'Add' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="py-8 text-center text-sm text-gray-400">
      No suggestions generated. Try adjusting the jurisdiction description.
    </div>

    <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
      <button
        @click="emit('cancel')"
        class="rounded-lg border border-[#D0D5DD] bg-white px-5 py-2.5 text-sm font-medium text-[#344054] hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        @click="saveSelected"
        class="w-full rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#401903]/90 disabled:opacity-60 sm:w-auto"
        :disabled="suggestions.filter((s) => s.added).length === 0"
      >
        Save Selected ({{ suggestions.filter((s) => s.added).length }})
      </button>
    </div>
  </div>
</template>
