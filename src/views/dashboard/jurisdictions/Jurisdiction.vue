<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Plus, Settings, MoreVertical, Trash2, Edit3 } from 'lucide-vue-next'
import Swal from 'sweetalert2'

import type { Jurisdiction } from '@/api/jurisdiction'
import { sourceApi } from '@/api/source'
import type { Source } from '@/types/source'
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
const subJurisdictionModalOpen = ref(false)
const addSourceModalOpen = ref(false)
const organizationId = computed(() => {
  const id = route.query.organizationId
  return typeof id === 'string' ? id : ''
})

const sources = ref<Source[]>([])
const loadingSources = ref(true)

// Source edit modal
const editModalOpen = ref(false)
const editingSource = ref<Source | null>(null)

// Two separate forms
const jurisdictionEditForm = ref({
  name: '',
  description: '',
  prompt: '',
})

const sourceEditForm = ref({
  name: '',
  url: '',
  source_type: '' as SourceType,
  scrape_frequency: '' as ScrapeFrequency,
  is_active: true,
})

const sourceError = ref<string | null>(null)
const sourceLoading = ref(false)
const sourceForm = ref({
  name: '',
  url: '',
  source_type: 'web',
  scrape_frequency: 'DAILY',
  scraping_rules: '',
})
const sources = ref<Source[]>([])
const sourcesLoading = ref(false)
const sourcesError = ref<string | null>(null)
const editingSourceId = ref<string | null>(null)
const scrapingState = ref<Record<string, boolean>>({})
const scrapeResults = ref<Record<string, unknown>>({})
const scrapeErrors = ref<Record<string, string>>({})

const formatKey = (key: string) =>
  key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

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
  sourceEditForm.value = {
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

// Fixed: normalizeOutput restored
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
            JSON.stringify(r)
          return { title, detail }
        }
        return { title: `Update ${index + 1}`, detail: String(item) }
      })
      .filter((i) => i.title || i.detail)
  }

  if (typeof raw === 'object' && raw !== null) {
    const r = raw as Record<string, unknown>
    const list = r.changes || r.updates || r.items
    if (Array.isArray(list)) return normalizeOutput(list)
    return Object.entries(r).map(([k, v]) => ({
      title: k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      detail: String(v),
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

const projectOrganizationId = computed(() => {
  if (!jurisdiction.value?.project_id) return ''
  const project = projectStore.projects.find((p) => p.id === jurisdiction.value?.project_id)
  return project?.org_id || ''
})
const activeOrganizationId = computed(() => organizationId.value || projectOrganizationId.value)

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
    Swal.fire('Error', error instanceof Error ? error.message : 'Failed to load sources', 'error')
    sources.value = []
  } finally {
    loadingSources.value = false
  }
}

const loadJurisdiction = async (id: string) => {
  loading.value = true
  const existing = jurisdictionStore.jurisdictions.find((j) => j.id === id)
  jurisdiction.value = existing || (await jurisdictionStore.fetchOne(id))

  if (!projectStore.projects.length && activeOrganizationId.value) {
    await projectStore.fetchProjects(activeOrganizationId.value)
  }

  if (jurisdiction.value?.project_id) {
    await jurisdictionStore.fetchJurisdictions(jurisdiction.value.project_id)
    await fetchSources(jurisdiction.value.id)
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
      name: sourceEditForm.value.name.trim(),
      url: sourceEditForm.value.url.trim(),
      source_type: sourceEditForm.value.source_type,
      scrape_frequency: sourceEditForm.value.scrape_frequency,
      is_active: sourceEditForm.value.is_active,
    })

    const idx = sources.value.findIndex((s) => s.id === updated.id)
    if (idx > -1) sources.value[idx] = updated

    Swal.fire('Updated!', 'Source updated successfully.', 'success')
    closeEditModal()
  } catch (error: unknown) {
    Swal.fire('Error', error instanceof Error ? error.message : 'Failed to update source', 'error')
  }
}

const startEdit = () => {
  jurisdictionEditForm.value = {
    name: jurisdiction.value?.name || '',
    description: jurisdiction.value?.description || '',
    prompt: jurisdiction.value?.prompt || '',
  }
  showInlineEdit.value = true
  showSettingsMenu.value = false
}

const saveEdit = async () => {
  try {
    const response = await jurisdictionStore.updateJurisdiction(jurisdictionId.value, {
      name: jurisdictionEditForm.value.name,
      description: jurisdictionEditForm.value.description,
      prompt: jurisdictionEditForm.value.prompt,
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

const handleDeleteClick = async (source: Source) => {
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
  } catch {
    Swal.fire('Error', 'Failed to delete source', 'error')
  }
}

const goBack = () => {
  const targetOrgId = organizationId.value || projectOrganizationId.value

  if (jurisdiction.value?.project_id && targetOrgId) {
    router.push({
      name: 'project-detail',
      params: { organizationId: targetOrgId, id: jurisdiction.value.project_id },
    })
    return
  }

  if (targetOrgId) {
    router.push({ name: 'organization-projects', params: { organizationId: targetOrgId } })
    return
  }

  router.push({ name: 'organizations' })
}

const navigateToAddSources = () => {
  router.push({ name: 'jurisdiction-sources', params: { id: jurisdictionId.value } })
}

const toggleSettingsMenu = () => {
  showSettingsMenu.value = !showSettingsMenu.value
}

const closeSettingsMenu = () => {
  showSettingsMenu.value = false
}

const startEdit = () => {
  editForm.value = {
    name: jurisdiction.value?.name || '',
    description: jurisdiction.value?.description || '',
    prompt: jurisdiction.value?.prompt || '',
  }
  showInlineEdit.value = true
  closeSettingsMenu()
}

const saveEdit = async () => {
  try {
    const response = await jurisdictionStore.updateJurisdiction(jurisdictionId.value, {
      name: editForm.value.name || undefined,
      description: editForm.value.description || undefined,
      prompt: editForm.value.prompt || undefined,
    })

    if (response) {
      jurisdiction.value = response
    }

    await Swal.fire({
      title: 'Updated!',
      text: 'Jurisdiction updated successfully.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    })

    showInlineEdit.value = false
  } catch (err) {
    void err
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

  const targetOrgId = organizationId.value || projectOrganizationId.value

  if (projectId && targetOrgId) {
    router.push({
      name: 'project-detail',
      params: { organizationId: targetOrgId, id: projectId },
    })
    return
  }

  if (targetOrgId) {
    router.push({ name: 'organization-projects', params: { organizationId: targetOrgId } })
    return
  }

  router.push({ name: 'organizations' })
}

const openSubJurisdictionModal = () => {
  subJurisdictionModalOpen.value = true
  subJurisdictionForm.value = {
    name: '',
    description: '',
    prompt: '',
  }
  jurisdictionStore.setError(null)
}

const closeSubJurisdictionModal = () => {
  subJurisdictionModalOpen.value = false
  subJurisdictionForm.value = {
    name: '',
    description: '',
    prompt: '',
  }
  jurisdictionStore.setError(null)
}

const createSubJurisdiction = async () => {
  if (!jurisdiction.value) return
  jurisdictionStore.setError(null)

  if (!subJurisdictionForm.value.name.trim()) {
    jurisdictionStore.setError('Sub-jurisdiction name is required')
    return
  }

  if (!subJurisdictionForm.value.description.trim()) {
    jurisdictionStore.setError('Description is required')
    return
  }

  const created = await jurisdictionStore.addJurisdiction(jurisdiction.value.project_id, {
    name: subJurisdictionForm.value.name.trim(),
    description: subJurisdictionForm.value.description.trim(),
    prompt: subJurisdictionForm.value.prompt.trim() || null,
    parent_id: jurisdiction.value.id,
  })

  if (created) {
    closeSubJurisdictionModal()
  }
}

const fetchSources = async (jurisdictionId: string) => {
  sourcesLoading.value = true
  sourcesError.value = null
  try {
    const { data } = await sourceApi.list({ jurisdiction_id: jurisdictionId })
    sources.value = (data as any)?.data?.sources || (data as any)?.sources || []
  } catch (err) {
    const message =
      (err as any)?.response?.data?.message ||
      (err as any)?.response?.data?.detail ||
      'Failed to load sources'
    sourcesError.value = message
  } finally {
    sourcesLoading.value = false
  }
}

const openAddSourceModal = () => {
  addSourceModalOpen.value = true
  sourceError.value = null
  editingSourceId.value = null
  sourceForm.value = {
    name: '',
    url: '',
    source_type: 'web',
    scrape_frequency: 'DAILY',
    scraping_rules: '',
  }
}

const closeAddSourceModal = () => {
  addSourceModalOpen.value = false
  sourceError.value = null
  editingSourceId.value = null
}

const createSource = async () => {
  if (!jurisdiction.value) return
  sourceError.value = null
  sourceLoading.value = true

  let rules: Record<string, unknown> | null = null
  if (sourceForm.value.scraping_rules.trim()) {
    try {
      rules = JSON.parse(sourceForm.value.scraping_rules)
    } catch (e) {
      sourceError.value = 'Scraping rules must be valid JSON'
      sourceLoading.value = false
      return
    }
  }

  try {
    const payload = {
      jurisdiction_id: jurisdiction.value.id,
      name: sourceForm.value.name.trim(),
      url: sourceForm.value.url.trim(),
      source_type: sourceForm.value.source_type as 'web' | 'pdf' | 'api',
      scrape_frequency: sourceForm.value.scrape_frequency,
      scraping_rules: rules,
    }

    if (editingSourceId.value) {
      await sourceApi.update(editingSourceId.value, payload)
    } else {
      await sourceApi.create(payload)
    }

    // Refresh sources list and close
    await fetchSources(jurisdiction.value.id)
    await Swal.fire({
      title: editingSourceId.value ? 'Source updated' : 'Source added',
      text: editingSourceId.value
        ? 'The source has been updated successfully.'
        : 'The source has been created successfully.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    })

    closeAddSourceModal()
  } catch (err) {
    const message =
      (err as any)?.response?.data?.message ||
      (err as any)?.response?.data?.detail ||
      'Failed to create source'
    sourceError.value = message
  } finally {
    sourceLoading.value = false
  }
}

const startScrape = async (source: Source) => {
  scrapeErrors.value = { ...scrapeErrors.value, [source.id]: '' }
  scrapingState.value = { ...scrapingState.value, [source.id]: true }
  try {
    const { data } = await sourceApi.scrape(source.id)
    scrapeResults.value = { ...scrapeResults.value, [source.id]: (data as any)?.data || data }
    await Swal.fire({
      title: 'Scrape started',
      text: 'Awaiting scrape result. Showing response if available.',
      icon: 'success',
      timer: 1400,
      showConfirmButton: false,
    })
  } catch (err) {
    const message =
      (err as any)?.response?.data?.message ||
      (err as any)?.response?.data?.detail ||
      'Scrape API not available yet.'
    scrapeErrors.value = { ...scrapeErrors.value, [source.id]: message }
    await Swal.fire('Error', message, 'error')
  } finally {
    scrapingState.value = { ...scrapingState.value, [source.id]: false }
  }
}

const startEditSource = (source: Source) => {
  editingSourceId.value = source.id
  sourceForm.value = {
    name: source.name,
    url: source.url,
    source_type: source.source_type || 'web',
    scrape_frequency: source.scrape_frequency || 'DAILY',
    scraping_rules: source.scraping_rules ? JSON.stringify(source.scraping_rules, null, 2) : '',
  }
  addSourceModalOpen.value = true
}

const deleteSource = async (source: Source) => {
  const confirm = await Swal.fire({
    title: 'Delete source?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
  })

  if (!confirm.isConfirmed || !jurisdiction.value) return

  try {
    await sourceApi.delete(source.id)
    sources.value = sources.value.filter((s) => s.id !== source.id)
    await Swal.fire({
      title: 'Deleted',
      text: 'Source removed.',
      icon: 'success',
      timer: 1200,
      showConfirmButton: false,
    })
  } catch (err) {
    const message =
      (err as any)?.response?.data?.message ||
      (err as any)?.response?.data?.detail ||
      'Failed to delete source'
    await Swal.fire('Error', message, 'error')
  }
}

const goToJurisdiction = (id: string) => {
  const targetOrgId = organizationId.value || projectOrganizationId.value

  router.push({
    path: `/dashboard/jurisdictions/${id}`,
    query: targetOrgId ? { organizationId: targetOrgId } : undefined,
  })
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
                <RouterLink
                  :to="{
                    name: 'organization-projects',
                    params: { organizationId: organizationId || projectOrganizationId },
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
                    params: {
                      organizationId: organizationId || projectOrganizationId,
                      id: jurisdiction.project_id,
                    },
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
                v-model="jurisdictionEditForm.name"
                class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">Description</label>
              <textarea
                v-model="jurisdictionEditForm.description"
                rows="3"
                class="w-full rounded-lg border border-[#D5D7DA] px-4 py-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
              ></textarea>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">Instructions</label>
              <textarea
                v-model="jurisdictionEditForm.prompt"
                rows="3"
                class="w-full rounded-lg border border-[#D5D7DA] px-4 py-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
              ></textarea>
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

        <!-- Analysis Panel -->
        <div v-if="activeTab === 'analysis'" class="p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-[#1F1F1F]">Sources</h3>
              <p class="text-xs text-gray-500">Trigger scraping per source and view results.</p>
            </div>
            <button
              class="inline-flex items-center gap-2 rounded-lg bg-[#401903] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a1102]"
              @click="openAddSourceModal"
            >
              <Plus :size="16" />
              Add Source
            </button>
          </div>

          <div v-if="sourcesLoading" class="space-y-2">
            <div v-for="n in 3" :key="n" class="h-12 w-full rounded-lg bg-gray-100 animate-pulse" />
          </div>

          <div v-else-if="sourcesError" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {{ sourcesError }}
          </div>

          <div
            v-else-if="sources.length === 0"
            class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center"
          >
            <p class="text-sm text-gray-500">No sources have been added yet.</p>
            <p class="text-xs text-gray-400">Add a source to start scraping content.</p>
            <button
              class="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2a1102]"
              @click="openAddSourceModal"
            >
              <Plus :size="16" />
              Add Source
            </button>
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="source in sources"
              :key="source.id"
              class="rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm"
            >
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ source.name }}</p>
                  <p class="text-xs text-gray-500">{{ source.url }}</p>
                  <p class="text-[11px] uppercase tracking-wide text-gray-400">
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
                    class="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    :disabled="scrapingState[source.id]"
                    @click="startScrape(source)"
                  >
                    {{ scrapingState[source.id] ? 'Scraping...' : 'Start Scrape' }}
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

              <div v-if="scrapeResults[source.id]" class="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-800">
                <div class="mb-1 text-[11px] font-semibold uppercase text-gray-500">Result</div>
                <pre class="whitespace-pre-wrap break-words text-[11px] leading-5">
{{ typeof scrapeResults[source.id] === 'string' ? scrapeResults[source.id] : JSON.stringify(scrapeResults[source.id], null, 2) }}
                </pre>
              </div>
            </div>
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

        <!-- Sources Panel -->
        <div v-else class="p-6">
          <h3 class="mb-4 text-lg font-semibold text-[#1F1F1F]">Sources</h3>

          <div v-if="sourcesLoading" class="space-y-2">
            <div v-for="n in 3" :key="n" class="h-12 w-full rounded-lg bg-gray-100 animate-pulse" />
          </div>

          <div v-else-if="sourcesError" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {{ sourcesError }}
          </div>

          <ul v-else-if="sources.length" class="space-y-2">
            <li
              v-for="source in sources"
              :key="source.id"
              class="flex items-center justify-between rounded-lg border border-gray-100 bg-[#FAFAFA] px-4 py-3 text-sm text-[#3D2E1F]"
            >
              <div>
                <p class="font-semibold text-gray-900">{{ source.name }}</p>
                <p class="text-xs text-gray-500">{{ source.url }}</p>
                <p class="text-[11px] uppercase tracking-wide text-gray-400">
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

          <div v-else class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
            <p class="text-sm text-gray-500">No sources have been added yet.</p>
            <p class="text-xs text-gray-400">Attach links or files to start tracking sources.</p>
            <button
              class="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2a1102]"
              @click="openAddSourceModal"
            >
              <Plus :size="16" />
              Add Source
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
                v-model="sourceEditForm.name"
                required
                class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium"
                >URL <span class="text-red-500">*</span></label
              >
              <input
                v-model="sourceEditForm.url"
                type="url"
                required
                class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4"
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium">Type</label>
              <select
                v-model="sourceEditForm.source_type"
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
                v-model="sourceEditForm.scrape_frequency"
                class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4"
              >
                <option v-for="opt in frequencyOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                v-model="sourceEditForm.is_active"
                id="is_active"
                class="h-5 w-5"
              />
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

          <form @submit.prevent="createSource" class="space-y-4">
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
                  <option value="pdf">PDF</option>
                  <option value="api">API</option>
                </select>
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-gray-800">Scrape Frequency</label>
                <input
                  v-model="sourceForm.scrape_frequency"
                  class="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                  placeholder="DAILY"
                />
              </div>
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-gray-800">
                Scraping Rules (JSON)
              </label>
              <textarea
                v-model="sourceForm.scraping_rules"
                rows="4"
                class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                placeholder='{"content_selector": ".opinion-content"}'
              ></textarea>
              <p class="mt-1 text-xs text-gray-500">
                Leave blank to use defaults. Must be valid JSON if provided.
              </p>
            </div>

            <div v-if="sourceError" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {{ sourceError }}
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                @click="closeAddSourceModal"
                class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="sourceLoading"
                class="inline-flex items-center gap-2 rounded-lg bg-[#401903] px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#2a1102] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span v-if="sourceLoading">Saving...</span>
                <span v-else>{{ editingSourceId ? 'Save Changes' : 'Add Source' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </main>
</template>
