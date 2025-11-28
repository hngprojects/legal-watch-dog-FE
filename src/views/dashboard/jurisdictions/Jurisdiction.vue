<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Plus, Settings } from 'lucide-vue-next'
import Swal from 'sweetalert2'

import type { Jurisdiction } from '@/api/jurisdiction'
import { sourceApi } from '@/api/source'
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
const organizationName = computed(() => {
  if (!activeOrganizationId.value) return ''
  return orgStore.organizations.find((org) => org.id === activeOrganizationId.value)?.name || ''
})

const jurisdiction = ref<Jurisdiction | null>(null)
const loading = ref(true)
const activeTab = ref<'analysis' | 'sources' | 'output'>('analysis')
const showSettingsMenu = ref(false)
const showInlineEdit = ref(false)
const subJurisdictionModalOpen = ref(false)
const addSourceModalOpen = ref(false)
const orgStore = useOrganizationStore()
const activeOrganizationId = computed<string>(() => {
  if (typeof route.query.organizationId === 'string') {
    return route.query.organizationId
  }
  if (projectOrganizationId.value) {
    return projectOrganizationId.value
  }
  return orgStore.currentOrganizationId || ''
})

const editForm = ref({
  name: '',
  description: '',
  prompt: '',
})

const subJurisdictionForm = ref({
  name: '',
  description: '',
  prompt: '',
})

const sourceError = ref<string | null>(null)
const sourceLoading = ref(false)
const sourceForm = ref<{
  name: string
  url: string
  source_type: SourceType
  scrape_frequency: ScrapeFrequency
  scraping_rules: string
}>({
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
const storedScrapeResults = ref<
  Array<{
    id: string
    jurisdictionId: string
    sourceId: string
    sourceName: string
    fetchedAt: string
    status: string
    summary: string
    payload: unknown
  }>
>([])
const expandedSources = ref<Record<string, boolean>>({})

const formatKey = (key: string) =>
  key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

const stringifyValue = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map((item) => stringifyValue(item)).join(', ')
  if (typeof value === 'object') return JSON.stringify(value, null, 2)
  return ''
}

const normalizeOutput = (raw: unknown): OutputItem[] => {
  if (!raw) return []

  if (Array.isArray(raw)) {
    return raw
      .map((item, index) => {
        if (typeof item === 'string') {
          return { title: item }
        }

        if (typeof item === 'object' && item !== null) {
          const record = item as Record<string, unknown>
          const title =
            (record.title as string) ||
            (record.heading as string) ||
            (record.change as string) ||
            `Update ${index + 1}`
          const detail =
            (record.detail as string) ||
            (record.description as string) ||
            (record.summary as string) ||
            stringifyValue(record)

          return {
            title,
            detail,
          }
        }

        return { title: `Update ${index + 1}`, detail: stringifyValue(item) }
      })
      .filter((item) => item.title || item.detail)
  }

  if (typeof raw === 'object') {
    const record = raw as Record<string, unknown>
    const listCandidate = record.changes || record.updates || record.items

    if (Array.isArray(listCandidate)) {
      return normalizeOutput(listCandidate)
    }

    return Object.entries(record).map(([key, value]) => ({
      title: formatKey(key),
      detail: stringifyValue(value),
    }))
  }

  if (typeof raw === 'string') return [{ title: raw }]

  return [{ title: String(raw) }]
}

const outputItems = computed<OutputItem[]>(() => normalizeOutput(jurisdiction.value?.scrape_output))
type ApiErrorResponse = {
  response?: {
    data?: {
      message?: string
      detail?: string | Array<{ msg?: string }>
    }
  }
}

const getErrorMessage = (err: unknown, fallback: string) => {
  const apiErr = err as ApiErrorResponse
  const detail = apiErr.response?.data?.detail

  if (typeof detail === 'string') return detail
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg ?? fallback

  return apiErr.response?.data?.message ?? fallback
}

const STORAGE_KEY = 'lawdog-scrape-results'

const loadStoredScrapeResults = () => {
  if (typeof localStorage === 'undefined') return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as typeof storedScrapeResults.value) : []
    storedScrapeResults.value = parsed.filter(
      (item) => item.jurisdictionId === jurisdictionId.value,
    )

    type StoredResult = (typeof storedScrapeResults.value)[number]
    const latestBySource: Record<string, StoredResult> = {}
    storedScrapeResults.value.forEach((item) => {
      const existing = latestBySource[item.sourceId]
      const isNewer =
        !existing || new Date(item.fetchedAt).getTime() > new Date(existing.fetchedAt).getTime()
      if (isNewer) {
        latestBySource[item.sourceId] = item
      }
    })
    scrapeResults.value = { ...scrapeResults.value, ...latestBySource }
  } catch (err) {
    console.error('Failed to load stored scrape results', err)
  }
}

const persistScrapeResult = (result: (typeof storedScrapeResults.value)[number]) => {
  if (typeof localStorage === 'undefined') return
  const next = [result, ...storedScrapeResults.value]
  storedScrapeResults.value = next
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

// const monitoringInstructions = computed(
//   () => jurisdiction.value?.prompt || jurisdiction.value?.description || '',
// )

const lastUpdatedText = computed(() => {
  if (!jurisdiction.value) return ''
  const timestamp = jurisdiction.value.updated_at || jurisdiction.value.created_at
  return timestamp ? new Date(timestamp).toLocaleString() : ''
})

const subJurisdictions = computed<NestedJurisdiction[]>(() => {
  if (!jurisdiction.value) return []
  const walk = (parentId: string, depth = 0): NestedJurisdiction[] =>
    jurisdictionStore.jurisdictions
      .filter((item) => item.parent_id === parentId)
      .flatMap((child) => [{ ...child, depth }, ...walk(child.id, depth + 1)])

  return walk(jurisdiction.value.id, 0)
})

const projectName = computed(() => {
  if (!jurisdiction.value?.project_id) return ''
  const project = projectStore.projects.find((p) => p.id === jurisdiction.value?.project_id)
  return project?.title || 'Project'
})

const projectOrganizationId = computed(() => {
  if (!jurisdiction.value?.project_id) return ''
  const project = projectStore.projects.find((p) => p.id === jurisdiction.value?.project_id)
  return project?.org_id || ''
})

const parentJurisdiction = computed(() => {
  if (!jurisdiction.value?.parent_id) return null
  return (
    jurisdictionStore.jurisdictions.find((item) => item.id === jurisdiction.value?.parent_id) ||
    null
  )
})

const loadJurisdiction = async (id: string) => {
  loading.value = true
  jurisdictionStore.setError(null)
  const existing = jurisdictionStore.jurisdictions.find((j) => j.id === id) || null
  jurisdiction.value = existing || (await jurisdictionStore.fetchOne(id))

  if (!projectStore.projects.length && activeOrganizationId.value) {
    await projectStore.fetchProjects(activeOrganizationId.value)
  }

  if (jurisdiction.value?.project_id) {
    await jurisdictionStore.fetchJurisdictions(jurisdiction.value.project_id)
    await fetchSources(jurisdiction.value.id)
  }

  loading.value = false
}

const goBack = () => {
  const targetOrgId = activeOrganizationId.value

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
  closeSettingsMenu()

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

  const targetOrgId = activeOrganizationId.value

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
    const payload = data?.data
    sources.value = payload?.sources ?? []
  } catch (err) {
    sourcesError.value = getErrorMessage(err, 'Failed to load sources')
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
      void e
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
      source_type: sourceForm.value.source_type,
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
    sourceError.value = getErrorMessage(err, 'Failed to create source')
  } finally {
    sourceLoading.value = false
  }
}

const startScrape = async (source: Source) => {
  scrapeErrors.value = { ...scrapeErrors.value, [source.id]: '' }
  scrapingState.value = { ...scrapingState.value, [source.id]: true }
  try {
    await Swal.fire({
      title: 'Scrape started',
      text: 'Simulating scrape... please wait.',
      icon: 'info',
      timer: 1200,
      showConfirmButton: false,
    })

    const result = (await new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            id: `${source.id}-${Date.now()}`,
            jurisdictionId: jurisdiction.value?.id ?? jurisdictionId.value,
            sourceId: source.id,
            sourceName: source.name,
            status: 'completed',
            fetchedAt: new Date().toISOString(),
            summary: `Simulated scrape result for ${source.name}.`,
            payload: {
              items: [
                `Update from ${source.name}`,
                `Checked at ${new Date().toLocaleString()}`,
                `Frequency: ${source.scrape_frequency}`,
              ],
            },
          }),
        1800,
      ),
    )) as (typeof storedScrapeResults.value)[number]

    scrapeResults.value = { ...scrapeResults.value, [source.id]: result }
    persistScrapeResult(result)
  } catch (err) {
    const message = getErrorMessage(err, 'Scrape API not available yet.')
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
    const message = getErrorMessage(err, 'Failed to delete source')
    await Swal.fire('Error', message, 'error')
  }
}

const goToJurisdiction = (id: string) => {
  const targetOrgId = activeOrganizationId.value

  router.push({
    path: `/dashboard/jurisdictions/${id}`,
    query: targetOrgId ? { organizationId: targetOrgId } : undefined,
  })
}

onMounted(() => loadJurisdiction(jurisdictionId.value))
onMounted(() => {
  loadStoredScrapeResults()
})

watch(
  () => jurisdictionId.value,
  (newId) => {
    if (newId) {
      loadJurisdiction(newId)
    }
  },
)

watch(
  () => jurisdictionStore.jurisdictions,
  (newJurisdictions) => {
    const found = newJurisdictions.find((j) => j.id === jurisdictionId.value)
    if (found) jurisdiction.value = found
  },
  { deep: true },
)
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
        class="mt-4 inline-flex cursor-pointer items-center gap-2 text-[#401903] hover:underline"
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
                    params: {
                      organizationId: activeOrganizationId,
                      id: jurisdiction.project_id,
                    },
                  }"
                >
                  {{ projectName }}
                </RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

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
            class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-800"
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

      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <template v-if="showInlineEdit">
          <form @submit.prevent="saveEdit" class="space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">
                Jurisdiction Name
              </label>
              <input
                v-model="editForm.name"
                class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">Description</label>
              <textarea
                v-model="editForm.description"
                rows="3"
                class="w-full rounded-lg border border-[#D5D7DA] px-4 py-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">
                Monitoring Instructions
              </label>
              <textarea
                v-model="editForm.prompt"
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
          <div class="flex flex-col gap-3">
            <p class="text-xs font-semibold tracking-[0.15em] text-[#C17A3F] uppercase">
              Jurisdiction
            </p>
            <h1 class="text-3xl font-bold text-[#1F1F1F]">{{ jurisdiction.name }}</h1>
            <p v-if="jurisdiction.description" class="text-base leading-relaxed text-[#4B5563]">
              {{ jurisdiction.description }}
            </p>
            <p v-if="lastUpdatedText" class="text-sm text-gray-400">
              Updated {{ lastUpdatedText }}
            </p>
          </div>
        </template>
      </section>

      <section class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <div class="border-b border-gray-100 px-6 py-4">
          <div class="flex gap-8">
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

            <button
              @click="activeTab = 'output'"
              :class="[
                'relative pb-4 text-sm font-semibold transition-colors',
                activeTab === 'output' ? 'text-[#1F1F1F]' : 'text-gray-500 hover:text-[#1F1F1F]',
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
                activeTab === 'sources' ? 'text-[#1F1F1F]' : 'text-gray-500 hover:text-[#1F1F1F]',
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

        <!-- Analysis Panel -->
        <div v-if="activeTab === 'analysis'" class="space-y-4 p-6">
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
            <div v-for="n in 3" :key="n" class="h-12 w-full animate-pulse rounded-lg bg-gray-100" />
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
                    class="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                    :disabled="scrapingState[source.id]"
                    @click="startScrape(source)"
                  >
                    {{ scrapingState[source.id] ? 'Scraping...' : 'Start Scrape' }}
                  </button>
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

              <div v-if="scrapeErrors[source.id]" class="mt-2 text-xs text-red-600">
                {{ scrapeErrors[source.id] }}
              </div>

              <div
                v-if="expandedSources[source.id] && scrapeResults[source.id]"
                class="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-800"
              >
                <div class="mb-1 text-[11px] font-semibold text-gray-500 uppercase">
                  Most Recent Result
                </div>
                <pre class="text-[11px] leading-5 wrap-break-word whitespace-pre-wrap"
                  >{{
                    typeof scrapeResults[source.id] === 'string'
                      ? scrapeResults[source.id]
                      : JSON.stringify(scrapeResults[source.id], null, 2)
                  }}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <!-- Output Panel (uses stored simulated results + normalized output) -->
        <div v-else-if="activeTab === 'output'" class="space-y-6 p-6">
          <div>
            <h3 class="mb-4 text-lg font-semibold text-[#1F1F1F]">Latest Scrape Results</h3>

            <div v-if="storedScrapeResults.length" class="space-y-3">
              <article
                v-for="item in storedScrapeResults"
                :key="item.id"
                class="rounded-xl border border-[#F3E7DC] bg-[#FDF8F3] p-4"
              >
                <div class="flex items-center justify-between gap-2">
                  <p class="text-sm font-semibold text-[#3C2610]">{{ item.sourceName }}</p>
                  <span class="text-[11px] tracking-wide text-[#9CA3AF] uppercase">
                    {{ new Date(item.fetchedAt).toLocaleString() }}
                  </span>
                </div>
                <p class="mt-2 text-sm leading-6 text-[#4B5563]">{{ item.summary }}</p>
                <pre
                  v-if="item.payload"
                  class="mt-3 text-xs leading-5 whitespace-pre-wrap text-[#374151]"
                  >{{
                    typeof item.payload === 'string'
                      ? item.payload
                      : JSON.stringify(item.payload, null, 2)
                  }}</pre
                >
              </article>
            </div>

            <div
              v-else
              class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center"
            >
              <p class="text-sm text-gray-500">No simulated scrape results yet.</p>
              <p class="text-xs text-gray-400">
                Trigger a scrape from the Analysis tab to see output.
              </p>
            </div>
          </div>

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
              <p class="text-sm text-gray-500">
                No output has been generated for this jurisdiction.
              </p>
              <p class="text-xs text-gray-400">
                Connect sources or add monitoring instructions to see updates.
              </p>
            </div>
          </div>
        </div>

        <!-- Sources Panel -->
        <div v-else class="p-6">
          <h3 class="mb-4 text-lg font-semibold text-[#1F1F1F]">Sources</h3>

          <div v-if="sourcesLoading" class="space-y-2">
            <div v-for="n in 3" :key="n" class="h-12 w-full animate-pulse rounded-lg bg-gray-100" />
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

      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div class="mb-4 flex items-center justify-between gap-4">
          <h3 class="text-lg font-semibold text-[#1F1F1F]">Sub-Jurisdiction</h3>
          <button
            class="flex items-center gap-2 rounded-full bg-[#401903] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2a1102]"
            @click="openSubJurisdictionModal"
          >
            <Plus :size="16" />
            Add Sub-jurisdiction
          </button>
        </div>

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

    <teleport to="body">
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
              <label class="mb-2 block text-sm font-medium text-gray-900">
                Sub-Jurisdiction Name
              </label>
              <input
                v-model="subJurisdictionForm.name"
                type="text"
                placeholder="e.g Global Visa Monitoring"
                required
                class="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm placeholder-gray-400 focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-gray-900"> Description </label>
              <textarea
                v-model="subJurisdictionForm.description"
                rows="4"
                placeholder="What legal areas will you monitor?"
                required
                class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder-gray-400 focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
              ></textarea>
            </div>

            <div
              v-if="jurisdictionStore.error"
              class="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {{ jurisdictionStore.error }}
            </div>

            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="closeSubJurisdictionModal"
                class="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="rounded-lg bg-[#401903] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2a1102]"
              >
                Create Sub-Jurisdiction
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
