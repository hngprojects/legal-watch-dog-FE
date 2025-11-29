<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Plus, Settings, /* Search, */ FilePlus } from 'lucide-vue-next'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import Swal from 'sweetalert2'

import aiIcon from '@/assets/icons/ai_icon.png'

import SuggestedSources from '@/views/dashboard/sources/SuggestedSources.vue'

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
const activeTab = ref<'analysis' | 'sources'>('analysis')

// Separate states for the two dropdowns to avoid conflicts
const showHeaderMenu = ref(false)
const showEmptyStateMenu = ref(false)

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

const revisionLimit = 5
const revisions = computed(() => sourceStore.revisions)
const revisionsLoading = computed(() => sourceStore.revisionsLoading)
const revisionsError = computed(() => sourceStore.revisionsError)
const revisionsPagination = computed(() => sourceStore.revisionsPagination)

const loadJurisdiction = async (id: string) => {
  loading.value = true

  const existing = jurisdictionStore.jurisdictions.find((j) => j.id === id)
  jurisdiction.value = existing || (await jurisdictionStore.fetchOne(id))

  if (!projectStore.projects.length) {
    await projectStore.fetchProjects(activeOrganizationId.value)
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

const getPaginationForSource = (sourceId: string) => revisionsPagination.value[sourceId]

// --- DROPDOWN HANDLERS ---

const closeAllMenus = () => {
  showHeaderMenu.value = false
  showEmptyStateMenu.value = false
}

const toggleHeaderMenu = () => {
  // Close others to ensure only one is open
  showEmptyStateMenu.value = false
  showHeaderMenu.value = !showHeaderMenu.value
}

const toggleEmptyStateMenu = () => {
  showHeaderMenu.value = false
  showEmptyStateMenu.value = !showEmptyStateMenu.value
}

const handleManualAddSource = () => {
  closeAllMenus()
  openAddSourceModal()
}

const handleAiSuggestedSource = () => {
  closeAllMenus()
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
  if (count > 0) {
    await sourceStore.fetchSources(jurisdiction.value!.id)
    Swal.fire('Success', `${count} source${count > 1 ? 's' : ''} added successfully!`, 'success')
  }
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

  const updated = await jurisdictionStore.updateJurisdiction(jurisdictionId.value, payload)

  if (updated) {
    jurisdiction.value = updated
    Swal.fire('Updated!', '', 'success')
    showInlineEdit.value = false
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

  if (created) closeSubJurisdictionModal()
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
  <main class="min-h-screen flex-1 bg-[#F8F7F5] px-6 py-8 lg:px-10 lg:py-12" @click="closeAllMenus">
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
      <button @click="goBack" class="mt-4 inline-flex items-center gap-2 text-[#401903] hover:underline">
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
                <RouterLink :to="{
                  name: 'organization-projects',
                  params: { organizationId: activeOrganizationId },
                }">
                  Projects
                </RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem v-if="jurisdiction.project_id && projectName">
              <BreadcrumbLink as-child>
                <RouterLink :to="{
                  name: 'project-detail',
                  params: { organizationId: activeOrganizationId, id: jurisdiction.project_id },
                }">
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
            <button type="button" class="btn--primary btn--sm">
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
        <div v-if="showInlineEdit">
          <form @submit.prevent="saveEdit" class="space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">Name</label>
              <input v-model="editForm.name"
                class="h-12 w-full rounded-lg border px-4 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none" />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">Description</label>
              <textarea v-model="editForm.description" rows="3"
                class="w-full rounded-lg border px-4 py-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none" />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-[#1F1F1F]"
                >Monitoring Instructions</label
              >
              <textarea
                v-model="editForm.prompt"
                rows="3"
                class="w-full rounded-lg border px-4 py-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
              />
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="showInlineEdit = false"
                class="btn rounded-lg border px-5 py-2.5 text-sm font-medium text-[#F1A75F]">
                Cancel
              </button>
              <button type="submit" class="rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div v-else class="flex flex-col gap-3">
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
              @click="activeTab = 'analysis'"
              :class="[
                'relative pb-4 text-sm font-semibold transition-colors',
                activeTab === 'analysis' ? 'text-[#1F1F1F]' : 'text-gray-500 hover:text-[#1F1F1F]',
              ]"
            >
              <span v-if="activeTab === 'analysis'" class="absolute inset-x-0 -bottom-px h-0.5 bg-[#401903]"></span>
            </button>

            <button
              @click="activeTab = 'sources'"
              :class="[
                'relative pb-4 text-sm font-semibold transition-colors',
                activeTab === 'sources' ? 'text-[#1F1F1F]' : 'text-gray-500 hover:text-[#1F1F1F]',
              ]"
            >
              Sources
              <span v-if="activeTab === 'sources'" class="absolute inset-x-0 -bottom-px h-0.5 bg-[#401903]"></span>
            </button>
          </div>
        </div>

        <div v-if="activeTab === 'analysis'" class="space-y-4 p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-[#1F1F1F]">Sources</h3>
              <p class="text-xs text-gray-500">Trigger scraping per source and view results.</p>
            </div>

            <div class="relative">
              <button class="btn--lg btn--primary btn--with-icon" @click.stop="toggleHeaderMenu">
                <Plus :size="16" /> Add Source
              </button>

              <div
                v-if="showHeaderMenu"
                class="absolute top-full right-0 z-50 mt-2 w-60 rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5"
              >
                <!-- <button
                  @click="handleSearchClick"
                  class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[#475467] hover:bg-gray-50"
                >
                   <Search :size="18" />
                   Search for sources.
                </button> -->

                <button @click="handleManualAddSource" class="btn btn--lg btn--with-icon">
                  <FilePlus :size="18" />
                  Add Source Manually
                </button>

                <button @click="handleAiSuggestedSource" class="btn btn--md btn--with-icon">
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
            <div
              v-if="sourcesError"
              class="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            >
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
                  class="btn--sm btn--primary btn--with-icon"
                  @click.stop="toggleEmptyStateMenu"
                >
                  <Plus :size="16" /> Add Source
                </button>

                <div
                  v-if="showEmptyStateMenu"
                  class="absolute top-full left-1/2 z-50 mt-2 w-60 -translate-x-1/2 rounded-xl bg-white p-1 text-left shadow-lg ring-1 ring-black/5"
                >
                  <!-- <button
                      @click="handleSearchClick"
                      class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[#475467] hover:bg-gray-50"
                    >
                        <Search :size="18" />
                        Search for sources.
                    </button> -->

                  <button @click="handleManualAddSource" class="btn btn--sm btn--with-icon">
                    <FilePlus :size="18" />
                    Add Source Manually
                  </button>

                  <button
                    @click="handleAiSuggestedSource"
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
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ source.name }}</p>
                    <p class="text-xs text-gray-500">{{ source.url }}</p>
                    <p class="text-[11px] tracking-wide text-gray-400 uppercase">
                      {{ source.source_type }} • {{ source.scrape_frequency }}
                    </p>
                  </div>

                  <div class="flex flex-wrap items-center justify-end gap-2">
                    <button
                      class="btn--sm btn--primary"
                      :disabled="scraping[source.id]"
                      @click="triggerScrape(source)"
                    >
                      <span v-if="scraping[source.id]">Scraping...</span>
                      <span v-else>Scrape Now</span>
                    </button>

                    <button
                      class="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      @click="toggleSourceExpansion(source.id)"
                    >
                      {{ expandedSources[source.id] ? 'Hide History' : 'View History' }}
                    </button>

                    <button
                      class="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      @click="startEditSource(source)"
                    >
                      Edit
                    </button>

                    <button
                      class="rounded-lg border border-red-100 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      @click="deleteSource(source)"
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
                  <div v-if="revisionsLoading[source.id]" class="text-sm text-gray-600">
                    Loading revisions...
                  </div>

                  <div v-else-if="revisionsError[source.id]" class="text-sm text-red-600">
                    {{ revisionsError[source.id] }}
                  </div>

                  <div v-else-if="revisions[source.id]?.length" class="space-y-2">
                    <div
                      v-for="rev in revisions[source.id]"
                      :key="rev.id"
                      class="rounded-lg border border-gray-200 bg-white px-3 py-2"
                    >
                      <div class="flex items-start justify-between gap-3">
                        <div class="space-y-1">
                          <p
                            class="text-[11px] font-semibold tracking-wide text-gray-500 uppercase"
                          >
                            Scraped {{ new Date(rev.scraped_at).toLocaleString() }}
                          </p>
                          <p class="text-sm font-semibold text-gray-900">
                            {{
                              rev.ai_summary || rev.extracted_data?.title || 'No summary available'
                            }}
                          </p>
                          <p
                            v-if="
                              rev.ai_confidence_score !== undefined &&
                              rev.ai_confidence_score !== null
                            "
                            class="text-[11px] text-gray-500"
                          >
                            Confidence: {{ Math.round(rev.ai_confidence_score * 100) }}%
                          </p>
                        </div>

                        <span
                          class="rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide uppercase"
                          :class="
                            rev.was_change_detected
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          "
                        >
                          {{ rev.was_change_detected ? 'Change Detected' : 'No Change' }}
                        </span>
                      </div>

                    <div
                      v-if="rev.ai_markdown_summary || rev.ai_summary"
                      class="mt-2 text-[12px] leading-5 text-gray-700"
                      v-html="renderSummary(rev.ai_markdown_summary || rev.ai_summary)"
                    />
                  </div>

                    <div
                      v-if="getPaginationForSource(source.id)"
                      class="flex items-center justify-between border-t border-gray-200 pt-2 text-[12px] text-gray-600"
                    >
                      <span>
                        Page {{ getPaginationForSource(source.id)?.page }} of
                        {{ getPaginationForSource(source.id)?.total_pages }}
                      </span>

                      <div class="flex items-center gap-2">
                        <button
                          class="rounded border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                          :disabled="
                            revisionsLoading[source.id] ||
                            (getPaginationForSource(source.id)?.page ?? 1) <= 1
                          "
                          @click="
                            fetchRevisionsForSource(
                              source.id,
                              (getPaginationForSource(source.id)?.page ?? 1) - 1,
                            )
                          "
                        >
                          Previous
                        </button>

                        <button
                          class="rounded border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                          :disabled="
                            revisionsLoading[source.id] ||
                            (getPaginationForSource(source.id)?.page ?? 1) >=
                              (getPaginationForSource(source.id)?.total_pages ?? 1)
                          "
                          @click="
                            fetchRevisionsForSource(
                              source.id,
                              (getPaginationForSource(source.id)?.page ?? 1) + 1,
                            )
                          "
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>

                  <div v-else class="text-sm text-gray-600">
                    No revisions found for this source yet.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="p-6">
          <div v-if="showSuggestedSources">
            <SuggestedSources
              :jurisdiction-id="jurisdiction?.id || ''"
              :jurisdiction-name="jurisdiction?.name || ''"
              :jurisdiction-description="jurisdiction?.description || ''"
              :project-description="projectName"
              @cancel="cancelSuggestions"
              @save="handleSuggestionsSaved"
              @sources-added="sourceStore.fetchSources(jurisdiction?.id || '')"
            />
          </div>

          <div v-else>
            <h3 class="mb-4 text-lg font-semibold text-[#1F1F1F]">Data Sources</h3>

            <div v-if="sourcesLoading" class="space-y-2">
              <div
                v-for="n in 3"
                :key="n"
                class="h-12 w-full animate-pulse rounded-lg bg-gray-100"
              />
            </div>

            <div v-else>
              <div
                v-if="sourcesError"
                class="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {{ sourcesError }}
              </div>

              <ul v-if="sources.length" class="space-y-2">
                <li
                  v-for="source in sources"
                  :key="source.id"
                  class="flex items-center justify-between rounded-lg border border-gray-100 bg-[#FAFAFA] px-4 py-3 text-sm text-[#3D2E1F]"
                >
                  <div>
                    <p class="font-semibold text-gray-900">{{ source.name }}</p>
                    <p class="text-xs text-gray-500">{{ source.url }}</p>
                    <p class="text-[11px] tracking-wide text-gray-400 uppercase">
                      {{ source.source_type }} • {{ source.scrape_frequency }}
                    </p>
                  </div>

                  <div class="flex items-center gap-2">
                    <button
                      class="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                      @click="startEditSource(source)"
                    >
                      Edit
                    </button>

                    <button
                      class="rounded-lg border border-red-100 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      @click="deleteSource(source)"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              </ul>

              <div
                v-else
                class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center"
              >
                <p class="text-sm text-gray-500">No sources available.</p>
                <p class="text-xs text-gray-400">Add one to start monitoring.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div class="mb-4 flex items-center justify-between gap-4">
          <h3 class="text-lg font-semibold text-[#1F1F1F]">Sub-Jurisdictions</h3>

          <button class="btn--primary btn--with-icon btn--lg" @click="openSubJurisdictionModal">
            <Plus :size="16" /> Add Sub-jurisdiction
          </button>
        </div>

        <div
          v-if="subJurisdictions.length === 0"
          class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center"
        >
          <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>

          <p class="mb-1 text-base font-medium text-gray-900">No Sub-Jurisdictions</p>
          <p class="text-sm text-gray-500">Create one to begin categorizing legal domains.</p>
        </div>

        <div v-else class="space-y-3">
          <article v-for="node in subJurisdictions" :key="node.id" @click="goToJurisdiction(node.id)"
            class="group cursor-pointer rounded-lg bg-white p-6 shadow ring-1 ring-gray-200/60 transition-all hover:shadow-md hover:ring-[#401903]/10"
            :style="{ paddingLeft: `${node.depth * 16 + 16}px` }">
            <h4 class="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-[#401903]">
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

    <teleport to="body">
      <div
        v-if="subJurisdictionModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        @click.self="closeSubJurisdictionModal">
        <div class="relative w-full max-w-[520px] rounded-2xl bg-white p-8 shadow-2xl">
          <h3 class="mb-2 text-2xl font-bold text-gray-900">Define your Sub-Jurisdiction</h3>
          <p class="mb-6 text-sm text-gray-600">
            Define a specific legal domain or region to monitor
          </p>

          <form @submit.prevent="createSubJurisdiction" class="space-y-5">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-900">Sub-Jurisdiction Name</label>
              <input v-model="subJurisdictionForm.name" type="text" required placeholder="e.g Global Visa Monitoring"
                class="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm placeholder-gray-400 focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none" />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-gray-900">Description</label>
              <textarea v-model="subJurisdictionForm.description" rows="4" required
                placeholder="What legal areas will you monitor?"
                class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder-gray-400 focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button type="button" @click="closeSubJurisdictionModal"
                class="btn rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700">
                Cancel
              </button>

              <button type="submit" class="btn--primary">Create Sub-Jurisdiction</button>
            </div>
          </form>
        </div>
      </div>

      <div
        v-if="addSourceModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        @click.self="closeAddSourceModal">
        <div class="relative w-full max-w-[520px] rounded-2xl bg-white p-8 shadow-2xl">
          <h3 class="mb-2 text-2xl font-bold text-gray-900">
            {{ editingSourceId ? 'Edit Source' : 'Add Source' }}
          </h3>
          <p class="mb-6 text-sm text-gray-600">
            Attach a source to monitor for this jurisdiction.
          </p>

          <form @submit.prevent="editingSourceId ? saveEditedSource() : createSourceFromForm()" class="space-y-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-800">Name</label>
              <input v-model="sourceForm.name" required
                class="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                placeholder="e.g. Supreme Court Opinions" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-800">URL</label>
              <input v-model="sourceForm.url" type="url" required
                class="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                placeholder="https://example.com" />
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-800">Source Type</label>
                <select v-model="sourceForm.source_type"
                  class="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none">
                  <option value="web">Web</option>
                  <option value="api">API</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-gray-800">Scrape Frequency</label>
                <select v-model="sourceForm.scrape_frequency"
                  class="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none">
                  <option value="HOURLY">Hourly</option>
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>
            </div>

            <div v-if="sourcesError" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {{ sourcesError }}
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button type="button" @click="closeAddSourceModal"
                class="btn rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700">
                Cancel
              </button>

              <button
                type="submit"
                :disabled="sourcesLoading"
                class="btn--primary btn--with-icon btn--lg"
              >
                <span v-if="sourcesLoading">Saving...</span>
                <span v-else>{{ editingSourceId ? 'Save Changes' : 'Add Source' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </main>
</template>
