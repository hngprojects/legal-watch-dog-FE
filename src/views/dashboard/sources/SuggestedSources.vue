<script setup lang="ts">
import { ref } from 'vue'
import { Check, X } from 'lucide-vue-next'
import aiIcon from '@/assets/icons/ai_icon.png'

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'save', count: number): void
}>()

interface SuggestedSource {
  id: number
  url: string
  added: boolean
}

const suggestions = ref<SuggestedSource[]>([])

const toggleAddSuggestion = (id: number) => {
  const item = suggestions.value.find((s) => s.id === id)
  if (item) {
    item.added = !item.added
  }
}

const removeSuggestion = (id: number) => {
  suggestions.value = suggestions.value.filter((s) => s.id !== id)
}

const handleAddAllSuggestions = () => {
  suggestions.value.forEach((s) => (s.added = true))
}

const onCancel = () => {
  emit('cancel')
}

const onSave = () => {
  const addedCount = suggestions.value.filter((s) => s.added).length
  emit('save', addedCount)
}
</script>

<template>
  <div class="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="flex h-8 w-8 items-center justify-center rounded bg-[#401903]">
          <img :src="aiIcon" alt="AI" class="h-4 w-4 object-contain brightness-0 invert" />
        </div>
        <h2 class="text-base font-semibold text-[#1F1F1F]">AI Suggested Sources</h2>
      </div>

      <button
        @click="handleAddAllSuggestions"
        class="flex items-center gap-1 text-sm font-medium text-[#1F1F1F] hover:text-[#401903]"
      >
        Add All <Check :size="16" />
      </button>
    </div>

    <div class="space-y-3">
      <div
        v-for="item in suggestions"
        :key="item.id"
        class="flex items-center justify-between rounded-lg border border-gray-50 bg-white px-4 py-3 shadow-sm hover:border-gray-100"
      >
        <span class="text-sm text-gray-600">{{ item.url }}</span>

        <div class="flex items-center gap-4">
          <button
            @click="removeSuggestion(item.id)"
            class="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X :size="18" />
          </button>

          <button
            @click="toggleAddSuggestion(item.id)"
            class="h-9 w-20 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out"
            :class="[
              item.added
                ? 'bg-[#12B76A] border-transparent text-white'
                : 'border-[#9CA3AF] bg-transparent text-[#401903] hover:bg-gray-50',
              'border',
            ]"
          >
            {{ item.added ? 'Added' : 'Add' }}
          </button>
        </div>
      </div>

      <div v-if="suggestions.length === 0" class="py-8 text-center text-sm text-gray-400">
        No suggestions available.
      </div>
    </div>

    <div class="mt-8 flex justify-end gap-3">
      <button
        @click="onCancel"
        class="rounded-lg border border-[#D0D5DD] bg-white px-5 py-2.5 text-sm font-medium text-[#344054] shadow-sm hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        @click="onSave"
        class="rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#401903]/90"
      >
        Save
      </button>
    </div>
  </div>
</template>
