<script setup lang="ts">
import { ref } from 'vue'
import { Plus, FilePlus } from 'lucide-vue-next'
import aiIcon from '@/assets/icons/ai_icon.png'
import type { Source, SourceRevision } from '@/types/source'

defineProps<{
  sources: Source[]
  sourcesLoading: boolean
  sourcesError: string | null
  scraping: Record<string, boolean>
  scrapeErrors: Record<string, string>
  expandedSources: Record<string, boolean>
  latestRevision: (sourceId: string) => SourceRevision | undefined
  formatRevisionLabel: (rev: { scraped_at: string }) => string
  renderSummary: (summary?: string | null) => string
}>()

const emit = defineEmits<{
  (e: 'add-manual'): void
  (e: 'add-ai'): void
  (e: 'scrape', source: Source): void
  (e: 'toggle-source', sourceId: string): void
  (e: 'edit', source: Source): void
  (e: 'delete', source: Source): void
}>()

const showHeaderMenu = ref(false)
const showEmptyStateMenu = ref(false)

const closeMenus = () => {
  showHeaderMenu.value = false
  showEmptyStateMenu.value = false
}

const handleAddManual = () => {
  closeMenus()
  emit('add-manual')
}

const handleAddAi = () => {
  closeMenus()
  emit('add-ai')
}
</script>

<template>
  <div class="flex items-center justify-between">
    <div>
      <h3 class="text-lg font-semibold text-[#1F1F1F]">Sources</h3>
      <p class="text-xs text-gray-500">Trigger scraping per source and view results.</p>
    </div>

    <div class="relative">
      <button
        @click.stop="showHeaderMenu = !showHeaderMenu"
        class="btn--default btn--with-icon inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all sm:px-5 sm:py-3 sm:text-base"
      >
        <Plus :size="16" class="sm:size-[18px]" />
        <span class="hidden sm:inline">Add Source</span>
        <span class="sm:hidden">Add</span>
      </button>

      <div
        v-if="showHeaderMenu"
        class="absolute top-full right-0 z-50 mt-2 w-60 rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5"
      >
        <button @click="handleAddManual" class="btn btn--lg btn--with-icon">
          <FilePlus :size="18" />
          Add Source Manually
        </button>

        <button @click="handleAddAi" class="btn btn--md btn--with-icon">
          <img :src="aiIcon" alt="AI" class="h-4 w-4 object-contain" />
          AI Suggested sources
        </button>
      </div>
    </div>
  </div>

  <div v-if="sourcesLoading" class="space-y-2">
    <div v-for="n in 3" :key="n" class="h-12 w-full animate-pulse rounded-lg bg-gray-100" />
  </div>

  <div v-else>
    <div v-if="sourcesError" class="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
      {{ sourcesError }}
    </div>

    <div
      v-if="sources.length === 0"
      class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center"
    >
      <p class="text-sm text-gray-500">No sources added yet.</p>
      <p class="text-xs text-gray-400">Add a source to begin scraping.</p>

      <div class="relative mt-4 inline-block">
        <button
          @click.stop="showEmptyStateMenu = !showEmptyStateMenu"
          class="inline-flex items-center gap-2 rounded-lg bg-[#401903] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#301403]"
        >
          <Plus :size="16" />
          <span class="hidden sm:inline">Add Source</span>
          <span class="sm:hidden">Add</span>
        </button>

        <div
          v-if="showEmptyStateMenu"
          class="absolute top-full left-1/2 z-50 mt-2 w-60 -translate-x-1/2 rounded-xl bg-white p-1 text-left shadow-lg ring-1 ring-black/5"
        >
          <button @click="handleAddManual" class="btn btn--sm btn--with-icon">
            <FilePlus :size="18" />
            Add Source Manually
          </button>

          <button
            @click="handleAddAi"
            class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#401903] hover:bg-gray-50"
          >
            <img :src="aiIcon" alt="AI" class="h-4 w-4 object-contain" />
            AI Suggested sources
          </button>
        </div>
      </div>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="source in sources"
        :key="source.id"
        class="rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm"
      >
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <!-- Source Info - full width on mobile, constrained on larger screens -->
          <div class="min-w-0 flex-1">
            <!-- min-w-0 enables text truncation -->
            <p class="truncate text-sm font-semibold text-gray-900 sm:text-base">
              {{ source.name }}
            </p>
            <p class="truncate text-xs text-gray-500 sm:text-sm">
              {{ source.url }}
            </p>
            <p class="mt-1 text-[11px] tracking-wide text-gray-400 uppercase">
              {{ source.source_type }} • {{ source.scrape_frequency }}
            </p>
          </div>

          <!-- Action Buttons - stacked & centered on mobile, inline on desktop -->
          <div class="flex flex-wrap justify-center gap-2 sm:justify-end">
            <button
              class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:px-3.5 sm:py-2 sm:text-sm"
              :class="
                scraping[source.id]
                  ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                  : 'bg-[#401903] text-white hover:bg-[#301403]'
              "
              :disabled="scraping[source.id]"
              @click="emit('scrape', source)"
            >
              {{ scraping[source.id] ? 'Scraping...' : 'Scrape Now' }}
            </button>

            <button
              class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 sm:px-3.5 sm:py-2 sm:text-sm"
              @click="emit('toggle-source', source.id)"
            >
              {{ expandedSources[source.id] ? 'Hide' : 'History' }}
            </button>

            <button
              class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 sm:px-3.5 sm:py-2 sm:text-sm"
              @click="emit('edit', source)"
            >
              Edit
            </button>

            <button
              class="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 sm:px-3.5 sm:py-2 sm:text-sm"
              @click="emit('delete', source)"
            >
              Delete
            </button>
          </div>
        </div>

        <div v-if="scrapeErrors[source.id]" class="mt-2 text-xs text-red-600">
          {{ scrapeErrors[source.id] }}
        </div>

        <div
          v-if="expandedSources[source.id]"
          class="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-800"
        >
          <div v-if="latestRevision(source.id)" class="space-y-2">
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <p class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
                  Scraped {{ formatRevisionLabel(latestRevision(source.id)!) }}
                </p>
                <p class="text-sm font-semibold text-gray-900">
                  {{
                    latestRevision(source.id)?.ai_summary ||
                    latestRevision(source.id)?.extracted_data?.title ||
                    'No summary available'
                  }}
                </p>
                <span
                  class="inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase"
                  :class="
                    latestRevision(source.id)?.was_change_detected
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  "
                >
                  {{
                    latestRevision(source.id)?.was_change_detected ? 'Change Detected' : 'No Change'
                  }}
                </span>
              </div>

              <button
                class="rounded border border-gray-200 px-2 py-1 text-[11px] text-gray-700 hover:bg-gray-100"
                @click="emit('toggle-source', source.id)"
              >
                Close
              </button>
            </div>

            <div
              class="prose prose-sm mt-2 max-w-none text-gray-800"
              v-html="
                renderSummary(
                  latestRevision(source.id)?.ai_markdown_summary ||
                    latestRevision(source.id)?.ai_summary,
                )
              "
            />
          </div>

          <div v-else class="text-sm text-gray-600">No revisions found for this source yet.</div>
        </div>
      </div>
    </div>
  </div>
</template>
