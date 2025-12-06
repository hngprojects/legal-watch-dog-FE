<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, Search, FileSearch, Loader2, RefreshCw, History, AlertCircle } from 'lucide-vue-next'
import type { Source, SourceRevision, ScrapeJob } from '@/types/source'
import type { Ticket } from '@/types/ticket'

const props = defineProps<{
  sources: Source[]
  sourcesLoading: boolean
  sourcesError: string | null
  scraping: Record<string, boolean>
  expandedSources: Record<string, boolean>
  activeJobs: Record<string, ScrapeJob | null>
  scrapeJobs: Record<string, ScrapeJob[]>
  scrapeJobsLoading: Record<string, boolean>
  scrapeJobsError: Record<string, string | null>
  revisionsBySource: Record<string, SourceRevision[]>
  revisionsLoading: Record<string, boolean>
  revisionsError: Record<string, string | null>
  latestRevision: (sourceId: string) => SourceRevision | undefined
  formatRevisionLabel: (rev: { scraped_at: string }) => string
  renderSummary: (summary?: string | null) => string
  ticketForRevision?: (revisionId: string | undefined) => Ticket | undefined
  creatingTicketIds?: Record<string, boolean>
}>()

const emit = defineEmits<{
  (e: 'add-manual'): void
  (e: 'add-ai', query: string): void
  (e: 'scrape', source: Source): void
  (e: 'toggle-source', sourceId: string): void
  (e: 'edit', source: Source): void
  (e: 'delete', source: Source): void
  (e: 'open-ticket', payload: { source: Source; revision: SourceRevision }): void
  (e: 'refresh-scrape-data', sourceId: string): void
  (e: 'refresh-revisions', sourceId: string): void
}>()

const searchQuery = ref('')
const hasQuery = computed(() => Boolean(searchQuery.value.trim()))

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
  if (!hasQuery.value) return
  emit('add-ai', searchQuery.value.trim())
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

const activeJobForSource = (sourceId: string) => props.activeJobs[sourceId] || null
const jobListForSource = (sourceId: string) => props.scrapeJobs[sourceId] || []
const revisionsForSource = (sourceId: string) => props.revisionsBySource[sourceId] || []

const formatJobStatus = (status: ScrapeJob['status']) => {
  if (status === 'IN_PROGRESS') return 'In progress'
  if (status === 'PENDING') return 'Queued'
  if (status === 'FAILED') return 'Failed'
  if (status === 'COMPLETED') return 'Completed'
  return status
}

const statusBadgeClass: Record<ScrapeJob['status'], string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-100',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 ring-blue-100',
  COMPLETED: 'bg-green-50 text-green-700 ring-green-100',
  FAILED: 'bg-red-50 text-red-700 ring-red-100',
}

const formatTimestamp = (value?: string | null) => {
  if (!value) return '—'
  return new Date(value).toLocaleString()
}

const refreshScrapeData = (sourceId: string) => emit('refresh-scrape-data', sourceId)
const refreshRevisions = (sourceId: string) => emit('refresh-revisions', sourceId)
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
        v-model="searchQuery"
        placeholder="Automatic source search"
        class="text-md focus:border-accent-main focus:ring-accent-main/20 w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-10 text-gray-700 shadow-sm outline-none focus:ring-2"
        @keydown.enter.prevent="handleAddAi"
      />
    </div>
    <button
      @click="handleAddAi"
      class="btn--secondary btn--sm btn--with-icon"
      :disabled="!hasQuery"
      :aria-disabled="!hasQuery"
    >
      <FileSearch :size="16" />
      Auto Search
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
            <div
              v-if="activeJobForSource(source.id)"
              class="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100"
            >
              <Loader2 class="h-3 w-3 animate-spin" />
              <span
                >Active scrape:
                {{ formatJobStatus(activeJobForSource(source.id)?.status || 'PENDING') }}</span
              >
            </div>
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

        <div
          v-if="expandedSources[source.id]"
          class="mt-3 space-y-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-800"
        >
          <div class="rounded-lg border border-gray-200 bg-white p-3">
            <div class="mb-3 flex items-center justify-between gap-2">
              <div>
                <p class="text-[11px] font-semibold tracking-[0.12em] text-gray-600 uppercase">
                  Scrape activity
                </p>
                <p class="text-[11px] text-gray-500">Active job and recent runs.</p>
              </div>
              <button
                class="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
                @click="refreshScrapeData(source.id)"
              >
                <RefreshCw
                  :size="14"
                  :class="[
                    scrapeJobsLoading[source.id] ? 'animate-spin text-[#401903]' : 'text-gray-600',
                  ]"
                />
                Refresh
              </button>
            </div>

            <div
              v-if="scrapeJobsError[source.id]"
              class="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-[11px] text-red-700"
            >
              <AlertCircle :size="14" />
              {{ scrapeJobsError[source.id] }}
            </div>

            <div
              v-else-if="scrapeJobsLoading[source.id]"
              class="flex items-center gap-2 text-[11px] text-gray-600"
            >
              <Loader2 class="h-3 w-3 animate-spin" />
              Loading jobs…
            </div>

            <div v-else class="space-y-2">
              <div
                v-if="activeJobForSource(source.id)"
                class="flex items-start justify-between gap-3 rounded-md bg-blue-50 px-3 py-2 text-[11px] text-blue-800 ring-1 ring-blue-100"
              >
                <div class="space-y-1">
                  <p class="font-semibold">
                    Active job ·
                    {{ formatJobStatus(activeJobForSource(source.id)?.status || 'PENDING') }}
                  </p>
                  <p class="text-[10px] text-blue-700/90">
                    Started
                    {{
                      formatTimestamp(
                        activeJobForSource(source.id)?.started_at ||
                          activeJobForSource(source.id)?.created_at,
                      )
                    }}
                  </p>
                </div>
                <Loader2 class="h-4 w-4 animate-spin" />
              </div>

              <div v-if="jobListForSource(source.id).length > 0" class="space-y-2">
                <div
                  v-for="job in jobListForSource(source.id).slice(0, 4)"
                  :key="job.id"
                  class="rounded-md border border-gray-100 px-3 py-2"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="space-y-1">
                      <p class="text-[11px] font-semibold text-gray-700">
                        {{ formatJobStatus(job.status) }}
                      </p>
                      <p class="text-[10px] text-gray-500">
                        {{ formatTimestamp(job.completed_at || job.started_at || job.created_at) }}
                      </p>
                    </div>
                    <span
                      class="inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
                      :class="statusBadgeClass[job.status]"
                    >
                      {{ job.status }}
                    </span>
                  </div>
                  <p v-if="job.result?.change_summary" class="mt-1 text-[11px] text-gray-700">
                    {{ job.result.change_summary }}
                  </p>
                  <p v-else-if="job.error_message" class="mt-1 text-[11px] text-red-600">
                    {{ job.error_message }}
                  </p>
                </div>
              </div>

              <p v-else class="text-[11px] text-gray-500">No scrape jobs yet.</p>
            </div>
          </div>

          <div class="rounded-lg border border-gray-200 bg-white p-3">
            <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p class="text-[11px] font-semibold tracking-[0.12em] text-gray-600 uppercase">
                  Revisions
                </p>
                <p class="text-[11px] text-gray-500">Latest scrape summary and history.</p>
              </div>
              <div class="flex items-center gap-2">
                <button
                  class="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
                  @click="refreshRevisions(source.id)"
                >
                  <RefreshCw
                    :size="14"
                    :class="[
                      revisionsLoading[source.id] ? 'animate-spin text-[#401903]' : 'text-gray-600',
                    ]"
                  />
                  Refresh
                </button>
                <button
                  class="rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-700 hover:bg-gray-50"
                  @click="emit('toggle-source', source.id)"
                >
                  Close
                </button>
              </div>
            </div>

            <div
              v-if="revisionsError[source.id]"
              class="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-[11px] text-red-700"
            >
              <AlertCircle :size="14" />
              {{ revisionsError[source.id] }}
            </div>

            <div
              v-else-if="revisionsLoading[source.id]"
              class="flex items-center gap-2 text-[11px] text-gray-600"
            >
              <Loader2 class="h-3 w-3 animate-spin" />
              Loading revisions…
            </div>

            <div v-else-if="latestRevisionBySource[source.id]" class="space-y-2">
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
                  :disabled="props.creatingTicketIds?.[latestRevisionBySource[source.id]?.id || '']"
                  :aria-disabled="
                    props.creatingTicketIds?.[latestRevisionBySource[source.id]?.id || ''] || false
                  "
                  @click="openTicket(source, latestRevisionBySource[source.id])"
                >
                  {{
                    hasTicket(latestRevisionBySource[source.id]?.id)
                      ? 'View ticket'
                      : props.creatingTicketIds?.[latestRevisionBySource[source.id]?.id || '']
                        ? 'Opening...'
                        : 'Open ticket'
                  }}
                </button>
              </div>

              <div class="mt-4 space-y-2">
                <div class="flex items-center gap-1 text-[11px] font-semibold text-gray-700">
                  <History :size="14" />
                  Recent revisions
                </div>
                <div
                  v-for="rev in revisionsForSource(source.id).slice(0, 4)"
                  :key="rev.id"
                  class="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2 text-[11px] text-gray-700"
                >
                  <div class="space-y-0.5">
                    <p class="font-semibold">
                      {{ formatTimestamp(rev.scraped_at) }}
                    </p>
                    <p class="text-[10px] text-gray-500">
                      {{ rev.ai_summary || rev.extracted_data?.title || 'No summary' }}
                    </p>
                  </div>
                  <span
                    class="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
                    :class="
                      rev.was_change_detected
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    "
                  >
                    {{ rev.was_change_detected ? 'Change' : 'No change' }}
                  </span>
                </div>
              </div>
            </div>

            <div v-else class="text-sm text-gray-600">No revisions found for this source yet.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
