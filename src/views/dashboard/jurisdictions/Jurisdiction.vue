<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Plus, Settings } from 'lucide-vue-next'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import Swal from '@/lib/swal'

import type { Jurisdiction } from '@/api/jurisdiction'
import type { Source, ScrapeFrequency, SourceType } from '@/types/source'

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
import SubJurisdictionDialog from '@/components/composables/jurisdiction/dialogs/SubJurisdictionDialog.vue'
import SourceDialog from '@/components/composables/jurisdiction/dialogs/SourceDialog.vue'
import SuggestedSourcesDialog from '@/components/composables/jurisdiction/dialogs/SuggestedSourcesDialog.vue'

import { useJurisdictionStore } from '@/stores/jurisdiction-store'
import { useProjectStore } from '@/stores/project-store'
import { useOrganizationStore } from '@/stores/organization-store'
import { useSourceStore } from '@/stores/source-store'

interface NestedJurisdiction extends Jurisdiction {
  depth: number
}

const route = useRoute()
const router = useRouter()

const jurisdictionStore = useJurisdictionStore()
const projectStore = useProjectStore()
const orgStore = useOrganizationStore()
const sourceStore = useSourceStore()

const activeOrganizationId = computed<string>(() => {
  if (typeof route.query.organizationId === 'string') return route.query.organizationId
  return orgStore.currentOrganizationId || ''
})

const organizationName = computed(() => {
  if (!activeOrganizationId.value) return ''
  return orgStore.organizations.find((org) => org.id === activeOrganizationId.value)?.name || ''
})

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

const subJurisdictionModalOpen = ref(false)
const addSourceModalOpen = ref(false)

const editForm = ref({ name: '', description: '', prompt: '' })
const subJurisdictionForm = ref({ name: '', description: '', prompt: '' })

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
const handleSelectSource = (id: string) => {
  selectedSourceId.value = id
}
const handleSelectRevisionA = (id: string | null) => {
  selectedRevisionA.value = id
}
const handleSelectRevisionB = (id: string | null) => {
  selectedRevisionB.value = id
}

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

    Swal.fire('Scrape Complete', message, 'success')
    expandedSources.value[source.id] = true
    await fetchRevisionsForSource(source.id)
  } catch (err) {
    const msg = sourceStore.error || parseApiError(err, 'Failed to trigger scrape')
    scrapeErrors.value[source.id] = msg
    Swal.fire('Scrape Failed', msg, 'error')
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
    Swal.fire('Success', `${count} source${count > 1 ? 's' : ''} added successfully!`, 'success')
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
    Swal.fire('Source Added', '', 'success')
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
    Swal.fire('Updated!', '', 'success')
  }
}

const deleteSource = async (src: Source) => {
  const confirm = await Swal.fire({
    title: 'Delete source?',
    icon: 'warning',
    showCancelButton: true,
  })

  if (!confirm.isConfirmed) return

  const ok = await sourceStore.deleteSource(src.id)

  if (ok) Swal.fire('Deleted', '', 'success')
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
    prompt: jurisdiction.value?.prompt ?? '',
  }
  showInlineEdit.value = true
}

const saveEdit = async () => {
  const payload = {
    name: editForm.value.name,
    description: editForm.value.description,
    prompt: editForm.value.prompt,
  }

  try {
    const updated = await jurisdictionStore.updateJurisdiction(
      jurisdictionId.value,
      payload,
      activeOrganizationId.value,
    )

    if (updated) {
      jurisdiction.value = updated
      Swal.fire('Updated!', '', 'success')
      showInlineEdit.value = false
    } else if (jurisdictionStore.error) {
      Swal.fire('Update failed', jurisdictionStore.error, 'error')
    }
  } catch (error) {
    const msg = jurisdictionStore.error || 'Failed to update jurisdiction'
    Swal.fire('Update failed', msg, 'error')
    void error
  }
}

const deleteJurisdiction = async () => {
  const confirm = await Swal.fire({
    title: 'Delete?',
    showCancelButton: true,
  })

  if (!confirm.isConfirmed) return

  await jurisdictionStore.deleteJurisdiction(jurisdictionId.value)

  Swal.fire('Deleted!', '', 'success')
  goBack()
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
  subJurisdictionForm.value = { name: '', description: '', prompt: '' }
}

const closeSubJurisdictionModal = () => {
  subJurisdictionModalOpen.value = false
}

  const createSubJurisdiction = async () => {
    if (!jurisdiction.value) return

    if (!subJurisdictionForm.value.name.trim()) return
    if (!subJurisdictionForm.value.description.trim()) return

  const created = await jurisdictionStore.addJurisdiction(jurisdiction.value.project_id, {
    name: subJurisdictionForm.value.name.trim(),
    description: subJurisdictionForm.value.description.trim(),
    prompt: subJurisdictionForm.value.prompt.trim() || null,
    parent_id: jurisdiction.value.id,
  })

  if (created) {
    closeSubJurisdictionModal()
    Swal.fire({
      icon: 'success',
      title: 'Sub-jurisdiction created',
      text: `"${created.name}" has been added.`,
      timer: 2000,
      showConfirmButton: false,
    })
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
  <main class="min-h-screen flex-1 bg-[#F8F7F5] px-6 py-8 lg:px-10 lg:py-12">
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
                <RouterLink :to="{ name: 'organizations' }">Organizations</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink as-child>
                <RouterLink
                  :to="{
                    name: 'organization-projects',
                    params: { organizationId: activeOrganizationId },
                  }"
                >
                  {{ organizationName || 'Organization' }}
                </RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

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
            <button type="button" class="btn--default btn--sm">
              <Settings :size="18" />
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
          <h1 class="text-3xl font-bold text-[#1F1F1F]">{{ jurisdiction.name }}</h1>
          <p v-if="jurisdiction.description" class="text-base leading-relaxed text-[#4B5563]">
            {{ jurisdiction.description }}
          </p>
          <p v-if="lastUpdatedText" class="text-sm text-gray-400">Updated {{ lastUpdatedText }}</p>
        </div>
      </section>

      <section class="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <div class="border-b border-gray-100 px-6 py-4">
          <div class="flex gap-8">
            <button
              @click="activeTab = 'sources'"
              :class="[
                'relative pb-4 text-sm font-semibold transition-colors',
                activeTab === 'sources' ? 'text-[#1F1F1F]' : 'text-gray-500 hover:text-[#1F1F1F]',
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
                activeTab === 'analysis' ? 'text-[#1F1F1F]' : 'text-gray-500 hover:text-[#1F1F1F]',
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
            @add-manual="handleManualAddSource"
            @add-ai="handleAiSuggestedSource"
            @scrape="triggerScrape"
            @toggle-source="toggleSourceExpansion"
            @edit="startEditSource"
            @delete="deleteSource"
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
            @select-source="handleSelectSource"
            @select-revision-a="handleSelectRevisionA"
            @select-revision-b="handleSelectRevisionB"
          />
        </div>
      </section>

      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div class="mb-4 flex items-center justify-between gap-4">
          <h3 class="text-lg font-semibold text-[#1F1F1F]">Sub-Jurisdictions</h3>

          <button class="btn--default btn--with-icon btn--lg" @click="openSubJurisdictionModal">
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
          <p class="text-sm text-gray-500">Create one to begin categorizing legal domains.</p>
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

    <SubJurisdictionDialog
      :open="subJurisdictionModalOpen"
      :form="subJurisdictionForm"
      @update:open="(value) => !value && closeSubJurisdictionModal()"
      @update:form="(payload) => (subJurisdictionForm = { ...subJurisdictionForm, ...payload })"
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
          <DialogDescription>Update the name, description, and instructions.</DialogDescription>
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

          <div>
            <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">Instructions</label>
            <textarea
              v-model="editForm.prompt"
              rows="3"
              class="w-full rounded-lg border px-4 py-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
            />
          </div>

          <DialogFooter class="flex justify-end gap-3 pt-2">
            <button type="button" class="btn--secondary btn--lg" @click="showInlineEdit = false">
              Cancel
            </button>
            <button type="submit" class="btn--default btn--lg">Save Changes</button>
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
