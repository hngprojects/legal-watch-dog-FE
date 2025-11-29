<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from '@/lib/swal'
import { sourceApi } from '@/api/source'
import type { SourceType, ScrapeFrequency, CreateSourcePayload } from '@/types/source'
import type { Jurisdiction } from '@/api/jurisdiction'
import { useJurisdictionStore } from '@/stores/jurisdiction-store'
import { useProjectStore } from '@/stores/project-store'

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
  type: 'web' as SourceType, // default to a valid backend value
  url: '',
  frequency: 'DAILY' as ScrapeFrequency,
})

const sourceTypes = [
  { value: 'web', label: 'Website' },
  { value: 'api', label: 'API' },
  { value: 'pdf', label: 'PDF Document' },
]

const frequencies = [
  { value: 'HOURLY', label: 'Hourly' },
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
]

const loadJurisdiction = async (id: string) => {
  loading.value = true
  const existing = jurisdictionStore.jurisdictions.find((j) => j.id === id) || null
  jurisdiction.value = existing || (await jurisdictionStore.fetchOne(id, organizationId.value))
  if (!projectStore.projects.length && organizationId.value) {
    await projectStore.fetchProjects(organizationId.value)
  }
  if (jurisdiction.value?.project_id) {
    await jurisdictionStore.fetchJurisdictions(jurisdiction.value.project_id, organizationId.value)
  }
  loading.value = false
}

onMounted(() => loadJurisdiction(jurisdictionId.value))

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
    // will throw if invalid
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

  const payload: CreateSourcePayload = {
    jurisdiction_id: jurisdictionId.value,
    name: sourceForm.value.name.trim(),
    url: sourceForm.value.url.trim(),
    source_type: sourceForm.value.type,
    scrape_frequency: sourceForm.value.frequency,
  }

  try {
    const res = await sourceApi.create(payload)
    // success if status 200
    if (res?.data?.data?.source) {
      await Swal.fire({
        title: 'Source Added!',
        text: 'Your source has been successfully added and will be monitored.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      })
      router.push(`/dashboard/jurisdictions/${jurisdictionId.value}`)
    } else {
      throw new Error(res?.data?.message || 'Unexpected response from server')
    }
  } catch (error: unknown) {
    console.error('Create source error:', error)
    const err = error as {
      response?: { data?: { message?: string; detail?: string | Array<{ msg?: string }> } }
      message?: string
    }

    let msg = 'Failed to add source. Please check your input.'
    if (err.response?.data) {
      const d = err.response.data
      if (typeof d.detail === 'string') msg = d.detail
      else if (Array.isArray(d.detail) && d.detail[0]?.msg) msg = d.detail[0].msg
      else if (d.message) msg = d.message
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
      <div class="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-[#1F1F1F]">Add Source</h1>
          <p class="mt-2 text-base text-[#6B7280]">Connect a source to monitor legal changes.</p>
        </div>

        <form @submit.prevent="saveSources" class="space-y-6">
          <div>
            <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">
              Source Name <span class="text-red-500">*</span>
            </label>
            <input v-model="sourceForm.name" type="text" placeholder="e.g. Supreme Court Opinions"
              class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4 text-sm placeholder-gray-400 focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none" />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">Source Type <span class="text-red-500">*</span></label>
            <select v-model="sourceForm.type" class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none">
              <option disabled value="">Select type</option>
              <option v-for="t in sourceTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">Source URL <span class="text-red-500">*</span></label>
            <input v-model="sourceForm.url" type="url" placeholder="https://example.com" class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none" />
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">Scrape Frequency</label>
            <select v-model="sourceForm.frequency" class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none">
              <option v-for="f in frequencies" :key="f.value" :value="f.value">{{ f.label }}</option>
            </select>
          </div>

          <div class="flex justify-end gap-3">
            <button type="button" @click="cancel" class="rounded-lg border border-[#D5D7DA] px-6 py-2.5 text-sm font-medium">Cancel</button>
            <button type="submit" :disabled="submitting" class="rounded-lg bg-[#401903] px-6 py-2.5 text-sm font-medium text-white">
              <span v-if="submitting">Saving...</span><span v-else>Save Source</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
