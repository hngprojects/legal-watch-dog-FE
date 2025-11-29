<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Plus, Settings } from 'lucide-vue-next'
import Swal from 'sweetalert2'

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

import { useJurisdictionStore } from '@/stores/jurisdiction-store'
import { useProjectStore } from '@/stores/project-store'
import { useOrganizationStore } from '@/stores/organization-store'
import { useSourceStore } from '@/stores/source-store'

interface StoredScrapeResult {
  id: string
  jurisdictionId: string
  sourceId: string
  sourceName: string
  status: string
  fetchedAt: string
  summary: string
  payload?: unknown
}

interface OutputItem {
  title: string
  detail?: string
}

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
  return orgStore.organizations.find(
    (org) => org.id === activeOrganizationId.value
  )?.name || ''
})

const jurisdictionId = computed(() => route.params.id as string)
const jurisdiction = ref<Jurisdiction | null>(null)
const projectName = computed(() => {
  const projId = jurisdiction.value?.project_id
  if (!projId) return ''
  const project = projectStore.projects.find((p) => p.id === projId)
  return project?.title || project?.name || ''
})

const loading = ref(true)
const activeTab = ref<'analysis' | 'sources' | 'output'>('analysis')

const showSettingsMenu = ref(false)
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

// interface ScrapeResponseData {
//   summary?: string
//   payload?: unknown
// }


const sources = computed(() => sourceStore.sources)
const sourcesLoading = computed(() => sourceStore.loading)
const sourcesError = computed(() => sourceStore.error)
const editingSourceId = ref<string | null>(null)

// const scrapingState = ref<Record<string, boolean>>({})
const scrapeResults = ref<Record<string, StoredScrapeResult>>({})
const scrapeErrors = ref<Record<string, string>>({})

const storedScrapeResults = ref<StoredScrapeResult[]>([])
const expandedSources = ref<Record<string, boolean>>({})

const STORAGE_KEY = 'lawdog-scrape-results'

const loadStoredScrapeResults = () => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return

  const parsed: StoredScrapeResult[] = JSON.parse(raw)
  storedScrapeResults.value = parsed.filter(
    (item) => item.jurisdictionId === jurisdictionId.value,
  )

  const latest: Record<string, StoredScrapeResult> = {}

  for (const item of storedScrapeResults.value) {
    const existing = latest[item.sourceId]
    if (
      !existing ||
      new Date(item.fetchedAt).getTime() > new Date(existing.fetchedAt).getTime()
    ) {
      latest[item.sourceId] = item
    }
  }

  scrapeResults.value = latest
}

// const persistScrapeResult = (result: StoredScrapeResult) => {
//   const next = [result, ...storedScrapeResults.value]
//   storedScrapeResults.value = next
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
// }

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

// const startScrape = async (source: Source) => {
//   scrapingState.value[source.id] = true
//   scrapeErrors.value[source.id] = ''

//   const res = await sourceStore.scrapeSource(source.id)

//   scrapingState.value[source.id] = false

//   if (!res) {
//     scrapeErrors.value[source.id] = 'Scrape failed'
//     return
//   }

//   const stored: StoredScrapeResult = {
//     id: `${source.id}-${Date.now()}`,
//     jurisdictionId: jurisdictionId.value,
//     sourceId: source.id,
//     sourceName: source.name,
//     status: 'completed',
//     fetchedAt: new Date().toISOString(),
//     summary: res.summary ?? 'Scrape completed',
//     payload: res.payload ?? {},
//   }

//   scrapeResults.value[source.id] = stored
//   persistScrapeResult(stored)
// }

const stringifyValue = (v: unknown) => {
  if (typeof v === 'string') return v
  try {
    return JSON.stringify(v, null, 2)
  } catch {
    return String(v)
  }
}

const normalizeOutput = (raw: unknown): OutputItem[] => {
  if (!raw) return []

  if (Array.isArray(raw)) {
    return raw.map((item, i) => ({
      title: `Update ${i + 1}`,
      detail: stringifyValue(item),
    }))
  }

  if (typeof raw === 'object') {
    return Object.entries(raw as Record<string, unknown>).map(([key, val]) => ({
      title: key,
      detail: stringifyValue(val),
    }))
  }

  return [{ title: 'Result', detail: stringifyValue(raw) }]
}

const outputItems = computed(() => normalizeOutput(jurisdiction.value?.scrape_output))

const goBack = () => {
  router.push({ name: 'organization-projects', params: { organizationId: activeOrganizationId.value } })
}

const toggleSettingsMenu = () => (showSettingsMenu.value = !showSettingsMenu.value)
const closeSettingsMenu = () => (showSettingsMenu.value = false)

const startEdit = () => {
  editForm.value = {
    name: jurisdiction.value?.name ?? '',
    description: jurisdiction.value?.description ?? '',
    prompt: jurisdiction.value?.prompt ?? '',
  }
  showInlineEdit.value = true
  closeSettingsMenu()
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
  closeSettingsMenu()

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
  loadStoredScrapeResults()
})
</script>



<template>
  <main class="min-h-screen flex-1 bg-[#F8F7F5] px-6 py-8 lg:px-10 lg:py-12">
    <!-- Loading state -->
    <div v-if="loading" class="mx-auto max-w-6xl">
      <div class="space-y-4">
        <div class="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
        <div class="h-8 w-80 animate-pulse rounded bg-gray-200"></div>
        <div class="h-24 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"></div>
      </div>
    </div>

    <!-- No jurisdiction -->
    <div v-else-if="!jurisdiction" class="mx-auto max-w-4xl rounded-2xl bg-white p-10 text-center shadow-sm">
      <h1 class="text-2xl font-semibold text-gray-900">Jurisdiction not found</h1>
      <button
        @click="goBack"
        class="mt-4 inline-flex items-center gap-2 text-[#401903] hover:underline"
      >
        Back to Projects
      </button>
    </div>

    <!-- Main -->
    <div v-else class="mx-auto max-w-6xl space-y-6 lg:space-y-8">
      <!-- BREADCRUMBS + HEADER -->
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
                <RouterLink :to="{ name: 'organization-projects', params: { organizationId: activeOrganizationId } }">
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

        <!-- Settings dropdown -->
        <div class="relative">
          <button
            @click.stop="toggleSettingsMenu"
            class="flex h-10 w-10 items-center justify-center rounded-lg border bg-white text-gray-600 shadow-sm hover:bg-gray-50"
          >
            <Settings :size="18" />
          </button>

          <div
            v-if="showSettingsMenu"
            @click.stop
            class="absolute right-0 z-50 mt-2 w-48 rounded-xl bg-white shadow-lg ring-1 ring-black/5"
          >
            <button
              @click="startEdit"
              class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              Edit Jurisdiction
            </button>
            <button
              @click="deleteJurisdiction"
              class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Delete Jurisdiction
            </button>
          </div>
        </div>
      </header>

      <!-- JURISDICTION DETAILS CARD -->
      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <!-- EDIT MODE -->
        <div v-if="showInlineEdit">
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
              <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">Monitoring Instructions</label>
              <textarea
                v-model="editForm.prompt"
                rows="3"
                class="w-full rounded-lg border px-4 py-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
              />
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                @click="showInlineEdit = false"
                class="rounded-lg border px-5 py-2.5 text-sm font-medium text-[#F1A75F]"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <!-- VIEW MODE -->
        <div v-else class="flex flex-col gap-3">
          <p class="text-xs font-semibold tracking-[0.15em] text-[#C17A3F] uppercase">
            Jurisdiction
          </p>
          <h1 class="text-3xl font-bold text-[#1F1F1F]">{{ jurisdiction.name }}</h1>
          <p
            v-if="jurisdiction.description"
            class="text-base leading-relaxed text-[#4B5563]"
          >
            {{ jurisdiction.description }}
          </p>
          <p v-if="lastUpdatedText" class="text-sm text-gray-400">
            Updated {{ lastUpdatedText }}
          </p>
        </div>
      </section>

      <!-- MAIN TAB SECTION -->
      <section class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <!-- TAB HEADERS -->
        <div class="border-b border-gray-100 px-6 py-4">
          <div class="flex gap-8">
            <button
              @click="activeTab = 'analysis'"
              :class="[
                'relative pb-4 text-sm font-semibold transition-colors',
                activeTab === 'analysis'
                  ? 'text-[#1F1F1F]'
                  : 'text-gray-500 hover:text-[#1F1F1F]',
              ]"
            >
              Analysis
              <span
                v-if="activeTab === 'analysis'"
                class="absolute inset-x-0 -bottom-px h-0.5 bg-[#401903]"
              ></span>
            </button>

            <button
              @click="activeTab = 'output'"
              :class="[
                'relative pb-4 text-sm font-semibold transition-colors',
                activeTab === 'output'
                  ? 'text-[#1F1F1F]'
                  : 'text-gray-500 hover:text-[#1F1F1F]',
              ]"
            >
              Output
              <span
                v-if="activeTab === 'output'"
                class="absolute inset-x-0 -bottom-px h-0.5 bg-[#401903]"
              ></span>
            </button>

            <button
              @click="activeTab = 'sources'"
              :class="[
                'relative pb-4 text-sm font-semibold transition-colors',
                activeTab === 'sources'
                  ? 'text-[#1F1F1F]'
                  : 'text-gray-500 hover:text-[#1F1F1F]',
              ]"
            >
              Sources
              <span
                v-if="activeTab === 'sources'"
                class="absolute inset-x-0 -bottom-px h-0.5 bg-[#401903]"
              ></span>
            </button>
          </div>
        </div>

        <!-- ANALYSIS TAB -->
        <div v-if="activeTab === 'analysis'" class="space-y-4 p-6">
          <!-- Header -->
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-[#1F1F1F]">Sources</h3>
              <p class="text-xs text-gray-500">Trigger scraping per source and view results.</p>
            </div>

            <button
              class="inline-flex items-center gap-2 rounded-lg bg-[#401903] px-4 py-2 text-sm font-medium text-white"
              @click="openAddSourceModal"
            >
              <Plus :size="16" /> Add Source
            </button>
          </div>

          <!-- Loading skeleton -->
          <div v-if="sourcesLoading" class="space-y-2">
            <div v-for="n in 3" :key="n" class="h-12 w-full animate-pulse rounded-lg bg-gray-100" />
          </div>

          <!-- Error -->
          <div v-else-if="sourcesError" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {{ sourcesError }}
          </div>

          <!-- Empty -->
          <div
            v-else-if="sources.length === 0"
            class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center"
          >
            <p class="text-sm text-gray-500">No sources added yet.</p>
            <p class="text-xs text-gray-400">Add a source to begin scraping.</p>
            <button
              class="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white"
              @click="openAddSourceModal"
            >
              <Plus :size="16" /> Add Source
            </button>
          </div>

          <!-- Sources list -->
          <div v-else class="space-y-3">
            <div
              v-for="source in sources"
              :key="source.id"
              class="rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm"
            >
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ source.name }}</p>
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

                  <!-- <button
                    class="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    :disabled="scrapingState[source.id]"
                    @click="startScrape(source)"
                  >
                    {{ scrapingState[source.id] ? 'Scraping...' : 'Start Scrape' }}
                  </button> -->

                  <button
                    class="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    @click="expandedSources[source.id] = !expandedSources[source.id]"
                  >
                    {{ expandedSources[source.id] ? 'Hide Result' : 'View Result' }}
                  </button>

                  <button
                    class="rounded-lg border border-red-100 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    @click="deleteSource(source)"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <!-- Scrape error -->
              <div
                v-if="scrapeErrors[source.id]"
                class="mt-2 text-xs text-red-600"
              >
                {{ scrapeErrors[source.id] }}
              </div>

              <!-- Scrape result -->
              <div
                v-if="expandedSources[source.id] && scrapeResults[source.id]"
                class="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-800"
              >
                <div class="mb-1 text-[11px] font-semibold text-gray-500 uppercase">
                  Most Recent Result
                </div>
                <pre class="text-[11px] leading-5 whitespace-pre-wrap">
{{ JSON.stringify(scrapeResults[source.id], null, 2) }}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <!-- OUTPUT TAB -->
        <div v-else-if="activeTab === 'output'" class="space-y-6 p-6">
          <div>
            <h3 class="mb-4 text-lg font-semibold text-[#1F1F1F]">Latest Scrape Results</h3>

            <!-- Stored results -->
            <div v-if="storedScrapeResults.length" class="space-y-3">
              <article
                v-for="(item, index) in storedScrapeResults"
                :key="index"
                class="rounded-xl border border-[#F3E7DC] bg-[#FDF8F3] p-4"
              >
                <div class="flex items-center justify-between gap-2">
                  <p class="text-sm font-semibold text-[#3C2610]">{{ item.sourceName }}</p>
                  <span class="text-[11px] tracking-wide text-[#9CA3AF] uppercase">
                    {{ new Date(item.fetchedAt).toLocaleString() }}
                  </span>
                </div>

                <p class="mt-2 text-sm leading-6 text-[#4B5563]">
                  {{ item.summary }}
                </p>

                <pre
                  v-if="item.payload"
                  class="mt-3 text-xs leading-5 whitespace-pre-wrap text-[#374151]"
                >
{{ typeof item.payload === 'string' ? item.payload : JSON.stringify(item.payload, null, 2) }}
                </pre>
              </article>
            </div>

            <!-- No results -->
            <div
              v-else
              class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center"
            >
              <p class="text-sm text-gray-500">No scrape results yet.</p>
              <p class="text-xs text-gray-400">Trigger a scrape from the Analysis tab.</p>
            </div>
          </div>

          <!-- Processed Output -->
          <div>
            <h3 class="mb-4 text-lg font-semibold text-[#1F1F1F]">What Changed</h3>

            <div v-if="outputItems.length" class="space-y-3">
              <article
                v-for="(item, index) in outputItems"
                :key="index"
                class="rounded-xl border border-[#F3E7DC] bg-[#FDF8F3] p-4"
              >
                <p class="text-sm font-semibold text-[#3C2610]">{{ item.title }}</p>
                <p
                  v-if="item.detail"
                  class="mt-2 text-sm leading-relaxed whitespace-pre-line text-[#4B5563]"
                >
                  {{ item.detail }}
                </p>
              </article>
            </div>

            <div
              v-else
              class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center"
            >
              <p class="text-sm text-gray-500">No output generated.</p>
              <p class="text-xs text-gray-400">Add sources or monitoring instructions.</p>
            </div>
          </div>
        </div>

        <!-- SOURCES TAB -->
        <div v-else class="p-6">
          <h3 class="mb-4 text-lg font-semibold text-[#1F1F1F]">Sources</h3>

          <!-- Loading -->
          <div v-if="sourcesLoading" class="space-y-2">
            <div v-for="n in 3" :key="n" class="h-12 w-full animate-pulse rounded-lg bg-gray-100" />
          </div>

          <!-- Error -->
          <div v-else-if="sourcesError" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {{ sourcesError }}
          </div>

          <!-- List -->
          <ul v-else-if="sources.length" class="space-y-2">
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

          <!-- Empty -->
          <div
            v-else
            class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center"
          >
            <p class="text-sm text-gray-500">No sources available.</p>
            <p class="text-xs text-gray-400">Add one to start monitoring.</p>
          </div>
        </div>
      </section>

      <!-- SUBJURISDICTION SECTION -->
      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div class="mb-4 flex items-center justify-between gap-4">
          <h3 class="text-lg font-semibold text-[#1F1F1F]">Sub-Jurisdictions</h3>

          <button
            class="flex items-center gap-2 rounded-full bg-[#401903] px-4 py-2 text-sm font-medium text-white"
            @click="openSubJurisdictionModal"
          >
            <Plus :size="16" /> Add Sub-jurisdiction
          </button>
        </div>

        <!-- Empty -->
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

        <!-- List -->
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

    <!-- MODALS -->
    <teleport to="body">
      <!-- SUB-JURISDICTION MODAL -->
      <div
        v-if="subJurisdictionModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        @click.self="closeSubJurisdictionModal"
      >
        <div class="relative w-full max-w-[520px] rounded-2xl bg-white p-8 shadow-2xl">
          <h3 class="mb-2 text-2xl font-bold text-gray-900">Define your Sub-Jurisdiction</h3>
          <p class="mb-6 text-sm text-gray-600">
            Define a specific legal domain or region to monitor
          </p>

          <form @submit.prevent="createSubJurisdiction" class="space-y-5">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-900"
                >Sub-Jurisdiction Name</label
              >
              <input
                v-model="subJurisdictionForm.name"
                type="text"
                required
                placeholder="e.g Global Visa Monitoring"
                class="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm placeholder-gray-400 focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-gray-900">Description</label>
              <textarea
                v-model="subJurisdictionForm.description"
                rows="4"
                required
                placeholder="What legal areas will you monitor?"
                class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder-gray-400 focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
              ></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="closeSubJurisdictionModal"
                class="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                class="rounded-lg bg-[#401903] px-6 py-2.5 text-sm font-medium text-white"
              >
                Create Sub-Jurisdiction
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- SOURCE MODAL -->
      <div
        v-if="addSourceModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        @click.self="closeAddSourceModal"
      >
        <div class="relative w-full max-w-[520px] rounded-2xl bg-white p-8 shadow-2xl">
          <h3 class="mb-2 text-2xl font-bold text-gray-900">
            {{ editingSourceId ? 'Edit Source' : 'Add Source' }}
          </h3>
          <p class="mb-6 text-sm text-gray-600">
            Attach a source to monitor for this jurisdiction.
          </p>

          <form
            @submit.prevent="editingSourceId ? saveEditedSource() : createSourceFromForm()"
            class="space-y-4"
          >
            <div>
              <label class="mb-1 block text-sm font-medium text-gray-800">Name</label>
              <input
                v-model="sourceForm.name"
                required
                class="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                placeholder="e.g. Supreme Court Opinions"
              />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-800">URL</label>
              <input
                v-model="sourceForm.url"
                type="url"
                required
                class="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                placeholder="https://example.com"
              />
            </div>

            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label class="mb-1 block text-sm font-medium text-gray-800">Source Type</label>
                <select
                  v-model="sourceForm.source_type"
                  class="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                >
                  <option value="web">Web</option>
                  <option value="api">API</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-gray-800">Scrape Frequency</label>
                <select
                  v-model="sourceForm.scrape_frequency"
                  class="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                >
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
              <button
                type="button"
                @click="closeAddSourceModal"
                class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                :disabled="sourcesLoading"
                class="inline-flex items-center gap-2 rounded-lg bg-[#401903] px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-70"
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
