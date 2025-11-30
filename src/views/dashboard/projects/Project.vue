<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/project-store'
import { useJurisdictionStore } from '@/stores/jurisdiction-store'
import { useOrganizationStore } from '@/stores/organization-store'
import { computed, ref, onMounted, watch } from 'vue'
import type { Project, ProjectErrorResponse } from '@/types/project'
import type { Jurisdiction } from '@/api/jurisdiction'
import { ArrowLeftIcon, Plus, Settings, ChevronDown } from 'lucide-vue-next'
import checkmark from '@/assets/Images/checkmark.png'
import Swal from '@/lib/swal'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
} from '@/components/ui/dialog'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const jurisdictionStore = useJurisdictionStore()
const organizationStore = useOrganizationStore()
const projectId = route.params.id as string
const organizationId = computed(
  () => (route.params.organizationId as string) || project.value?.org_id || '',
)
const organizationName = computed(() => {
  if (!organizationId.value) return ''
  return organizationStore.organizations.find((org) => org.id === organizationId.value)?.name || ''
})
const project = ref<Project | null>(null)
const loading = ref(true)
const activeTab = ref<'jurisdictions' | 'activity'>('jurisdictions')
const showAddJurisdictionModal = ref(false)
const jurisdictionForm = ref({ name: '', description: '' })
const selected = ref('AI')

const showHireSpecialistModal = ref(false)
const hireForm = ref({
  companyName: 'Untitled UI',
  companyEmail: 'olivia@untitledui.com',
  industry: 'Immigration & Global Mobility',
  description:
    'Monitor changes to EU travel rules, visa requirements, entry conditions, and policy updates across all Schengen and EU member states',
})

const openHireSpecialistModal = () => {
  showHireSpecialistModal.value = true
}

const closeHireSpecialistModal = () => {
  showHireSpecialistModal.value = false
}

const submitHireForm = async () => {
  closeHireSpecialistModal()
  await Swal.fire('Request Submitted', 'Your specialist request is being reviewed.', 'success')
}

const projectJurisdictions = computed<Jurisdiction[]>(() =>
  jurisdictionStore.jurisdictions.filter((item) => item.project_id === projectId),
)

const topLevelJurisdictions = computed<Jurisdiction[]>(() =>
  projectJurisdictions.value.filter((item) => !item.parent_id),
)

const goBack = () => {
  if (organizationId.value) {
    router.push({
      name: 'organization-projects',
      params: { organizationId: organizationId.value },
    })
  } else {
    router.push({ name: 'organizations' })
  }
}

const openAddJurisdictionModal = () => {
  showAddJurisdictionModal.value = true
  jurisdictionForm.value = { name: '', description: '' }
  jurisdictionStore.setError(null)
}

const closeAddJurisdictionModal = () => {
  showAddJurisdictionModal.value = false
  jurisdictionForm.value = { name: '', description: '' }
  jurisdictionStore.setError(null)
}

const handleCreateJurisdiction = async () => {
  jurisdictionStore.setError(null)

  if (!jurisdictionForm.value.name.trim()) {
    return jurisdictionStore.setError('Jurisdiction name is required')
  }
  if (!jurisdictionForm.value.description.trim()) {
    return jurisdictionStore.setError('Description is required')
  }

  try {
    const newJurisdiction = await jurisdictionStore.addJurisdiction(
      projectId,
      {
        name: jurisdictionForm.value.name.trim(),
        description: jurisdictionForm.value.description.trim(),
      },
      organizationId.value,
    )

    if (newJurisdiction) {
      closeAddJurisdictionModal()
      await Swal.fire('Created', 'Jurisdiction created successfully.', 'success')
    }
  } catch (error) {
    void error
    await Swal.fire(
      'Create failed',
      jurisdictionStore.error || 'Could not create jurisdiction',
      'error',
    )
  }
}

const goToJurisdiction = (jurisdictionId: string) => {
  router.push({
    path: `/dashboard/jurisdictions/${jurisdictionId}`,
    query: organizationId.value ? { organizationId: organizationId.value } : undefined,
  })
}

onMounted(async () => {
  const existingProject = projectStore.projects.find((p) => p.id === projectId)

  if (existingProject) {
    project.value = existingProject
  } else {
    if (organizationId.value) {
      await projectStore.fetchProjects(organizationId.value)
    } else {
      projectStore.setError('Organization context missing. Please navigate from Organizations.')
    }
    const foundProject = projectStore.projects.find((p) => p.id === projectId)
    project.value = foundProject || null
  }

  await jurisdictionStore.fetchJurisdictions(projectId, organizationId.value)
  loading.value = false
})

const showSettingsMenu = ref(false)
const showInlineEdit = ref(false)

const editForm = ref({
  title: '',
  description: '',
  master_prompt: '',
})

const toggleSettingsMenu = () => {
  showSettingsMenu.value = !showSettingsMenu.value
}

const closeSettingsMenu = () => {
  showSettingsMenu.value = false
}

const deleteProject = async () => {
  closeSettingsMenu()

  const confirm = await Swal.fire({
    title: 'Delete Project?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
  })

  if (!confirm.isConfirmed) return

  if (!organizationId.value) {
    projectStore.setError('Organization context missing. Please navigate from Organizations.')
    return
  }

  await projectStore.deleteProject(projectId, organizationId.value)

  await Swal.fire({
    title: 'Deleted!',
    text: 'Project successfully deleted.',
    icon: 'success',
    timer: 1500,
    showConfirmButton: false,
  })

  if (organizationId.value) {
    router.push({ name: 'organization-projects', params: { organizationId: organizationId.value } })
  } else {
    router.push({ name: 'organizations' })
  }
}

const startEdit = () => {
  editForm.value = {
    title: project.value?.title || '',
    description: project.value?.description || '',
    master_prompt: project.value?.master_prompt || '',
  }

  showInlineEdit.value = true
  closeSettingsMenu()
}

const saveEdit = async () => {
  try {
    const orgIdForUpdate = organizationId.value || project.value?.org_id || ''
    const updated = await projectStore.updateProject(orgIdForUpdate, projectId, {
      title: editForm.value.title,
      description: editForm.value.description,
      master_prompt: editForm.value.master_prompt,
    })

    if (project.value && updated) {
      project.value.title = editForm.value.title
      project.value.description = editForm.value.description
      project.value.master_prompt = editForm.value.master_prompt
    }

    await Swal.fire({
      title: 'Updated!',
      text: 'Project updated successfully.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    })

    showInlineEdit.value = false
  } catch (err) {
    Swal.fire(
      'Error',
      projectStore.error ||
        (err as ProjectErrorResponse).response?.data?.detail?.[0]?.msg ||
        'Failed to update project',
      'error',
    )
  }
}

watch(
  () => projectStore.projects,
  (newProjects) => {
    const found = newProjects.find((p) => p.id === projectId)
    if (found) project.value = found
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

    <div v-else-if="!project" class="mx-auto max-w-7xl py-16 text-center">
      <h1 class="mb-4 text-2xl font-bold text-gray-900">Project not found</h1>
      <button @click="goBack" class="cursor-pointer text-[#401903] hover:underline">
        <ArrowLeftIcon :size="18" /> Back to Projects
      </button>
    </div>

    <div v-else class="app-container mx-auto">
      <div class="mb-8 flex items-center justify-between">
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
                <RouterLink :to="{ name: 'organization-projects', params: { organizationId } }">
                  {{ organizationName || 'Organization' }}
                </RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink as-child>
                <RouterLink :to="{ name: 'organization-projects', params: { organizationId } }">
                  Projects
                </RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>{{ project.title }}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div class="relative">
          <button
            @click.stop="toggleSettingsMenu"
            class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
          >
            <Settings :size="18" />
          </button>

          <div
            v-if="showSettingsMenu"
            @click.stop
            class="absolute right-0 z-50 mt-2 w-44 rounded-md bg-white shadow-lg ring-1 ring-black/5"
          >
            <button @click="startEdit" class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
              Edit Project
            </button>
            <button
              @click="deleteProject"
              class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Delete Project
            </button>
          </div>
        </div>
      </div>
      <div
        class="mb-5 flex w-full flex-col items-start justify-between gap-4 rounded-[12px] bg-[#EFA75E] px-4 py-4 sm:h-[72px] sm:flex-row sm:items-center sm:px-5"
      >
        <div class="flex w-full items-start gap-4 sm:w-auto sm:items-center">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#D87A07] bg-[#1F1F1F1A] sm:h-12 sm:w-12"
          >
            <img :src="checkmark" alt="check-mark" class="h-5 w-5 sm:h-6 sm:w-6" />
          </div>

          <p class="text-[14px] leading-snug text-[#3A2B1B] sm:text-[16px]">
            Hiring a specialist give you the best possible result.
            <span class="cursor-pointer underline">learn more about a specialist</span>
          </p>
        </div>
        <button
          @click="openHireSpecialistModal"
          class="h-10 w-full cursor-pointer rounded-[10px] bg-white px-4 text-[14px] font-semibold text-[#3A2B1B] shadow-sm sm:h-11 sm:w-auto sm:px-6 sm:text-[15px]"
        >
          Hire a Specialist
        </button>
      </div>
      <div class="mb-8 flex flex-col gap-5 rounded-[10px] bg-white p-5">
        <template v-if="showInlineEdit">
          <form @submit.prevent="saveEdit" class="w-full space-y-4">
            <div>
              <label class="text-sm font-medium text-[#1F1F1F]">Project Name</label>
              <input
                v-model="editForm.title"
                class="h-[52px] w-full rounded-lg border border-[#D5D7DA] px-4 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20"
              />
            </div>

            <div>
              <label class="text-sm font-medium text-[#1F1F1F]">Description</label>
              <textarea
                v-model="editForm.description"
                rows="3"
                class="w-full rounded-lg border border-[#D5D7DA] px-4 py-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20"
              ></textarea>
            </div>

            <div>
              <label class="text-sm font-medium text-[#1F1F1F]">Master Prompt</label>
              <textarea
                v-model="editForm.master_prompt"
                rows="3"
                class="w-full rounded-lg border border-[#D5D7DA] px-4 py-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20"
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
          <h1 class="text-2xl leading-[30px] font-bold text-gray-900">{{ project.title }}</h1>
          <p class="text-sm leading-5 font-normal text-[#4B5563]">{{ project.description }}</p>
          <div class="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <p class="text-[16px] font-medium text-[#1F1F1F]">Default mode of research:</p>

            <div
              class="relative flex h-12 w-full items-center rounded-[12px] border border-[#D1D5DB] bg-white px-4 shadow-sm sm:w-60"
            >
              <select
                v-model="selected"
                class="w-full cursor-pointer appearance-none bg-transparent text-[16px] font-medium text-[#374151] focus:outline-none"
              >
                <option value="AI">AI</option>
                <option value="Manual">Manual</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              <svg
                class="pointer-events-none absolute right-4 h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </template>
      </div>

      <div class="mb-8 flex items-end justify-between md:mt-[88px]">
        <div class="flex w-auto gap-8 border-b border-gray-200">
          <button
            @click="activeTab = 'jurisdictions'"
            :class="[
              'relative pb-4 text-sm font-medium transition-colors',
              activeTab === 'jurisdictions' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            Jurisdictions
            <div
              v-if="activeTab === 'jurisdictions'"
              class="absolute right-0 bottom-0 left-0 h-0.5 bg-[#401903]"
            ></div>
          </button>
        </div>

        <div class="mb-3 flex items-center gap-3">
          <!-- <button @click="router.push({ name: 'jurisdictions-archive', query: { organizationId: organizationId } })"
            class="flex items-center gap-2 rounded-lg border border-[#401903] px-5 py-2.5 text-sm font-medium text-[#401903] shadow-sm transition-all hover:bg-orange-50">
            View Archive
          </button> -->

          <button @click="openAddJurisdictionModal" class="btn--primary btn--with-icon btn--lg">
            <Plus :size="18" />
            Add Jurisdiction
          </button>
        </div>
      </div>

      <div class=" ">
        <div v-if="activeTab === 'jurisdictions'">
          <div v-if="jurisdictionStore.loading" class="space-y-4">
            <div v-for="n in 3" :key="n" class="animate-pulse">
              <div class="h-24 rounded-lg bg-gray-200"></div>
            </div>
          </div>

          <div
            v-else-if="projectJurisdictions.length === 0"
            class="flex flex-col items-center justify-center bg-white py-20"
          >
            <p class="text-sm text-gray-500">No jurisdictions yet for this project.</p>
            <p class="mt-2 text-xs text-gray-400">Add one to start monitoring changes.</p>
          </div>

          <div v-else class="space-y-3">
            <article
              v-for="jurisdiction in topLevelJurisdictions"
              :key="jurisdiction.id"
              @click="goToJurisdiction(jurisdiction.id)"
              class="group cursor-pointer rounded-lg bg-white p-6 shadow ring-1 ring-gray-200/60 transition-all hover:shadow-md hover:ring-[#401903]/10"
            >
              <h3
                class="mb-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-[#401903]"
              >
                {{ jurisdiction.name }}
              </h3>
              <p class="text-sm leading-relaxed text-gray-600">
                {{ jurisdiction.description }}
              </p>
              <p class="mt-2 text-xs text-gray-400">
                {{ new Date(jurisdiction.created_at).toLocaleString() }}
              </p>
            </article>
          </div>
        </div>
      </div>
    </div>

    <Dialog
      :open="showAddJurisdictionModal"
      @update:open="(value) => !value && closeAddJurisdictionModal()"
    >
      <DialogScrollContent class="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Define your Jurisdiction</DialogTitle>
          <DialogDescription>Define a specific legal domain or region to monitor</DialogDescription>
        </DialogHeader>

        <form @submit.prevent="handleCreateJurisdiction" class="space-y-5">
          <div>
            <label for="jurisdictionName" class="mb-2 block text-sm font-medium text-[#1F1F1F]">
              Jurisdiction Name
            </label>
            <input
              v-model="jurisdictionForm.name"
              id="jurisdictionName"
              placeholder="e.g United Kingdom"
              required
              class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4 text-sm text-gray-900 placeholder-[#717680] focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
            />
          </div>

          <div>
            <label for="jurisdictionDesc" class="mb-2 block text-sm font-medium text-[#1F1F1F]">
              Description
            </label>
            <textarea
              v-model="jurisdictionForm.description"
              id="jurisdictionDesc"
              rows="3"
              placeholder="What legal areas will you monitor?"
              required
              class="h-[130px] w-full resize-none rounded-lg border border-[#D5D7DA] px-4 py-3 text-sm text-gray-900 placeholder-[#717680] focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
            />
          </div>

          <div v-if="jurisdictionStore.error" class="rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {{ jurisdictionStore.error }}
          </div>

          <DialogFooter class="flex justify-end gap-2 pt-2">
            <button type="button" @click="closeAddJurisdictionModal" class="btn--secondary btn--lg">
              Cancel
            </button>
            <button type="submit" class="btn--primary btn--lg">Create Jurisdiction</button>
          </DialogFooter>
        </form>
      </DialogScrollContent>
    </Dialog>

    <Dialog
      :open="showHireSpecialistModal"
      @update:open="(value) => !value && closeHireSpecialistModal()"
    >
      <DialogScrollContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Hire a Specialist</DialogTitle>
          <DialogDescription>
            Monitor changes to EU travel rules, visa requirements, entry conditions, and policy
            updates across all Schengen and EU member states
          </DialogDescription>
        </DialogHeader>

        <form @submit.prevent="submitHireForm" class="space-y-6">
          <div>
            <label for="companyName" class="mb-2 block text-sm font-semibold text-gray-900">
              Company Name
            </label>
            <input
              v-model="hireForm.companyName"
              id="companyName"
              type="text"
              required
              class="w-full rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] px-4 py-3 text-sm text-gray-900 placeholder-[#6B7280] transition-colors focus:border-blue-500 focus:ring-0"
            />
          </div>

          <div>
            <label for="companyEmail" class="mb-2 block text-sm font-semibold text-gray-900">
              Company Email Address
            </label>
            <input
              v-model="hireForm.companyEmail"
              id="companyEmail"
              type="email"
              required
              class="w-full rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm text-gray-900 placeholder-[#6B7280] transition-colors focus:border-blue-500 focus:ring-0"
            />
          </div>

          <div>
            <label for="industry" class="mb-2 block text-sm font-semibold text-gray-900">
              Industry
            </label>
            <div class="relative">
              <select
                v-model="hireForm.industry"
                id="industry"
                class="w-full cursor-pointer appearance-none rounded-xl border border-blue-500 bg-white px-4 py-3 text-sm text-gray-900 transition-colors focus:border-blue-700 focus:ring-0"
              >
                <option value="Immigration & Global Mobility">Immigration & Global Mobility</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
              </select>
              <ChevronDown
                :size="16"
                class="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 transform text-gray-500"
              />
            </div>
          </div>

          <div>
            <label for="description" class="mb-2 block text-sm font-semibold text-gray-900">
              Brief Description
            </label>
            <textarea
              v-model="hireForm.description"
              id="description"
              rows="3"
              required
              class="h-24 w-full resize-none rounded-xl border border-[#E2E8F0] px-4 py-3 text-sm text-gray-900 placeholder-[#6B7280] transition-colors focus:border-blue-500 focus:ring-0"
            />
          </div>

          <DialogFooter class="flex justify-end gap-2 pt-4">
            <button type="button" @click="closeHireSpecialistModal" class="btn--secondary btn--lg">
              Cancel
            </button>
            <button type="submit" class="btn--primary btn--lg">Hire Specialist</button>
          </DialogFooter>
        </form>
      </DialogScrollContent>
    </Dialog>
  </main>
</template>
