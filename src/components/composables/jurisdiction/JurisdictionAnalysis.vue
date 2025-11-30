<script setup lang="ts">
import type { Source } from '@/types/source'
import type { SourceRevision } from '@/types/source'

defineProps<{
  sources: Source[]
  selectedSourceId: string
  revisionOptions: SourceRevision[]
  selectedRevisionA: string | null
  selectedRevisionB: string | null
  revisionA: SourceRevision | null
  revisionB: SourceRevision | null
  formatRevisionLabel: (rev: { scraped_at: string }) => string
  renderSummary: (summary?: string | null) => string
}>()

const emit = defineEmits<{
  (e: 'select-source', id: string): void
  (e: 'select-revision-a', id: string | null): void
  (e: 'select-revision-b', id: string | null): void
}>()
</script>

<template>
  <div>
    <h3 class="text-lg font-semibold text-[#1F1F1F]">Analysis</h3>
    <p class="text-xs text-gray-500">Compare two revisions side by side.</p>
  </div>

  <div class="grid gap-4 lg:grid-cols-3">
    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-800">Source</label>
      <select
        :value="selectedSourceId"
        class="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
        @change="emit('select-source', ($event.target as HTMLSelectElement).value)"
      >
        <option disabled value="">Select a source</option>
        <option v-for="src in sources" :key="src.id" :value="src.id">
          {{ src.name }}
        </option>
      </select>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-800">Revision A</label>
      <select
        :value="selectedRevisionA || ''"
        class="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
        :disabled="!revisionOptions.length"
        @change="emit('select-revision-a', ($event.target as HTMLSelectElement).value || null)"
      >
        <option v-if="!revisionOptions.length" disabled value="">No revisions yet</option>
        <option v-for="rev in revisionOptions" :key="rev.id" :value="rev.id">
          {{ formatRevisionLabel(rev) }}
        </option>
      </select>
    </div>

    <div class="flex flex-col gap-2">
      <label class="text-sm font-medium text-gray-800">Revision B</label>
      <select
        :value="selectedRevisionB || ''"
        class="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
        :disabled="revisionOptions.length < 2"
        @change="emit('select-revision-b', ($event.target as HTMLSelectElement).value || null)"
      >
        <option v-if="revisionOptions.length < 2" disabled value="">Need another revision</option>
        <option v-for="rev in revisionOptions" :key="rev.id" :value="rev.id">
          {{ formatRevisionLabel(rev) }}
        </option>
      </select>
    </div>
  </div>

  <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
    <div class="rounded-lg border border-gray-200 bg-white p-4">
      <h4 class="mb-1 text-sm font-semibold text-gray-900">Revision A</h4>
      <p class="mb-3 text-xs text-gray-500">
        {{ revisionA ? formatRevisionLabel(revisionA) : 'Select a revision' }}
      </p>
      <span
        v-if="revisionA"
        class="mb-3 inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase"
        :class="
          revisionA.was_change_detected
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-600'
        "
      >
        {{ revisionA.was_change_detected ? 'Change Detected' : 'No Change' }}
      </span>
      <div
        v-if="revisionA"
        class="prose prose-sm max-w-none text-gray-800"
        v-html="renderSummary(revisionA.ai_markdown_summary || revisionA.ai_summary)"
      />
      <p v-else class="text-sm text-gray-500">Choose a revision to display.</p>
    </div>

    <div class="rounded-lg border border-gray-200 bg-white p-4">
      <h4 class="mb-1 text-sm font-semibold text-gray-900">Revision B</h4>
      <p class="mb-3 text-xs text-gray-500">
        {{ revisionB ? formatRevisionLabel(revisionB) : 'Select a revision' }}
      </p>
      <span
        v-if="revisionB"
        class="mb-3 inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase"
        :class="
          revisionB.was_change_detected
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-600'
        "
      >
        {{ revisionB.was_change_detected ? 'Change Detected' : 'No Change' }}
      </span>
      <div
        v-if="revisionB"
        class="prose prose-sm max-w-none text-gray-800"
        v-html="renderSummary(revisionB.ai_markdown_summary || revisionB.ai_summary)"
      />
      <p v-else class="text-sm text-gray-500">Choose a revision to display.</p>
    </div>
  </div>
</template>
