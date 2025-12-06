<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Plus, Settings } from 'lucide-vue-next'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { toast } from 'vue-sonner'
import type { Jurisdiction } from '@/api/jurisdiction'
import type { Source, ScrapeFrequency, SourceType } from '@/types/source'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
} from '@/components/ui/dialog'
import JurisdictionSources from '@/components/composables/jurisdiction/JurisdictionSources.vue'
import JurisdictionAnalysis from '@/components/composables/jurisdiction/JurisdictionAnalysis.vue'
import JurisdictionDialog from '@/components/composables/jurisdiction/dialogs/JurisdictionDialog.vue'
import SourceDialog from '@/components/composables/jurisdiction/dialogs/SourceDialog.vue'
import SuggestedSourcesDialog from '@/components/composables/jurisdiction/dialogs/SuggestedSourcesDialog.vue'

import { useJurisdictionStore } from '@/stores/jurisdiction-store'
import { useProjectStore } from '@/stores/project-store'
import { useOrganizationStore } from '@/stores/organization-store'
import { useSourceStore } from '@/stores/source-store'
import { useTicketStore } from '@/stores/ticket-store'
import type { SourceRevision } from '@/types/source'

interface NestedJurisdiction extends Jurisdiction {
  depth: number
}

const route = useRoute()
const router = useRouter()
const { confirm: openConfirm } = useConfirmDialog()

const jurisdictionStore = useJurisdictionStore()
const projectStore = useProjectStore()
const orgStore = useOrganizationStore()
const sourceStore = useSourceStore()
const ticketStore = useTicketStore()

const activeOrganizationId = computed<string>(() => {
  if (typeof route.query.organizationId === 'string') return route.query.organizationId
  return orgStore.currentOrganizationId || ''
})

// const organizationName = computed(() => {
//   if (!activeOrganizationId.value) return ''
//   return orgStore.organizations.find((org) => org.id === activeOrganizationId.value)?.name || ''
// })

const jurisdictionId = computed(() => route.params.id as string)
const jurisdiction = ref<Jurisdiction | null>(null)

// FIX: Removed '|| project?.name' because the type definition only has 'title'
const projectName = computed(() => {
  const projId = jurisdiction.value?.project_id
  if (!projId) return ''
  const project = projectStore.projects.find((p) => p.id === projId)
  return project?.title || ''
})

const loading = ref(true)
const activeTab = ref<'analysis' | 'sources'>('sources')

const showSuggestedSources = ref(false)
const showInlineEdit = ref(false)
const editSaving = ref(false)

const subJurisdictionModalOpen = ref(false)
const addSourceModalOpen = ref(false)
const subJurisdictionSaving = ref(false)

const editForm = ref({ name: '', description: '' })
const subJurisdictionForm = ref({ name: '', description: '' })

const sourceForm = ref<{
  id?: string | null
  name: string
  url: string
  source_type: SourceType
  scrape_frequency: ScrapeFrequency
  is_active: boolean
}>({
  id: null,
  name: '',
  url: '',
  source_type: 'web',
  scrape_frequency: 'DAILY',
  is_active: true,
})

const sources = computed(() => sourceStore.sources)
const sourcesLoading = computed(() => sourceStore.loading)
const sourcesError = computed(() => sourceStore.error)
const editingSourceId = ref<string | null>(null)
const scrapeErrors = ref<Record<string, string>>({})
const scraping = ref<Record<string, boolean>>({})
const expandedSources = ref<Record<string, boolean>>({})
const selectedSourceId = ref<string>('')
const selectedRevisionA = ref<string | null>(null)
const selectedRevisionB = ref<string | null>(null)

const revisionLimit = 5
const revisions = computed(() => sourceStore.revisions)
const revisionOptions = computed(() =>
  selectedSourceId.value ? revisions.value[selectedSourceId.value] || [] : [],
)
const revisionA = computed(
  () => revisionOptions.value.find((rev) => rev.id === selectedRevisionA.value) || null,
)
const revisionB = computed(
  () => revisionOptions.value.find((rev) => rev.id === selectedRevisionB.value) || null,
)
const latestRevision = (sourceId: string) => revisions.value[sourceId]?.[0]
const formatRevisionLabel = (rev: { scraped_at: string }) =>
  new Date(rev.scraped_at).toLocaleString()

const ticketMode = computed(() => ticketStore.getModeForJurisdiction(jurisdiction.value?.id))
const handleSelectSource = (id: string) => {
  selectedSourceId.value = id
}
const handleSelectRevisionA = (id: string | null) => {
  selectedRevisionA.value = id
}
const handleSelectRevisionB = (id: string | null) => {
  selectedRevisionB.value = id
}

const jurisdictionInstruction = ref('')
const instructionSaving = ref(false)
const isInstructionValid = computed(() => jurisdictionInstruction.value.trim().length > 0)
const instructionPlaceholder = computed(() =>
  jurisdictionInstruction.value.trim()
    ? 'Describe the monitoring focus, keywords, and context that apply to this jurisdiction.'
    : 'No instruction set. Add guidance for this jurisdiction.',
)

const loadJurisdiction = async (id: string) => {
  loading.value = true

  // Use any available org id: route query -> current store -> project org id (after fetch)
  let orgId = activeOrganizationId.value || orgStore.currentOrganizationId || ''

  const existing = jurisdictionStore.jurisdictions.find((j) => j.id === id)
  jurisdiction.value = existing || (await jurisdictionStore.fetchOne(id, orgId || undefined))

  // Load projects if we have an org id and none are cached yet
  if (!projectStore.projects.length && orgId) {
    await projectStore.fetchProjects(orgId)
  }

  if (jurisdiction.value) {
    const project =
      projectStore.projects.find((p) => p.id === jurisdiction.value?.project_id) || null
    orgId = orgId || project?.org_id || ''

    if (orgId) {
      await jurisdictionStore.fetchJurisdictions(jurisdiction.value.project_id, orgId)
      jurisdiction.value =
        jurisdictionStore.jurisdictions.find((j) => j.id === id) || jurisdiction.value
    }
  }

  if (jurisdiction.value) {
    await sourceStore.fetchSources(jurisdiction.value.id)
  }

  loading.value = false
}

const parseApiError = (err: unknown, fallback: string) => {
  const apiErr = err as {
    response?: { data?: { message?: string; detail?: string | Array<{ msg?: string }> } }
    message?: string
  }

  const detail = apiErr.response?.data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg
  if (apiErr.response?.data?.message) return apiErr.response.data.message
  if (apiErr.message) return apiErr.message
  return fallback
}

const fetchRevisionsForSource = async (sourceId: string, page = 1) => {
  const skip = (page - 1) * revisionLimit

  try {
    await sourceStore.fetchRevisions(sourceId, { skip, limit: revisionLimit })
    await maybeAutoCreateTicket(sourceId)
  } catch (err) {
    console.error('Failed to load revisions', err)
  }
}

const toggleSourceExpansion = async (sourceId: string) => {
  expandedSources.value[sourceId] = !expandedSources.value[sourceId]

  if (expandedSources.value[sourceId]) {
    await fetchRevisionsForSource(sourceId)
  }
}

const triggerScrape = async (source: Source) => {
  if (scraping.value[source.id]) return

  scraping.value[source.id] = true
  scrapeErrors.value[source.id] = ''

  try {
    const res = await sourceStore.scrapeSource(source.id)
    const message = (res as { message?: string })?.message ?? 'Scrape completed successfully.'

    toast.success(message)

    expandedSources.value[source.id] = true
    await fetchRevisionsForSource(source.id)
  } catch (err) {
    const msg = sourceStore.error || parseApiError(err, 'Failed to trigger scrape')
    scrapeErrors.value[source.id] = msg
    toast.error(msg)
  } finally {
    scraping.value[source.id] = false
  }
}

const renderSummary = (summary?: string | null) => {
  if (!summary) return ''

  try {
    const html = marked.parse(summary, { breaks: true }) as string
    return DOMPurify.sanitize(html)
  } catch (err) {
    console.error('Failed to render markdown summary', err)
    return ''
  }
}

const buildChangeDetails = (source: Source, revision: SourceRevision) => {
  const bullets =
    revision.ai_markdown_summary
      ?.split('\n')
      .map((item) => item.replace(/^[-*•]\s*/, '').trim())
      .filter(Boolean) || []

  return [
    {
      heading: source.name || 'Change detected',
      description:
        revision.ai_summary ||
        (typeof revision.extracted_data?.title === 'string'
          ? revision.extracted_data.title
          : 'Detected change on tracked source'),
      bullets,
    },
  ]
}

const createTicketFromRevision = async (
  source: Source,
  revision: SourceRevision,
  opts?: { auto?: boolean },
) => {
  if (ticketStore.hasTicketForRevision(revision.id)) {
    const existing = ticketStore.ticketForRevision(revision.id)
    if (existing && !opts?.auto) {
      toast.info('Ticket already exists for this change')
      router.push({ name: 'ticket-detail', params: { ticketId: existing.id } })
    }
    return existing
  }

  const created = await ticketStore.createTicket({
    title: `Change detected: ${source.name}`,
    summary:
      revision.ai_summary ||
      `A new change was detected on ${source.name} at ${formatRevisionLabel(revision)}`,
    priority: 'high',
    jurisdiction_id: jurisdiction.value?.id,
    project_id: jurisdiction.value?.project_id,
    source_id: source.id,
    revision_id: revision.id,
    change_summary: revision.ai_summary || 'Change detected',
    change_details: buildChangeDetails(source, revision),
    auto_created: opts?.auto,
  })

  if (created && !opts?.auto) {
    toast.success('Ticket created from change')
    router.push({ name: 'ticket-detail', params: { ticketId: created.id } })
  }

  if (created?.auto_created) {
    toast.success('Ticket auto-created for detected change')
  }

  return created
}

const maybeAutoCreateTicket = async (sourceId: string) => {
  if (ticketMode.value !== 'auto') return
  const changeRevision = revisions.value[sourceId]?.find((rev) => rev.was_change_detected)
  if (!changeRevision || ticketStore.hasTicketForRevision(changeRevision.id)) return
  const src = sources.value.find((item) => item.id === sourceId)
  if (!src) return
  await createTicketFromRevision(src, changeRevision, { auto: true })
}

const handleOpenTicket = async (payload: { source: Source; revision: SourceRevision }) => {
  await createTicketFromRevision(payload.source, payload.revision)
}

const toggleTicketMode = () => {
  if (!jurisdiction.value?.id) return
  const next = ticketMode.value === 'auto' ? 'manual' : 'auto'
  ticketStore.setModeForJurisdiction(jurisdiction.value.id, next)
  toast.success(
    next === 'auto' ? 'Automatic ticket creation enabled' : 'Manual ticket creation enabled',
  )
  if (next === 'auto' && selectedSourceId.value) {
    void maybeAutoCreateTicket(selectedSourceId.value)
  }
}

const saveJurisdictionInstruction = async () => {
  if (!jurisdiction.value?.id) return
  if (!isInstructionValid.value) {
    toast.error('Jurisdiction instruction is required')
    return
  }

  instructionSaving.value = true
  try {
    const updated = await jurisdictionStore.updateJurisdiction(
      jurisdiction.value.id,
      { prompt: jurisdictionInstruction.value.trim() || null },
      activeOrganizationId.value,
    )

    if (updated) {
      jurisdiction.value = updated
      toast.success('Jurisdiction instruction updated')
    }
  } catch (err) {
    console.error(err)
    toast.error(jurisdictionStore.error || 'Failed to update jurisdiction instruction')
  } finally {
    instructionSaving.value = false
  }
}

const handleManualAddSource = () => {
  openAddSourceModal()
}

const handleAiSuggestedSource = () => {
  activeTab.value = 'sources'
  showSuggestedSources.value = true
}

// const handleSearchClick = () => {
//   // Placeholder for search functionality
//   console.log('Search clicked')
// }

// --- SUGGESTIONS ---

const cancelSuggestions = () => {
  showSuggestedSources.value = false
}

const handleSuggestionsSaved = async (count: number) => {
  showSuggestedSources.value = false

  if (count > 0 && jurisdiction.value?.id) {
    await sourceStore.fetchSources(jurisdiction.value.id)
    toast.success(`${count} source${count > 1 ? 's' : ''} added successfully`)
  }
}

const toggleSuggestedDialog = (value: boolean) => {
  showSuggestedSources.value = value
}

// --- MODALS ---

const openAddSourceModal = () => {
  addSourceModalOpen.value = true
  editingSourceId.value = null

  sourceForm.value = {
    id: null,
    name: '',
    url: '',
    source_type: 'web',
    scrape_frequency: 'DAILY',
    is_active: true,
  }
}

const closeAddSourceModal = () => {
  addSourceModalOpen.value = false
  editingSourceId.value = null
}

const createSourceFromForm = async () => {
  if (!jurisdiction.value) return

  const payload = {
    jurisdiction_id: jurisdiction.value.id,
    name: sourceForm.value.name.trim(),
    url: sourceForm.value.url.trim(),
    source_type: sourceForm.value.source_type,
    scrape_frequency: sourceForm.value.scrape_frequency,
  }

  const res = await sourceStore.createSource(payload)

  if (res) {
    closeAddSourceModal()
    toast.success('Source added successfully')
  }
}

const startEditSource = (src: Source) => {
  editingSourceId.value = src.id
  addSourceModalOpen.value = true

  sourceForm.value = {
    id: src.id,
    name: src.name,
    url: src.url,
    source_type: src.source_type,
    scrape_frequency: src.scrape_frequency,
    is_active: src.is_active ?? true,
  }
}

const saveEditedSource = async () => {
  if (!editingSourceId.value) return

  const payload = {
    name: sourceForm.value.name.trim(),
    url: sourceForm.value.url.trim(),
    source_type: sourceForm.value.source_type,
    scrape_frequency: sourceForm.value.scrape_frequency,
    is_active: sourceForm.value.is_active,
  }

  const updated = await sourceStore.updateSource(editingSourceId.value, payload)

  if (updated) {
    closeAddSourceModal()
    toast.success('Source updated')
  }
}

const deleteSource = async (src: Source) => {
  openConfirm({
    title: 'Delete Source?',
    description: `Are you sure you want to delete "${src.name}"? This action cannot be undone.`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    async onConfirm() {
      const ok = await sourceStore.deleteSource(src.id)
      if (ok) toast.success('Source deleted')
    },
  })
}

const goBack = () => {
  router.push({
    name: 'organization-projects',
    params: { organizationId: activeOrganizationId.value },
  })
}

const startEdit = () => {
  editForm.value = {
    name: jurisdiction.value?.name ?? '',
    description: jurisdiction.value?.description ?? '',
  }
  showInlineEdit.value = true
}

const saveEdit = async () => {
  if (editSaving.value) return
  editSaving.value = true
  const payload = {
    name: editForm.value.name,
    description: editForm.value.description,
  }

  try {
    const updated = await jurisdictionStore.updateJurisdiction(
      jurisdictionId.value,
      payload,
      activeOrganizationId.value,
    )

    if (updated) {
      jurisdiction.value = updated
      toast.success('Jurisdiction updated')
      showInlineEdit.value = false
    } else if (jurisdictionStore.error) {
      toast.error(jurisdictionStore.error)
    }
  } catch (error) {
    const msg = jurisdictionStore.error || 'Failed to update jurisdiction'
    toast.error(msg)
    void error
  } finally {
    editSaving.value = false
  }
}

const deleteJurisdiction = async () => {
  openConfirm({
    title: 'Delete Jurisdiction?',
    description: `Are you sure you want to delete "${jurisdiction.value?.name}"?`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    async onConfirm() {
      await jurisdictionStore.deleteJurisdiction(jurisdictionId.value)
      toast.success('Jurisdiction deleted')
      goBack()
    },
  })
}

const parentJurisdiction = computed(() => {
  if (!jurisdiction.value) return null
  return jurisdictionStore.jurisdictions.find((j) => j.id === jurisdiction.value?.parent_id) || null
})

const subJurisdictions = computed(() => {
  if (!jurisdiction.value) return []

  const walk = (parentId: string, depth = 0): NestedJurisdiction[] =>
    jurisdictionStore.jurisdictions
      .filter((j) => j.parent_id === parentId)
      .flatMap((child) => [{ ...child, depth }, ...walk(child.id, depth + 1)])

  return walk(jurisdiction.value.id)
})

const openSubJurisdictionModal = () => {
  subJurisdictionModalOpen.value = true
  subJurisdictionForm.value = { name: '', description: '' }
}

const updateSubJurisdictionForm = (payload: Partial<{ name: string; description: string }>) => {
  subJurisdictionForm.value = { ...subJurisdictionForm.value, ...payload }
}

const closeSubJurisdictionModal = () => {
  subJurisdictionModalOpen.value = false
}

const createSubJurisdiction = async () => {
  if (!jurisdiction.value || subJurisdictionSaving.value) return

  if (!subJurisdictionForm.value.name.trim()) return toast.error('Name required')
  if (!subJurisdictionForm.value.description.trim()) return toast.error('Description required')

  subJurisdictionSaving.value = true
  try {
    const created = await jurisdictionStore.addJurisdiction(jurisdiction.value.project_id, {
      name: subJurisdictionForm.value.name.trim(),
      description: subJurisdictionForm.value.description.trim(),
      parent_id: jurisdiction.value.id,
    })

    if (created) {
      closeSubJurisdictionModal()
      toast.success(`"${created.name}" added successfully`)
    } else if (jurisdictionStore.error) {
      toast.error(jurisdictionStore.error)
    }
  } finally {
    subJurisdictionSaving.value = false
  }
}

const goToJurisdiction = (id: string) => {
  router.push({
    path: `/dashboard/jurisdictions/${id}`,
    query: { organizationId: activeOrganizationId.value },
  })
}

const lastUpdatedText = computed(() => {
  const t = jurisdiction.value?.updated_at || jurisdiction.value?.created_at
  return t ? new Date(t).toLocaleString() : ''
})

watch(
  jurisdiction,
  (val) => {
    jurisdictionInstruction.value = val?.prompt || ''
  },
  { immediate: true },
)

watch(
  sources,
  (list) => {
    if (!selectedSourceId.value && list.length) {
      selectedSourceId.value = list[0]?.id as string
    }
  },
  { immediate: true },
)

watch(
  selectedSourceId,
  async (id) => {
    selectedRevisionA.value = null
    selectedRevisionB.value = null
    if (id) {
      await fetchRevisionsForSource(id)
    }
  },
  { immediate: true },
)

watch(revisionOptions, (opts) => {
  if (!opts.length) {
    selectedRevisionA.value = null
    selectedRevisionB.value = null
    return
  }

  if (!selectedRevisionA.value && opts[0]) {
    selectedRevisionA.value = opts[0].id
  }
  if (!selectedRevisionB.value && opts[1]) {
    selectedRevisionB.value = opts[1].id
  }
})

watch(
  () => jurisdictionId.value,
  (id) => id && loadJurisdiction(id),
)

watch(
  () => jurisdictionStore.jurisdictions,
  () => {
    const found = jurisdictionStore.jurisdictions.find((j) => j.id === jurisdictionId.value)
    if (found) jurisdiction.value = found
  },
  { deep: true },
)

onMounted(() => {
  loadJurisdiction(jurisdictionId.value)
})
</script>

<template>
  <main class="min-h-screen flex-1 bg-[#F8F7F5] px-4 py-6 sm:px-6 lg:px-10 lg:py-12">
    <div v-if="loading" class="mx-auto max-w-6xl">
      <div class="space-y-4">
        <div class="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
        <div class="h-8 w-80 animate-pulse rounded bg-gray-200"></div>
        <div class="h-24 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"></div>
      </div>
    </div>

    <div
      v-else-if="!jurisdiction"
      class="mx-auto max-w-4xl rounded-2xl bg-white p-10 text-center shadow-sm"
    >
      <h1 class="text-2xl font-semibold text-gray-900">Jurisdiction not found</h1>
      <button
        @click="goBack"
        class="mt-4 inline-flex items-center gap-2 text-[#401903] hover:underline"
      >
        Back to Projects
      </button>
    </div>

    <div v-else class="mx-auto max-w-6xl space-y-6 lg:space-y-8">
      <header class="flex flex-wrap items-start justify-between gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink as-child>
                <RouterLink
                  :to="{
                    name: 'organization-projects',
                    params: { organizationId: activeOrganizationId },
                  }"
                >
                  Projects
                </RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem v-if="jurisdiction.project_id && projectName">
              <BreadcrumbLink as-child>
                <RouterLink
                  :to="{
                    name: 'project-detail',
                    params: { organizationId: activeOrganizationId, id: jurisdiction.project_id },
                  }"
                >
                  {{ projectName }}
                </RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator v-if="jurisdiction.project_id && projectName" />

            <template v-if="parentJurisdiction">
              <BreadcrumbItem>
                <BreadcrumbLink as-child>
                  <RouterLink :to="`/dashboard/jurisdictions/${parentJurisdiction.id}`">
                    {{ parentJurisdiction.name }}
                  </RouterLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </template>

            <BreadcrumbItem>
              <BreadcrumbPage>{{ jurisdiction.name }}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 sm:h-10 sm:w-10"
            >
              <Settings :size="17" class="sm:size-[18px]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-48">
            <DropdownMenuItem @click="startEdit">Edit Jurisdiction</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" @click="deleteJurisdiction">
              Delete Jurisdiction
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div class="flex flex-col gap-3">
          <p class="text-xs font-semibold tracking-[0.15em] text-[#C17A3F] uppercase">
            Jurisdiction
          </p>
          <h1 class="text-2xl font-bold text-[#1F1F1F] sm:text-3xl">{{ jurisdiction.name }}</h1>
          <p v-if="jurisdiction.description" class="text-base leading-relaxed text-[#4B5563]">
            {{ jurisdiction.description }}
          </p>
          <p v-if="lastUpdatedText" class="text-sm text-gray-400">Updated {{ lastUpdatedText }}</p>
        </div>

        <div
          class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-[#FBFBFB] px-4 py-3"
        >
          <div>
            <p class="text-xs font-semibold tracking-[0.12em] text-[#6B4B32] uppercase">
              Ticket creation
            </p>
            <p class="text-sm text-gray-600">
              {{
                ticketMode === 'auto'
                  ? 'Automatically create tickets when a change lands.'
                  : 'Create tickets manually when changes are detected.'
              }}
            </p>
          </div>
          <button class="btn--secondary btn--sm whitespace-nowrap" @click="toggleTicketMode">
            {{ ticketMode === 'auto' ? 'Switch to manual' : 'Enable auto-create' }}
          </button>
        </div>
        <div class="mt-6 space-y-3 rounded-xl border border-gray-100 bg-[#FBFBFB] p-4 sm:p-5">
          <div class="space-y-1">
            <label for="jurisdiction-instruction" class="text-sm font-semibold text-gray-900">
              Jurisdiction instruction
            </label>
            <p class="text-xs text-gray-500">
              Set the guidance Watchdog should follow when monitoring this jurisdiction.
            </p>
          </div>
          <textarea
            id="jurisdiction-instruction"
            v-model="jurisdictionInstruction"
            rows="4"
            :placeholder="instructionPlaceholder"
            class="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/10 focus:outline-none"
            :disabled="instructionSaving"
            required
          />
          <div class="flex justify-end">
            <button
              class="btn--default btn--sm sm:btn--md"
              type="button"
              :disabled="instructionSaving || !isInstructionValid"
              @click="saveJurisdictionInstruction"
            >
              {{ instructionSaving ? 'Saving...' : 'Save Instruction' }}
            </button>
          </div>
        </div>
      </section>

      <section class="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <div class="border-b border-gray-100 px-6 py-4">
          <div class="flex gap-8">
            <button
              @click="activeTab = 'sources'"
              :class="[
                'relative pb-4 text-sm font-semibold transition-colors',
                activeTab === 'sources'
                  ? 'text-[#1F1F1F]'
                  : 'hover:text-[#1F1F1F cursor-pointer text-gray-500',
              ]"
            >
              Sources
              <span
                v-if="activeTab === 'sources'"
                class="absolute inset-x-0 -bottom-px h-0.5 bg-[#401903]"
              ></span>
            </button>

            <button
              @click="activeTab = 'analysis'"
              :class="[
                'relative pb-4 text-sm font-semibold transition-colors',
                activeTab === 'analysis'
                  ? 'text-[#1F1F1F]'
                  : 'cursor-pointer text-gray-500 hover:text-[#1F1F1F]',
              ]"
            >
              Analysis
              <span
                v-if="activeTab === 'analysis'"
                class="absolute inset-x-0 -bottom-px h-0.5 bg-[#401903]"
              ></span>
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'sources'" class="space-y-4 p-6">
          <JurisdictionSources
            :sources="sources"
            :sources-loading="sourcesLoading"
            :sources-error="sourcesError"
            :scraping="scraping"
            :scrape-errors="scrapeErrors"
            :expanded-sources="expandedSources"
            :latest-revision="latestRevision"
            :format-revision-label="formatRevisionLabel"
            :render-summary="renderSummary"
            :ticket-for-revision="ticketStore.ticketForRevision"
            @add-manual="handleManualAddSource"
            @add-ai="handleAiSuggestedSource"
            @scrape="triggerScrape"
            @toggle-source="toggleSourceExpansion"
            @edit="startEditSource"
            @delete="deleteSource"
            @open-ticket="handleOpenTicket"
          />
        </div>

        <div v-else class="space-y-4 p-6">
          <JurisdictionAnalysis
            :sources="sources"
            :selected-source-id="selectedSourceId"
            :revision-options="revisionOptions"
            :selected-revision-a="selectedRevisionA"
            :selected-revision-b="selectedRevisionB"
            :revision-a="revisionA"
            :revision-b="revisionB"
            :format-revision-label="formatRevisionLabel"
            :render-summary="renderSummary"
            :ticket-for-revision="ticketStore.ticketForRevision"
            @select-source="handleSelectSource"
            @select-revision-a="handleSelectRevisionA"
            @select-revision-b="handleSelectRevisionB"
            @open-ticket="
              ({ revision }) => {
                if (!revision) return
                const src = sources.find((s) => s.id === selectedSourceId)
                if (src) handleOpenTicket({ source: src, revision })
              }
            "
          />
        </div>
      </section>

      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div
          class="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        >
          <h3 class="text-lg font-semibold text-[#1F1F1F]">Sub-Jurisdictions</h3>

          <button
            class="btn--default btn--with-icon btn--sm sm-btn--lg"
            @click="openSubJurisdictionModal"
          >
            <Plus :size="16" /> Add Sub-jurisdiction
          </button>
        </div>

        <!-- Empty subjurisdiction section -->
        <div
          v-if="subJurisdictions.length === 0"
          class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center"
        >
          <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>

          <p class="mb-1 text-base font-medium text-gray-900">No Sub-Jurisdictions</p>
          <p class="text-sm text-gray-500">Create one to begin categorizing domains.</p>
        </div>

        <!-- Sub jurisdiction section -->
        <div v-else class="space-y-3">
          <article
            v-for="node in subJurisdictions"
            :key="node.id"
            @click="goToJurisdiction(node.id)"
            class="group cursor-pointer rounded-lg bg-white p-6 shadow ring-1 ring-gray-200/60 transition-all hover:shadow-md hover:ring-[#401903]/10"
            :style="{ paddingLeft: `${node.depth * 16 + 16}px` }"
          >
            <h4
              class="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-[#401903]"
            >
              {{ node.name }}
            </h4>

            <p class="text-sm leading-relaxed text-gray-600">
              {{ node.description }}
            </p>

            <p class="mt-2 text-xs text-gray-400">
              {{ new Date(node.created_at).toLocaleString() }}
            </p>
          </article>
        </div>
      </section>
    </div>

    <JurisdictionDialog
      :open="subJurisdictionModalOpen"
      :form="subJurisdictionForm"
      :loading="subJurisdictionSaving"
      @update:open="(value) => !value && closeSubJurisdictionModal()"
      @update:form="updateSubJurisdictionForm"
      @submit="createSubJurisdiction"
      @cancel="closeSubJurisdictionModal"
    />

    <SuggestedSourcesDialog
      :open="showSuggestedSources"
      :jurisdiction-id="jurisdiction?.id || ''"
      :jurisdiction-name="jurisdiction?.name || ''"
      :jurisdiction-description="jurisdiction?.description || ''"
      :project-description="projectName"
      @update:open="toggleSuggestedDialog"
      @cancel="cancelSuggestions"
      @save="handleSuggestionsSaved"
      @sources-added="sourceStore.fetchSources(jurisdiction?.id || '')"
    />

    <Dialog :open="showInlineEdit" @update:open="(value) => (showInlineEdit = value)">
      <DialogScrollContent class="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Edit Jurisdiction</DialogTitle>
          <DialogDescription>Update the name and description.</DialogDescription>
        </DialogHeader>

        <form @submit.prevent="saveEdit" class="space-y-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">Name</label>
            <input
              v-model="editForm.name"
              class="h-12 w-full rounded-lg border px-4 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">Description</label>
            <textarea
              v-model="editForm.description"
              rows="3"
              class="w-full rounded-lg border px-4 py-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
            />
          </div>

          <DialogFooter class="flex justify-end gap-3 pt-2">
            <button type="button" class="btn--secondary btn--lg" @click="showInlineEdit = false">
              Cancel
            </button>
            <button
              type="submit"
              class="btn--default btn--lg"
              :disabled="editSaving"
              :aria-busy="editSaving"
            >
              {{ editSaving ? 'Saving...' : 'Save Changes' }}
            </button>
          </DialogFooter>
        </form>
      </DialogScrollContent>
    </Dialog>

    <SourceDialog
      :open="addSourceModalOpen"
      :editing-id="editingSourceId"
      :form="sourceForm"
      :loading="sourcesLoading"
      :error="sourcesError"
      @update:open="(value) => !value && closeAddSourceModal()"
      @update:form="(payload) => (sourceForm = { ...sourceForm, ...payload })"
      @submit="editingSourceId ? saveEditedSource() : createSourceFromForm()"
      @cancel="closeAddSourceModal"
    />
  </main>
</template>
