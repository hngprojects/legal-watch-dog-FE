<script setup lang="ts">
import { computed } from 'vue'
import { Plus, Search } from 'lucide-vue-next'
import type { Source, SourceRevision } from '@/types/source'
import type { Ticket } from '@/types/ticket'

const props = defineProps<{
  sources: Source[]
  sourcesLoading: boolean
  sourcesError: string | null
  scraping: Record<string, boolean>
  scrapeErrors: Record<string, string>
  expandedSources: Record<string, boolean>
  latestRevision: (sourceId: string) => SourceRevision | undefined
  formatRevisionLabel: (rev: { scraped_at: string }) => string
  renderSummary: (summary?: string | null) => string
  ticketForRevision?: (revisionId: string | undefined) => Ticket | undefined
}>()

const emit = defineEmits<{
  (e: 'add-manual'): void
  (e: 'add-ai'): void
  (e: 'scrape', source: Source): void
  (e: 'toggle-source', sourceId: string): void
  (e: 'edit', source: Source): void
  (e: 'delete', source: Source): void
  (e: 'open-ticket', payload: { source: Source; revision: SourceRevision }): void
}>()

const latestRevisionBySource = computed<Record<string, SourceRevision | undefined>>(() => {
  const map: Record<string, SourceRevision | undefined> = {}
  props.sources.forEach((source) => {
    map[source.id] = props.latestRevision(source.id)
  })
  return map
})

const formatLatestRevisionLabel = (revision?: SourceRevision) =>
  revision ? props.formatRevisionLabel(revision) : ''

const openTicket = (source: Source, revision?: SourceRevision) => {
  if (!revision) return
  emit('open-ticket', { source, revision })
}

const handleAddManual = () => {
  emit('add-manual')
}

const handleAddAi = () => {
  emit('add-ai')
}

const handleScrape = (source: Source) => {
  // Guard to prevent accidental double-triggering
  if (props.scraping[source.id]) return
  emit('scrape', source)
}

const hasTicket = (revisionId?: string) => {
  if (!revisionId || !props.ticketForRevision) return false
  return Boolean(props.ticketForRevision(revisionId))
}
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="relative w-full sm:w-64">
      <Search
        :size="16"
        class="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 sm:size-[18px]"
      />
      <input
        type="text"
        placeholder="Auto source search"
        class="text-md focus:border-accent-main focus:ring-accent-main/20 w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-10 text-gray-700 shadow-sm outline-none focus:ring-2"
        @keydown.enter.prevent="handleAddAi"
      />
    </div>
    <button @click="handleAddAi" class="btn--secondary btn--sm btn--with-icon">
      <FileSearchCorner size="16" />
      Search
    </button>
  </div>
  <div class="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
    <div>
      <h3 class="text-lg font-semibold text-[#1F1F1F]">Sources</h3>
      <p class="text-xs text-gray-500">Trigger scraping per source and view results.</p>
    </div>
    <button @click="handleAddManual" class="btn--default btn--with-icon btn--sm md:btn--lg">
      <Plus :size="16" class="sm:size-[18px]" />
      <span class="hidden sm:inline">Add Source</span>
      <span class="sm:hidden">Add</span>
    </button>
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
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="source in sources"
        :key="source.id"
        class="rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm"
      >
        <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:justify-between">
          <!-- Source Info - full width on mobile, constrained on larger screens -->
          <div class="max-w-full min-w-0 flex-1 sm:max-w-[60%] lg:max-w-[65%]">
            <p class="truncate text-xs font-semibold text-gray-900 sm:text-sm md:text-base">
              {{ source.name }}
            </p>
            <p class="text-[11px] text-gray-500 sm:max-w-[48ch] sm:truncate sm:text-xs md:text-sm">
              {{ source.url }}
            </p>
            <p class="mt-1 text-[11px] tracking-wide text-gray-400 uppercase">
              {{ source.source_type }} • {{ source.scrape_frequency }}
            </p>
          </div>

          <!-- Action Buttons - stacked & centered on mobile, inline on desktop -->
          <div class="flex flex-wrap justify-start gap-2 sm:flex-none sm:justify-end">
            <button
              type="button"
              class="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:px-3.5 sm:py-2 sm:text-sm"
              :class="
                scraping[source.id]
                  ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                  : 'bg-[#401903] text-white hover:bg-[#301403]'
              "
              :disabled="scraping[source.id]"
              @click="handleScrape(source)"
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
          <div v-if="latestRevisionBySource[source.id]" class="space-y-2">
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <p class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
                  Scraped {{ formatLatestRevisionLabel(latestRevisionBySource[source.id]) }}
                </p>
                <p class="text-sm font-semibold text-gray-900">
                  {{
                    latestRevisionBySource[source.id]?.ai_summary ||
                    latestRevisionBySource[source.id]?.extracted_data?.title ||
                    'No summary available'
                  }}
                </p>
                <span
                  class="inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase"
                  :class="
                    latestRevisionBySource[source.id]?.was_change_detected
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  "
                >
                  {{
                    latestRevisionBySource[source.id]?.was_change_detected
                      ? 'Change Detected'
                      : 'No Change'
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
                  latestRevisionBySource[source.id]?.ai_markdown_summary ||
                    latestRevisionBySource[source.id]?.ai_summary,
                )
              "
            />

            <div
              v-if="latestRevisionBySource[source.id]?.was_change_detected"
              class="mt-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <p class="text-xs text-gray-600">
                A change was detected in this revision. Create or open a ticket to collaborate.
              </p>
              <button
                class="btn--default btn--sm sm:btn--lg"
                @click="openTicket(source, latestRevisionBySource[source.id])"
              >
                {{
                  hasTicket(latestRevisionBySource[source.id]?.id) ? 'View ticket' : 'Open ticket'
                }}
              </button>
            </div>
          </div>

          <div v-else class="text-sm text-gray-600">No revisions found for this source yet.</div>
        </div>
      </div>
    </div>
  </div>
</template>
