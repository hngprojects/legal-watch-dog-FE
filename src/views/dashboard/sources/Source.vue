<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'
import Swal from 'sweetalert2'

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
import { createSource } from '@/api/sources'
import type { Jurisdiction } from '@/api/jurisdiction'
import type { SourceType, ScrapeFrequency } from '@/types/source'

const route = useRoute()
const router = useRouter()
const jurisdictionStore = useJurisdictionStore()
const projectStore = useProjectStore()

const jurisdictionId = computed(() => route.params.id as string)
const organizationId = computed(() => {
  const id = route.query.organizationId
  return typeof id === 'string' ? id : ''
})
const jurisdiction = ref<Jurisdiction | null>(null)
const loading = ref(true)
const submitting = ref(false)

const sourceForm = ref({
  name: '',
  type: '' as SourceType,
  url: '',
  frequency: 'DAILY' as ScrapeFrequency,
})

const sourceTypes = [
  { value: 'web', label: 'Website' },
  { value: 'rss', label: 'RSS Feed' },
  { value: 'api', label: 'API' },
  { value: 'pdf', label: 'PDF Document' },
  { value: 'newsletter', label: 'Newsletter' },
]

const frequencies = [
  { value: 'HOURLY', label: 'Hourly' },
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
]

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
const activeOrganizationId = computed(() => organizationId.value || projectOrganizationId.value)

const parentJurisdiction = computed(() => {
  if (!jurisdiction.value?.parent_id) return null
  return (
    jurisdictionStore.jurisdictions.find((item) => item.id === jurisdiction.value?.parent_id) ||
    null
  )
})

const loadJurisdiction = async (id: string) => {
  loading.value = true
  const existing = jurisdictionStore.jurisdictions.find((j) => j.id === id) || null
  jurisdiction.value = existing || (await jurisdictionStore.fetchOne(id))

  if (!projectStore.projects.length && organizationId.value) {
    await projectStore.fetchProjects(organizationId.value)
  }

  if (jurisdiction.value?.project_id) {
    await jurisdictionStore.fetchJurisdictions(jurisdiction.value.project_id)
  }

  loading.value = false
}

const validateForm = (): boolean => {
  if (!sourceForm.value.name.trim()) {
    Swal.fire('Error', 'Source name is required', 'error')
    return false
  }

  if (!sourceForm.value.type) {
    Swal.fire('Error', 'Please select a source type', 'error')
    return false
  }

  if (!sourceForm.value.url.trim()) {
    Swal.fire('Error', 'Source URL is required', 'error')
    return false
  }

  try {
    new URL(sourceForm.value.url)
  } catch {
    Swal.fire('Error', 'Please enter a valid URL', 'error')
    return false
  }

  return true
}

const saveSources = async () => {
  if (!validateForm()) return

  submitting.value = true

  const payload = {
    jurisdiction_id: jurisdictionId.value,
    name: sourceForm.value.name.trim(),
    url: sourceForm.value.url.trim(),
    source_type: sourceForm.value.type,
    scrape_frequency: sourceForm.value.frequency,
  }

  try {
    await createSource(payload)

    await Swal.fire({
      title: 'Source Added!',
      text: 'Your source has been successfully added and will be monitored.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    })

    router.push(`/dashboard/jurisdictions/${jurisdictionId.value}`)
  } catch (error: unknown) {
    const err = error as {
      response?: {
        data?: {
          message?: string
          detail?: Array<{ msg?: string }> | string
        }
      }
      message?: string
    }

    console.error('Create source error:', err.response?.data)

    let msg = 'Failed to add source. Please check your input.'

    if (err.response?.data) {
      if (typeof err.response.data.detail === 'string') {
        msg = err.response.data.detail
      } else if (Array.isArray(err.response.data.detail) && err.response.data.detail[0]?.msg) {
        msg = err.response.data.detail[0].msg
      } else if (err.response.data.message) {
        msg = err.response.data.message
      }
    } else if (err.message) {
      msg = err.message
    }

    Swal.fire('Error', msg, 'error')
  } finally {
    submitting.value = false
  }
}

const cancel = () => {
  router.push(`/dashboard/jurisdictions/${jurisdictionId.value}`)
}

onMounted(() => loadJurisdiction(jurisdictionId.value))
</script>

<template>
  <main class="min-h-screen flex-1 bg-[#F8F7F5] px-6 py-8 lg:px-10 lg:py-12">
    <div v-if="loading" class="mx-auto max-w-4xl">
      <div class="space-y-4">
        <div class="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
        <div class="h-8 w-80 animate-pulse rounded bg-gray-200"></div>
        <div class="h-96 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"></div>
      </div>
    </div>

    <div v-else class="mx-auto max-w-4xl space-y-6">
      <!-- Breadcrumb Navigation -->
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
                :to="
                  activeOrganizationId
                    ? {
                        name: 'organization-projects',
                        params: { organizationId: activeOrganizationId },
                      }
                    : { name: 'organizations' }
                "
              >
                Projects
              </RouterLink>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem v-if="jurisdiction?.project_id && projectName">
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

          <BreadcrumbSeparator v-if="jurisdiction?.project_id && projectName" />

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
            <BreadcrumbLink as-child>
              <RouterLink :to="`/dashboard/jurisdictions/${jurisdictionId}`">
                {{ jurisdiction?.name }}
              </RouterLink>
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Add Sources</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <!-- Main Form Card -->
      <div class="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-[#1F1F1F]">Add Sources</h1>
          <p class="mt-2 text-base text-[#6B7280]">
            Connect sources to monitor legal changes and updates
          </p>
        </div>

        <form @submit.prevent="saveSources" class="space-y-6">
          <!-- Source Name -->
          <div>
            <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">
              Source Name <span class="text-red-500">*</span>
            </label>
            <input
              v-model="sourceForm.name"
              type="text"
              placeholder="e.g. UK Visa and Immigration Service"
              required
              class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4 text-sm placeholder-gray-400 transition-colors focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
            />
          </div>

          <!-- Source Type -->
          <div>
            <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">
              Source Type <span class="text-red-500">*</span>
            </label>
            <p class="mb-3 text-xs text-[#6B7280]">
              Select the format of the source you want to monitor.
            </p>
            <div class="relative">
              <select
                v-model="sourceForm.type"
                required
                class="h-12 w-full appearance-none rounded-lg border border-[#D5D7DA] bg-white px-4 pr-10 text-sm transition-colors focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
              >
                <option value="" disabled selected>Select Type</option>
                <option v-for="type in sourceTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
              <ChevronRight
                :size="16"
                class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 rotate-90 text-gray-400"
              />
            </div>
          </div>

          <!-- Source URL -->
          <div>
            <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">
              Source URL <span class="text-red-500">*</span>
            </label>
            <p class="mb-3 text-xs text-[#6B7280]">Provide the direct URL for the source.</p>
            <div class="relative">
              <div class="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="text-gray-400"
                >
                  <path
                    d="M7.33333 8.66667L11.3333 4.66667M11.3333 4.66667H8.66667M11.3333 4.66667V7.33333M8 2H4.66667C3.95942 2 3.28115 2.28095 2.78105 2.78105C2.28095 3.28115 2 3.95942 2 4.66667V11.3333C2 12.0406 2.28095 12.7189 2.78105 13.219C3.28115 13.719 3.95942 14 4.66667 14H11.3333C12.0406 14 12.7189 13.719 13.219 13.219C13.719 12.7189 14 12.0406 14 11.3333V8"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <input
                v-model="sourceForm.url"
                type="url"
                placeholder="https://www.gov.uk/government/..."
                required
                class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4 pl-10 text-sm placeholder-gray-400 transition-colors focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
              />
            </div>
            <p class="mt-2 flex items-start gap-2 text-xs text-amber-600">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="mt-0.5 shrink-0"
              >
                <path
                  d="M8 5.33333V8M8 10.6667H8.00667M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>WatchDog will validate this source after saving.</span>
            </p>
          </div>

          <!-- Scrape Frequency -->
          <div>
            <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">Scrape Frequency</label>
            <p class="mb-3 text-xs text-[#6B7280]">
              How often should WatchDog check this source for changes?
            </p>
            <div class="relative">
              <select
                v-model="sourceForm.frequency"
                class="h-12 w-full appearance-none rounded-lg border border-[#D5D7DA] bg-white px-4 pr-10 text-sm transition-colors focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
              >
                <option v-for="freq in frequencies" :key="freq.value" :value="freq.value">
                  {{ freq.label }}
                </option>
              </select>
              <ChevronRight
                :size="16"
                class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 rotate-90 text-gray-400"
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-3 pt-6">
            <button
              type="button"
              @click="cancel"
              class="rounded-lg border border-[#D5D7DA] px-6 py-2.5 text-sm font-medium text-[#374151] transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="submitting"
              class="flex items-center gap-2 rounded-lg bg-[#401903] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2a1102] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span v-if="submitting">Saving...</span>
              <span v-else>Save Sources</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
