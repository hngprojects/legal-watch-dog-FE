<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { AlertCircle, CheckCircle, CircleHelp, Plus, Settings } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

import { useProjectStore } from '@/stores/project-store'
import { useOrganizationStore } from '@/stores/organization-store'
import { useJurisdictionStore } from '@/stores/jurisdiction-store'
import { useAuthStore } from '@/stores/auth-store'
import { useTicketStore } from '@/stores/ticket-store'
import { specialistApi } from '@/api/specialist'
import ProjectFormModal from '@/components/dashboard/ProjectFormModal.vue'
import JurisdictionDialog from '@/components/composables/jurisdiction/dialogs/JurisdictionDialog.vue'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'

const route = useRoute()
const router = useRouter()

const projectStore = useProjectStore()
const organizationStore = useOrganizationStore()
const jurisdictionStore = useJurisdictionStore()
const authStore = useAuthStore()
const ticketStore = useTicketStore()

const { projects, error: projectError } = storeToRefs(projectStore)
const { organizations } = storeToRefs(organizationStore)
const {
  jurisdictions,
  loading: jurisdictionsLoading,
  error: jurisdictionsError,
} = storeToRefs(jurisdictionStore)

const organizationId = computed(() =>
  typeof route.params.organizationId === 'string' ? route.params.organizationId : '',
)
const projectId = computed(() => (typeof route.params.id === 'string' ? route.params.id : ''))

const project = computed(() => projects.value.find((p) => p.id === projectId.value) || null)

const filteredJurisdictions = computed(() =>
  jurisdictions.value
    .filter((j) => j.project_id === projectId.value && !j.is_deleted && !j.parent_id)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
)

const addJurisdictionOpen = ref(false)
const jurisdictionForm = ref({ name: '', description: '' })

const projectModalOpen = ref(false)
const projectModalMode = ref<'edit'>('edit')

const organizationsRequested = ref(false)

const organizationOptions = computed(() =>
  organizations.value.map((org) => ({ id: org.id, name: org.name })),
)

// const organizationName = computed(
//   () => organizations.value.find((org) => org.id === organizationId.value)?.name || 'Organization',
// )

const hiring = ref(false)
const hireEnabled = ref(false)
const projectInstruction = ref('')
const instructionSaving = ref(false)
const isInstructionValid = computed(() => projectInstruction.value.trim().length > 0)
const instructionPlaceholder = computed(() =>
  projectInstruction.value.trim()
    ? 'Describe the monitoring focus, keywords, and context that apply to this project.'
    : 'No instruction set. Add guidance for this project.',
)

const ensureOrganizations = async () => {
  if (organizations.value.length || organizationsRequested.value) return
  organizationsRequested.value = true
  let userId = authStore.user?.id
  if (!userId && authStore.accessToken) {
    const loaded = await authStore.loadCurrentUser?.()
    userId = loaded?.id
  }
  if (userId) await organizationStore.fetchOrganizations(userId)
}

const loadProject = async () => {
  if (!organizationId.value) return
  if (!projects.value.length || !project.value) {
    await projectStore.fetchProjects(organizationId.value)
  }
}

const loadJurisdictions = async () => {
  if (!organizationId.value || !projectId.value) return
  await jurisdictionStore.fetchJurisdictions(projectId.value, organizationId.value)
}

const hasChanges = (j: { id: string }) =>
  ticketStore.tickets.some((t) => t.jurisdiction_id === j.id && t.status !== 'closed')

const openEditProject = () => {
  projectModalMode.value = 'edit'
  projectModalOpen.value = true
}

const handleProjectSave = async (payload: {
  title: string
  description: string | null
  organizationId: string
  projectId?: string
}) => {
  if (!projectId.value) return
  await projectStore.updateProject(payload.organizationId, projectId.value, {
    title: payload.title,
    description: payload.description,
  })
  projectModalOpen.value = false
  toast.success('Project updated')
  await loadProject()
}

const deleteProject = async () => {
  if (!projectId.value || !organizationId.value) return
  const confirmed = confirm('Delete this project? This action cannot be undone.')
  if (!confirmed) return
  await projectStore.deleteProject(projectId.value, organizationId.value)
  toast.success('Project deleted')
  router.push({ name: 'organization-projects', params: { organizationId: organizationId.value } })
}

const openAddJurisdiction = () => {
  jurisdictionForm.value = { name: '', description: '' }
  addJurisdictionOpen.value = true
}

const handleCreateJurisdiction = async () => {
  if (!projectId.value) return
  if (!jurisdictionForm.value.name.trim()) {
    toast.error('Name is required')
    return
  }

  const created = await jurisdictionStore.addJurisdiction(projectId.value, {
    name: jurisdictionForm.value.name.trim(),
    description: jurisdictionForm.value.description.trim(),
  })

  if (created) {
    toast.success('Jurisdiction added')
    addJurisdictionOpen.value = false
    await loadJurisdictions()
  } else if (jurisdictionStore.error) {
    toast.error(jurisdictionStore.error)
  }
}

const goToJurisdiction = (jurisdictionId: string) => {
  router.push({
    name: 'jurisdiction-detail',
    params: { id: jurisdictionId },
    query: { organizationId: organizationId.value },
  })
}

const handleDialogOpenChange = (val: boolean) => {
  addJurisdictionOpen.value = val
}

const handleDialogFormUpdate = (payload: Partial<{ name: string; description: string }>) => {
  jurisdictionForm.value = { ...jurisdictionForm.value, ...payload }
}

const closeAddJurisdiction = () => {
  addJurisdictionOpen.value = false
}

const submitHireRequest = async () => {
  if (hiring.value) return
  hiring.value = true
  try {
    const org = organizations.value.find((o) => o.id === organizationId.value)
    await specialistApi.hire({
      company_name: org?.name || 'Organization',
      company_email: authStore.user?.email || 'user@example.com',
      industry: org?.industry || 'General',
      brief_description:
        project.value?.description ||
        'Hire a specialist to support this project and its jurisdictions.',
    })
    toast.success('Hire request sent')
    hireEnabled.value = true
  } catch (err) {
    console.error(err)
    toast.error('Could not send hire request')
    hireEnabled.value = false
  } finally {
    hiring.value = false
  }
}

const saveProjectInstruction = async () => {
  if (!projectId.value) return
  if (!isInstructionValid.value) {
    toast.error('Project instruction is required')
    return
  }
  instructionSaving.value = true
  try {
    await projectStore.updateProject(organizationId.value, projectId.value, {
      master_prompt: projectInstruction.value.trim() || null,
    })
    toast.success('Project instruction updated')
    await loadProject()
  } catch (err) {
    console.error(err)
    toast.error(projectStore.error || 'Failed to update project instruction')
  } finally {
    instructionSaving.value = false
  }
}

watch(
  project,
  (val) => {
    projectInstruction.value = val?.master_prompt || ''
  },
  { immediate: true },
)

onMounted(async () => {
  await ensureOrganizations()
  await loadProject()
  await loadJurisdictions()
})

watch(
  () => route.params.id,
  async () => {
    await loadProject()
    await loadJurisdictions()
  },
)

watch(
  () => route.params.organizationId,
  async () => {
    await ensureOrganizations()
    await loadProject()
    await loadJurisdictions()
  },
)
</script>

<template>
  <main class="min-h-screen flex-1 bg-[#F5F3F0] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
    <div class="mx-auto flex max-w-6xl flex-col gap-6">
      <header class="flex flex-col gap-3 rounded-2xl bg-[#F5F3F0]">
        <div
          class="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink as-child>
                  <RouterLink :to="{ name: 'organization-projects', params: { organizationId } }">
                    Projects
                  </RouterLink>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>{{ project?.title || 'Project' }}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button
                class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
              >
                <Settings :size="18" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-40">
              <DropdownMenuItem @click="openEditProject">Edit</DropdownMenuItem>
              <DropdownMenuItem variant="destructive" @click="deleteProject">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
          <div class="space-y-2">
            <p class="text-xs font-semibold tracking-[0.15em] text-[#C17A3F] uppercase">Project</p>
            <h1 class="text-2xl font-bold text-[#1F1F1F] sm:text-3xl">
              {{ project?.title || 'Project title' }}
            </h1>
            <p class="text-sm text-gray-600">
              {{ project?.description || 'Monitor changes to this project and its jurisdictions.' }}
            </p>
          </div>

          <div class="mt-6 space-y-3 rounded-xl border border-gray-100 bg-[#FBFBFB] p-4 sm:p-5">
            <div class="space-y-1">
              <label for="project-instruction" class="text-sm font-semibold text-gray-900">
                Project instruction
              </label>
              <p class="text-xs text-gray-500">
                Set the default guidance Watchdog should follow for every jurisdiction in this
                project.
              </p>
            </div>
            <textarea
              id="project-instruction"
              v-model="projectInstruction"
              rows="4"
              :placeholder="instructionPlaceholder"
              class="w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/10 focus:outline-none"
              :disabled="instructionSaving"
              required
            />
            <div class="flex justify-end">
              <button
                class="btn--default btn--sm sm:btn--md"
                type="button"
                :disabled="instructionSaving || !isInstructionValid"
                @click="saveProjectInstruction"
              >
                {{ instructionSaving ? 'Saving...' : 'Save Instruction' }}
              </button>
            </div>
          </div>

          <div
            class="mt-6 flex flex-col items-start gap-4 rounded-xl border border-gray-100 bg-[#FBFBFB] px-4 py-3 sm:flex-row sm:items-center"
          >
            <div class="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80"
                alt="Specialist"
                class="h-10 w-10 rounded-full object-cover shadow-sm"
              />
              <div>
                <p class="text-sm font-semibold text-gray-900">Hire a Specialist</p>
                <p class="text-xs text-gray-500">Professional support, anytime.</p>
              </div>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                class="peer sr-only"
                :checked="hireEnabled"
                :disabled="hiring"
                @change="submitHireRequest"
              />
              <div
                class="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#401903] peer-disabled:opacity-60 after:absolute after:top-1 after:left-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5"
              ></div>
            </label>
          </div>
        </section>
      </header>

      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="border-b text-base font-semibold text-[#1F1F1F]">Jurisdictions</h2>
          </div>
          <button
            class="btn--default btn--with-icon btn--sm sm:btn--lg"
            @click="openAddJurisdiction"
          >
            <Plus :size="16" />
            Add Jurisdiction
          </button>
        </div>

        <div v-if="jurisdictionsLoading" class="space-y-3">
          <div v-for="n in 2" :key="n" class="h-20 animate-pulse rounded-xl bg-gray-100" />
        </div>

        <div v-else>
          <div v-if="filteredJurisdictions.length" class="space-y-3">
            <div
              v-if="jurisdictionsError"
              class="mb-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {{ jurisdictionsError }}
            </div>

            <article
              v-for="j in filteredJurisdictions"
              :key="j.id"
              class="cursor-pointer rounded-xl border border-gray-100 bg-[#FAF9F7] px-4 py-4 shadow-sm transition hover:bg-white"
              @click="goToJurisdiction(j.id)"
            >
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div class="space-y-1">
                  <h3 class="text-base font-semibold text-gray-900">{{ j.name }}</h3>
                  <p class="text-sm text-gray-600">{{ j.description }}</p>
                </div>
                <span
                  class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                  :class="
                    hasChanges(j)
                      ? 'bg-destructive text-destructive-fg'
                      : 'bg-[#E9FBF3] text-[#2F9F6B]'
                  "
                >
                  <AlertCircle v-if="hasChanges(j)" :size="16" class="text-destructive-fg" />
                  <CheckCircle v-else :size="16" class="text-[#2F9F6B]" />
                  {{ hasChanges(j) ? 'Changes detected' : 'No changes' }}
                </span>
              </div>
            </article>
          </div>

          <div
            v-else
            class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-[#F8F7F5] px-6 py-12 text-center"
          >
            <div
              class="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500"
            >
              <CircleHelp :size="26" />
            </div>
            <p class="text-sm font-semibold text-gray-900">No Jurisdictions added</p>
            <p class="mt-1 text-xs text-gray-500">
              Search sources or click add jurisdiction to get started.
            </p>
          </div>
        </div>
      </section>
    </div>

    <ProjectFormModal
      :open="projectModalOpen"
      :mode="projectModalMode"
      :organizations="organizationOptions"
      :default-organization-id="organizationId"
      :project="project || undefined"
      :error="projectError"
      @close="projectModalOpen = false"
      @save="handleProjectSave"
    />

    <JurisdictionDialog
      :open="addJurisdictionOpen"
      :form="jurisdictionForm"
      title="Create Jurisdiction"
      description="Define the region or legal domain you want to monitor."
      name-label="Jurisdiction Name"
      name-placeholder="e.g. United Kingdom Immigration"
      description-label="Description"
      description-placeholder="What scope or topics will you track?"
      submit-text="Create Jurisdiction"
      @update:open="handleDialogOpenChange"
      @update:form="handleDialogFormUpdate"
      @submit="handleCreateJurisdiction"
      @cancel="closeAddJurisdiction"
    />
  </main>
</template>
