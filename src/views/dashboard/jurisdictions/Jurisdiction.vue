<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Plus, Settings, MoreVertical, Trash2, Edit3 } from 'lucide-vue-next'
import Swal from 'sweetalert2'

import type { Jurisdiction } from '@/api/jurisdiction'
import type { Source, SourceType, ScrapeFrequency } from '@/types/source'
import { fetchSourcesByJurisdiction, updateSource, deleteSource } from '@/api/sources'

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

const jurisdictionId = computed(() => route.params.id as string)

const jurisdiction = ref<Jurisdiction | null>(null)
const loading = ref(true)
const activeTab = ref<'analysis' | 'sources' | 'output'>('analysis')

const showSettingsMenu = ref(false)
const showInlineEdit = ref(false)

const sources = ref<Source[]>([])
const loadingSources = ref(true)

const editModalOpen = ref(false)
const editingSource = ref<Source | null>(null)

const editForm = ref({
  name: '',
  url: '',
  source_type: '' as SourceType,
  scrape_frequency: '' as ScrapeFrequency,
  is_active: true,
})

const activeMenuId = ref<string | null>(null)

const toggleMenu = (sourceId: string, event: MouseEvent) => {
  event.stopPropagation()
  activeMenuId.value = activeMenuId.value === sourceId ? null : sourceId
}

const closeMenuOnClickOutside = () => {
  activeMenuId.value = null
}

onMounted(() => {
  document.addEventListener('click', closeMenuOnClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenuOnClickOutside)
})

const sourceTypeOptions = [
  { value: 'web', label: 'Website' },
  { value: 'rss', label: 'RSS Feed' },
  { value: 'api', label: 'API' },
  { value: 'pdf', label: 'PDF Document' },
  { value: 'newsletter', label: 'Newsletter' },
]

const frequencyOptions = [
  { value: 'HOURLY', label: 'Hourly' },
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
]

const openEditModal = (source: Source) => {
  editingSource.value = source
  editForm.value = {
    name: source.name,
    url: source.url,
    source_type: source.source_type,
    scrape_frequency: source.scrape_frequency as ScrapeFrequency,
    is_active: source.is_active,
  }
  editModalOpen.value = true
  activeMenuId.value = null
}

const closeEditModal = () => {
  editModalOpen.value = false
  editingSource.value = null
}

const formatKey = (key: string) =>
  key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

const stringifyValue = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map(stringifyValue).join(', ')
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return String(value)
}

const normalizeOutput = (raw: unknown): OutputItem[] => {
  if (!raw) return []

  if (Array.isArray(raw)) {
    return raw
      .map((item, index) => {
        if (typeof item === 'string') return { title: item }
        if (typeof item === 'object' && item !== null) {
          const r = item as Record<string, unknown>
          const title =
            (r.title as string) ||
            (r.heading as string) ||
            (r.change as string) ||
            `Update ${index + 1}`
          const detail =
            (r.detail as string) ||
            (r.description as string) ||
            (r.summary as string) ||
            stringifyValue(r)
          return { title, detail }
        }
        return { title: `Update ${index + 1}`, detail: stringifyValue(item) }
      })
      .filter((i) => i.title || i.detail)
  }

  if (typeof raw === 'object' && raw !== null) {
    const r = raw as Record<string, unknown>
    const list = r.changes || r.updates || r.items
    if (Array.isArray(list)) return normalizeOutput(list)
    return Object.entries(r).map(([k, v]) => ({
      title: formatKey(k),
      detail: stringifyValue(v),
    }))
  }

  return [{ title: String(raw) }]
}

const outputItems = computed<OutputItem[]>(() => normalizeOutput(jurisdiction.value?.scrape_output))

const lastUpdatedText = computed(() => {
  if (!jurisdiction.value) return ''
  const ts = jurisdiction.value.updated_at || jurisdiction.value.created_at
  return ts ? new Date(ts).toLocaleString() : ''
})

const subJurisdictions = computed<NestedJurisdiction[]>(() => {
  if (!jurisdiction.value) return []
  const walk = (parentId: string, depth = 0): NestedJurisdiction[] =>
    jurisdictionStore.jurisdictions
      .filter((j) => j.parent_id === parentId)
      .flatMap((child) => [{ ...child, depth }, ...walk(child.id, depth + 1)])
  return walk(jurisdiction.value.id, 0)
})

const projectName = computed(() => {
  if (!jurisdiction.value?.project_id) return ''
  const p = projectStore.projects.find((pr) => pr.id === jurisdiction.value?.project_id)
  return p?.title || 'Project'
})

const parentJurisdiction = computed(() => {
  if (!jurisdiction.value?.parent_id) return null
  return jurisdictionStore.jurisdictions.find((j) => j.id === jurisdiction.value?.parent_id) || null
})

const loadSources = async () => {
  if (!jurisdiction.value) return
  loadingSources.value = true
  try {
    sources.value = await fetchSourcesByJurisdiction(jurisdiction.value.id)
  } catch (error: unknown) {
    const err = error as { message?: string }
    Swal.fire('Error', err.message || 'Failed to load sources', 'error')
    sources.value = []
  } finally {
    loadingSources.value = false
  }
}

const loadJurisdiction = async (id: string) => {
  loading.value = true
  const existing = jurisdictionStore.jurisdictions.find((j) => j.id === id)
  jurisdiction.value = existing || (await jurisdictionStore.fetchOne(id))

  if (!projectStore.projects.length) await projectStore.fetchProjects()
  if (jurisdiction.value?.project_id) {
    await jurisdictionStore.fetchJurisdictions(jurisdiction.value.project_id)
  }

  await loadSources()
  loading.value = false
}

watch(activeTab, (tab) => {
  if (tab === 'sources') loadSources()
})

const saveEditedSource = async () => {
  if (!editingSource.value) return

  try {
    const updated = await updateSource(editingSource.value.id, {
      name: editForm.value.name.trim(),
      url: editForm.value.url.trim(),
      source_type: editForm.value.source_type,
      scrape_frequency: editForm.value.scrape_frequency,
      is_active: editForm.value.is_active,
    })

    const idx = sources.value.findIndex((s) => s.id === updated.id)
    if (idx > -1) sources.value[idx] = updated

    Swal.fire('Updated!', 'Source updated successfully.', 'success')
    closeEditModal()
  } catch (error: unknown) {
    const err = error as { message?: string }
    Swal.fire('Error', err.message || 'Failed to update source', 'error')
  }
}

const confirmDelete = async (source: Source) => {
  const result = await Swal.fire({
    title: 'Delete source?',
    text: `"${source.name}" will be removed (soft-delete). You can restore it later.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
  })

  if (!result.isConfirmed) return

  try {
    await deleteSource(source.id)
    sources.value = sources.value.filter((s) => s.id !== source.id)
    Swal.fire('Deleted!', 'Source has been removed.', 'success')
    activeMenuId.value = null
  } catch (error: unknown) {
    const err = error as { message?: string }
    Swal.fire('Error', err.message || 'Failed to delete source', 'error')
  }
}

const handleDeleteClick = (source: Source) => {
  confirmDelete(source)
  activeMenuId.value = null
}

const navigateToAddSources = () => {
  router.push({ name: 'jurisdiction-sources', params: { id: jurisdictionId.value } })
}

const goBack = () => {
  if (jurisdiction.value?.project_id) {
    router.push(`/dashboard/projects/${jurisdiction.value.project_id}`)
  } else {
    router.push('/dashboard/projects')
  }
}

const toggleSettingsMenu = () => {
  showSettingsMenu.value = !showSettingsMenu.value
}

const startEdit = () => {
  editForm.value = {
    name: jurisdiction.value?.name || '',
    url: '',
    source_type: '' as SourceType,
    scrape_frequency: '' as ScrapeFrequency,
    is_active: true,
  }
  showInlineEdit.value = true
  showSettingsMenu.value = false
}

const saveEdit = async () => {
  try {
    const response = await jurisdictionStore.updateJurisdiction(jurisdictionId.value, {
      name: editForm.value.name,
    })

    if (response) jurisdiction.value = response

    await Swal.fire({
      title: 'Updated!',
      text: 'Jurisdiction updated successfully.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    })
    showInlineEdit.value = false
  } catch {
    Swal.fire('Error', jurisdictionStore.error || 'Failed to update jurisdiction', 'error')
  }
}

const deleteJurisdiction = async () => {
  showSettingsMenu.value = false
  const confirm = await Swal.fire({
    title: 'Delete Jurisdiction?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
  })

  if (!confirm.isConfirmed) return

  const projectId = jurisdiction.value?.project_id
  await jurisdictionStore.deleteJurisdiction(jurisdictionId.value)

  await Swal.fire({
    title: 'Deleted!',
    text: 'Jurisdiction successfully deleted.',
    icon: 'success',
    timer: 1500,
    showConfirmButton: false,
  })

  router.push(projectId ? `/dashboard/projects/${projectId}` : '/dashboard/projects')
}

const goToJurisdiction = (id: string) => {
  router.push(`/dashboard/jurisdictions/${id}`)
}

const openSubJurisdictionModal = () => {
  Swal.fire('Coming soon', 'Sub-jurisdiction creation is in development', 'info')
}

onMounted(() => loadJurisdiction(jurisdictionId.value))

watch(jurisdictionId, (newId) => {
  if (newId) loadJurisdiction(newId)
})

watch(
  () => jurisdictionStore.jurisdictions,
  (list) => {
    const found = list.find((j) => j.id === jurisdictionId.value)
    if (found) jurisdiction.value = found
  },
  { deep: true },
)
</script>

<template>
  <main class="min-h-screen flex-1 bg-[#F8F7F5] px-6 py-8 lg:px-10 lg:py-12">
    <!-- Loading State -->
    <div v-if="loading" class="mx-auto max-w-6xl">
      <div class="space-y-4">
        <div class="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
        <div class="h-8 w-80 animate-pulse rounded bg-gray-200"></div>
        <div class="h-24 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"></div>
      </div>
    </div>

    <!-- Not Found -->
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

    <!-- Main Content -->
    <div v-else class="mx-auto max-w-6xl space-y-6 lg:space-y-8">
      <!-- Header + Settings -->
      <header class="flex flex-wrap items-start justify-between gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink as-child>
                <RouterLink to="/dashboard/projects">Projects</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem v-if="jurisdiction.project_id && projectName">
              <BreadcrumbLink as-child>
                <RouterLink :to="`/dashboard/projects/${jurisdiction.project_id}`">
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

        <div class="relative">
          <button
            @click.stop="toggleSettingsMenu"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50"
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

      <!-- Jurisdiction Info -->
      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <template v-if="showInlineEdit">
          <form @submit.prevent="saveEdit" class="space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">Jurisdiction Name</label>
              <input
                v-model="editForm.name"
                class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4"
              />
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                @click="showInlineEdit = false"
                class="rounded-lg border border-[#F1A75F] px-5 py-2.5 text-sm font-medium text-[#F1A75F] hover:bg-orange-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2a1102]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </template>
        <template v-else>
          <p class="text-xs font-semibold tracking-[0.15em] text-[#C17A3F] uppercase">
            Jurisdiction
          </p>
          <h1 class="text-3xl font-bold text-[#1F1F1F]">{{ jurisdiction.name }}</h1>
          <p v-if="jurisdiction.description" class="text-base leading-relaxed text-[#4B5563]">
            {{ jurisdiction.description }}
          </p>
          <p v-if="lastUpdatedText" class="text-sm text-gray-400">Updated {{ lastUpdatedText }}</p>
        </template>
      </section>

      <!-- Tabs -->
      <section class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <div class="border-b border-gray-100 px-6 py-4">
          <div class="flex gap-8">
            <button
              @click="activeTab = 'analysis'"
              :class="activeTab === 'analysis' ? 'text-[#1F1F1F]' : 'text-gray-500'"
              class="relative pb-4 text-sm font-semibold"
            >
              Analysis
              <span
                v-if="activeTab === 'analysis'"
                class="absolute inset-x-0 -bottom-px h-0.5 bg-[#401903]"
              ></span>
            </button>
            <button
              @click="activeTab = 'output'"
              :class="activeTab === 'output' ? 'text-[#1F1F1F]' : 'text-gray-500'"
              class="relative pb-4 text-sm font-semibold"
            >
              Output
              <span
                v-if="activeTab === 'output'"
                class="absolute inset-x-0 -bottom-px h-0.5 bg-[#401903]"
              ></span>
            </button>
            <button
              @click="activeTab = 'sources'"
              :class="activeTab === 'sources' ? 'text-[#1F1F1F]' : 'text-gray-500'"
              class="relative pb-4 text-sm font-semibold"
            >
              Sources
              <span
                v-if="activeTab === 'sources'"
                class="absolute inset-x-0 -bottom-px h-0.5 bg-[#401903]"
              ></span>
            </button>
          </div>
        </div>

        <!-- Analysis Tab -->
        <div v-if="activeTab === 'analysis'" class="p-6">
          <div class="flex flex-col items-center justify-center px-8 py-16 text-center">
            <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg
                class="h-8 w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 class="mb-2 text-lg font-semibold text-gray-900">No Analysis found</h3>
            <p class="mb-6 max-w-md text-sm text-gray-500">
              Add sources to generate your first document.
            </p>
            <button
              @click="navigateToAddSources"
              class="flex items-center gap-2 rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2a1102]"
            >
              <span>+</span> Add Sources
            </button>
          </div>
        </div>

        <!-- Output Tab -->
        <div v-else-if="activeTab === 'output'" class="p-6">
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
                class="mt-2 text-sm leading-6 whitespace-pre-line text-[#4B5563]"
              >
                {{ item.detail }}
              </p>
            </article>
          </div>
          <div
            v-else
            class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center"
          >
            <p class="text-sm text-gray-500">No output has been generated for this jurisdiction.</p>
            <p class="text-xs text-gray-400">
              Connect sources or add monitoring instructions to see updates.
            </p>
          </div>
        </div>

        <!-- Sources Tab -->
        <div v-else class="p-6">
          <div class="mb-6 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-[#1F1F1F]">Sources</h3>
            <button
              @click="navigateToAddSources"
              class="flex items-center gap-2 rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2a1102]"
            >
              <Plus :size="16" /> Add Source
            </button>
          </div>

          <div v-if="loadingSources" class="space-y-4">
            <div v-for="i in 3" :key="i" class="h-24 animate-pulse rounded-lg bg-gray-100"></div>
          </div>

          <div v-else-if="sources.length" class="space-y-4">
            <article
              v-for="source in sources"
              :key="source.id"
              class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div class="flex flex-1 items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#401903]/10">
                  <svg
                    class="h-5 w-5 text-[#401903]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m4.950-5.05a4 4 0 010 5.656l-4 4a4 4 0 01-5.656-5.656l1.102-1.101"
                    />
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-[#1F1F1F]">{{ source.name }}</h4>
                  <p class="max-w-xl truncate text-sm text-gray-500">{{ source.url }}</p>
                </div>
              </div>

              <div class="flex items-center gap-6 text-sm">
                <span
                  :class="
                    source.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  "
                  class="rounded-full px-3 py-1 text-xs font-medium"
                >
                  {{ source.is_active ? 'Active' : 'Paused' }}
                </span>
                <span class="text-gray-500 capitalize">{{ source.source_type }}</span>
                <span class="text-gray-400">{{ source.scrape_frequency }}</span>

                <div class="relative">
                  <button
                    @click.stop="toggleMenu(source.id, $event)"
                    class="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
                  >
                    <MoreVertical :size="18" class="text-gray-500" />
                  </button>

                  <div
                    v-if="activeMenuId === source.id"
                    class="absolute top-10 right-0 z-20 w-48 overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5"
                    @click.stop
                  >
                    <button
                      @click="openEditModal(source)"
                      class="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Edit3 :size="16" /> Edit Source
                    </button>
                    <button
                      @click="handleDeleteClick(source)"
                      class="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                    >
                      <Trash2 :size="16" /> Delete Source
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div
            v-else
            class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center"
          >
            <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg
                class="h-8 w-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m4.950-5.05a4 4 0 010 5.656l-4 4a4 4 0 01-5.656-5.656l1.102-1.101"
                />
              </svg>
            </div>
            <h3 class="mb-2 text-lg font-semibold text-gray-900">No sources added yet</h3>
            <p class="mb-6 max-w-md text-sm text-gray-500">
              Connect websites, RSS feeds, or documents to start monitoring legal changes.
            </p>
            <button
              @click="navigateToAddSources"
              class="flex items-center gap-2 rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2a1102]"
            >
              <Plus :size="16" /> Add Your First Source
            </button>
          </div>
        </div>
      </section>

      <!-- Sub-Jurisdictions -->
      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div class="mb-4 flex items-center justify-between gap-4">
          <h3 class="text-lg font-semibold text-[#1F1F1F]">Sub-Jurisdiction</h3>
          <button
            @click="openSubJurisdictionModal"
            class="flex items-center gap-2 rounded-full bg-[#401903] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a1102]"
          >
            <Plus :size="16" /> Add Sub-jurisdiction
          </button>
        </div>

        <div
          v-if="subJurisdictions.length === 0"
          class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center"
        >
          <div class="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <svg
              class="h-7 w-7 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p class="mb-1 text-base font-medium text-gray-900">No Jurisdictions added</p>
          <p class="text-sm text-gray-500">Search source or Click add sources to get started.</p>
        </div>

        <div v-else class="space-y-3">
          <article
            v-for="node in subJurisdictions"
            :key="node.id"
            @click="goToJurisdiction(node.id)"
            class="group cursor-pointer rounded-lg bg-white p-6 shadow ring-1 ring-gray-200/60 transition-all hover:shadow-md hover:ring-[#401903]/10"
            :style="{ paddingLeft: `${node.depth * 16 + 16}px` }"
          >
            <h4 class="mb-2 text-lg font-bold text-gray-900 group-hover:text-[#401903]">
              {{ node.name }}
            </h4>
            <p class="text-sm leading-relaxed text-gray-600">{{ node.description }}</p>
            <p class="mt-2 text-xs text-gray-400">
              {{ new Date(node.created_at).toLocaleString() }}
            </p>
          </article>
        </div>
      </section>
    </div>

    <!-- Edit Source Modal -->
    <teleport to="body">
      <div
        v-if="editModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        @click.self="closeEditModal"
      >
        <div class="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
          <h3 class="mb-6 text-2xl font-bold text-[#1F1F1F]">Edit Source</h3>
          <form @submit.prevent="saveEditedSource" class="space-y-6">
            <div>
              <label class="mb-2 block text-sm font-medium"
                >Name <span class="text-red-500">*</span></label
              >
              <input
                v-model="editForm.name"
                required
                class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium"
                >URL <span class="text-red-500">*</span></label
              >
              <input
                v-model="editForm.url"
                type="url"
                required
                class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">Type</label>
              <select
                v-model="editForm.source_type"
                class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4"
              >
                <option v-for="opt in sourceTypeOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">Scrape Frequency</label>
              <select
                v-model="editForm.scrape_frequency"
                class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4"
              >
                <option v-for="opt in frequencyOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>
            <div class="flex items-center gap-3">
              <input type="checkbox" v-model="editForm.is_active" id="is_active" class="h-5 w-5" />
              <label for="is_active" class="text-sm font-medium">Active (monitoring enabled)</label>
            </div>
            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="closeEditModal"
                class="rounded-lg border border-[#D5D7DA] px-6 py-2.5"
              >
                Cancel
              </button>
              <button type="submit" class="rounded-lg bg-[#401903] px-6 py-2.5 text-white">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </main>
</template>
