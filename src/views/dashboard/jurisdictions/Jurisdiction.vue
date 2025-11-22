<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { ArrowLeftIcon, ChevronRight, Settings } from 'lucide-vue-next'
import { useJurisdictionStore } from '@/stores/jurisdiction-store'
import { useProjectStore } from '@/stores/project-store'
import type { Jurisdiction } from '@/api/jurisdiction'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const jurisdictionStore = useJurisdictionStore()
const projectStore = useProjectStore()
const jurisdictionId = route.params.id as string
const jurisdiction = ref<Jurisdiction | null>(null)
const loading = ref(true)
const activeTab = ref<'output' | 'sources'>('output')
const showSettingsMenu = ref(false)
const showInlineEdit = ref(false)

const editForm = ref({
  name: '',
  description: '',
})

const goBack = () => {
  if (jurisdiction.value?.project_id) {
    router.push(`/dashboard/projects/${jurisdiction.value.project_id}`)
  } else {
    router.back()
  }
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
  }
  showInlineEdit.value = true
  closeSettingsMenu()
}

const saveEdit = async () => {
  try {
    const response = await jurisdictionStore.updateJurisdiction(jurisdictionId, {
      name: editForm.value.name,
      description: editForm.value.description,
    })

    if (jurisdiction.value && response) {
      jurisdiction.value.name = editForm.value.name
      jurisdiction.value.description = editForm.value.description
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
    console.log(err)
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

  await jurisdictionStore.deleteJurisdiction(jurisdictionId)

  await Swal.fire({
    title: 'Deleted!',
    text: 'Jurisdiction successfully deleted.',
    icon: 'success',
    timer: 1500,
    showConfirmButton: false,
  })

  if (projectId) {
    router.push(`/dashboard/projects/${projectId}`)
  } else {
    router.push('/dashboard/projects')
  }
}

const getProjectName = () => {
  if (!jurisdiction.value?.project_id) return ''
  const project = projectStore.projects.find((p) => p.id === jurisdiction.value?.project_id)
  return project?.title || 'Project'
}

onMounted(async () => {
  jurisdiction.value = jurisdictionStore.jurisdictions.find((j) => j.id === jurisdictionId) || null

  if (!jurisdiction.value) {
    // Fetch single jurisdiction if not in store
    jurisdiction.value = await jurisdictionStore.fetchOne(jurisdictionId)
  }

  loading.value = false
})

watch(
  () => jurisdictionStore.jurisdictions,
  (newJurisdictions) => {
    const found = newJurisdictions.find((j) => j.id === jurisdictionId)
    if (found) jurisdiction.value = found
  },
  { deep: true },
)
</script>

<template>
  <main class="min-h-screen flex-1 bg-gray-50 p-6 lg:p-10">
    <div v-if="loading" class="mx-auto max-w-7xl">
      <div class="animate-pulse">
        <div class="mb-8 h-6 w-64 rounded bg-gray-200"></div>
        <div class="mb-4 h-10 w-96 rounded bg-gray-200"></div>
        <div class="h-5 w-full max-w-2xl rounded bg-gray-200"></div>
      </div>
    </div>

    <div v-else-if="!jurisdiction" class="mx-auto max-w-7xl py-16 text-center">
      <h1 class="mb-4 text-2xl font-bold text-gray-900">Jurisdiction not found</h1>
      <button @click="goBack" class="cursor-pointer text-[#401903] hover:underline">
        <ArrowLeftIcon :size="18" class="inline" /> Back
      </button>
    </div>

    <div v-else class="mx-auto max-w-7xl">
      <!-- Breadcrumb Navigation -->
      <div class="mb-8 flex items-center justify-between">
        <nav class="flex items-center gap-2 text-sm">
          <button
            @click="goBack"
            class="flex cursor-pointer items-center gap-2 text-gray-500 transition-colors hover:text-gray-700"
          >
            <ArrowLeftIcon :size="18" />
            <span>{{ getProjectName() }}</span>
          </button>
          <ChevronRight :size="18" class="text-gray-400" />
          <span class="font-medium text-[#C17A3F]">{{ jurisdiction.name }}</span>
        </nav>

        <!-- Settings Menu -->
        <div class="relative">
          <button
            @click.stop="toggleSettingsMenu"
            class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
          >
            <Settings :size="18" />
          </button>

          <div
            v-if="showSettingsMenu"
            @click.stop
            class="absolute right-0 z-50 mt-2 w-44 rounded-md bg-white shadow-lg ring-1 ring-black/5"
          >
            <button @click="startEdit" class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
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
      </div>

      <!-- Header Card with Edit Mode -->
      <div class="mb-8 rounded-[10px] bg-white p-6">
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
          <div class="mb-4 flex items-start justify-between">
            <div class="flex-1">
              <h1 class="mb-2 text-3xl font-bold text-gray-900">{{ jurisdiction.name }}</h1>
              <p class="text-base leading-relaxed text-gray-600">{{ jurisdiction.description }}</p>
            </div>
            <span class="ml-4 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
              Changes detected
            </span>
          </div>
        </template>
      </div>

      <!-- Tabs -->
      <div class="mb-6 border-b border-gray-200">
        <div class="flex gap-8">
          <button
            @click="activeTab = 'output'"
            :class="[
              'relative pb-4 text-sm font-medium transition-colors',
              activeTab === 'output' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            Output
            <div
              v-if="activeTab === 'output'"
              class="absolute right-0 bottom-0 left-0 h-0.5 bg-[#401903]"
            ></div>
          </button>
          <button
            @click="activeTab = 'sources'"
            :class="[
              'relative pb-4 text-sm font-medium transition-colors',
              activeTab === 'sources' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            Sources
            <div
              v-if="activeTab === 'sources'"
              class="absolute right-0 bottom-0 left-0 h-0.5 bg-[#401903]"
            ></div>
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div v-if="activeTab === 'output'" class="space-y-6">
        <!-- Old Requirements and What Changed Grid -->
        <div class="grid gap-6 lg:grid-cols-2">
          <!-- Old Requirements Card -->
          <div class="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200/60">
            <div class="mb-6 flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 4V10L14 12"
                    stroke="#F59E0B"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle cx="10" cy="10" r="8" stroke="#F59E0B" stroke-width="2" />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-gray-900">Old Requirements</h2>
            </div>

            <div class="space-y-4 text-sm text-gray-700">
              <div>
                <p class="mb-2 font-semibold text-gray-900">
                  A. Short-Stay (Schengen) Visa — Type C (up to 90 days)
                </p>
                <ol class="ml-4 space-y-1">
                  <li>1. Tourist Visa</li>
                  <li>2. Business Visa</li>
                  <li>3. Visitor Visa (Visiting Friends/Family)</li>
                  <li>4. Medical Treatment Visa</li>
                  <li>5. Short-Term Study / Training / Internship Visa</li>
                  <li>6. Cultural, Sports, Film Crew Visa</li>
                  <li>7. Airport Transit Visa (Type A)</li>
                </ol>
              </div>

              <hr class="border-gray-200" />

              <div>
                <p class="mb-2 font-semibold text-gray-900">
                  B. Long-Stay (National) Visa — Type D (over 90 days)
                </p>
                <p class="mb-2">1. Work & Employment Visas</p>
                <ul class="ml-4 space-y-1">
                  <li>• General Employment Visa</li>
                  <li>• EU Blue Card</li>
                  <li>• Skilled Worker Visa (Skilled Immigration Act)</li>
                  <li>• Job Seeker Visa</li>
                  <li>• Freelancer / Self-Employment Visa</li>
                  <li>• Researcher / Scientist Visa</li>
                  <li>• IT Specialist Visa (without formal degree)</li>
                  <li>• Vocational Training (Ausbildung) Visa...</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- What Changed Card -->
          <div class="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200/60">
            <div class="mb-6 flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 7L8 14L4 10"
                    stroke="#10B981"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <h2 class="text-xl font-bold text-gray-900">What Changed</h2>
            </div>

            <div class="space-y-6 text-sm text-gray-700">
              <div>
                <p class="mb-2 font-medium text-gray-900">
                  Original Requirement (for Germany Work Visa):
                </p>
                <p class="leading-relaxed">
                  • You must provide a signed employment contract from your German employer.
                </p>
              </div>

              <div>
                <p class="mb-2 font-medium text-gray-900">Modified Version:</p>
                <p class="leading-relaxed">
                  • You must provide a signed employment contract from your German employer that
                  includes a confirmed start date.
                </p>
              </div>

              <div class="mt-6 flex gap-3">
                <button
                  class="rounded-lg bg-[#401903] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2a1102]"
                >
                  Accept Change
                </button>
                <button
                  class="rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Ignore
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else-if="activeTab === 'sources'"
        class="rounded-xl bg-white p-20 text-center shadow-sm ring-1 ring-gray-200/60"
      >
        <p class="text-sm text-gray-500">No sources configured yet</p>
      </div>
    </div>
  </main>
</template>
