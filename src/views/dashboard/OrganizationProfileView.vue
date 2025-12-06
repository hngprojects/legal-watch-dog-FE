<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useOrganizationStore } from '@/stores/organization-store'
import { useProjectStore } from '@/stores/project-store'
import { useAuthStore } from '@/stores/auth-store'
import { organizationService } from '@/api/organization'
import type { Organization, RawOrganization } from '@/types/organization'
import { toast } from 'vue-sonner'
import ProjectFormModal from '@/components/dashboard/ProjectFormModal.vue'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'
import OrganizationFormDialog from '@/components/dashboard/OrganizationFormDialog.vue'
import { Settings, EllipsisVertical } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const organizationStore = useOrganizationStore()
const projectStore = useProjectStore()
const authStore = useAuthStore()
const { organizations, loading: orgLoading } = storeToRefs(organizationStore)
const { projects, loading: projectsLoading, error: projectError } = storeToRefs(projectStore)

const orgId = computed(() => {
  const id = route.params.organizationId
  return typeof id === 'string' ? id : ''
})

const mapRawOrganization = (org: RawOrganization): Organization => ({
  id: org.organization_id || org.organizationId || org.id || (org as { _id?: string })._id || '',
  name: org.name,
  industry: org.industry,
  is_active: org.is_active,
  user_role: org.user_role || (org as { role?: string }).role,
  project_count:
    org.project_count ??
    (org as { projects_count?: number }).projects_count ??
    (Array.isArray((org as { projects?: unknown }).projects)
      ? (org as { projects?: Array<unknown> }).projects?.length
      : undefined),
  created_at: org.created_at,
  updated_at: org.updated_at,
})

const upsertOrganization = (raw: RawOrganization | null | undefined) => {
  if (!raw) return
  const mapped = mapRawOrganization(raw)
  if (!mapped.id) return
  const idx = organizationStore.organizations.findIndex((item) => item.id === mapped.id)
  if (idx >= 0) {
    organizationStore.organizations.splice(idx, 1, mapped)
  } else {
    organizationStore.organizations.push(mapped)
  }
}

const organization = computed(
  () => organizations.value.find((item) => item.id === orgId.value) || null,
)

const projectModalOpen = ref(false)
const projectModalMode = ref<'edit' | 'create'>('create')
const editingProject = ref<{ id?: string; title?: string; description?: string | null } | null>(
  null,
)
const projectSaving = ref(false)
const organizationOptions = computed(() =>
  orgId.value && organization.value ? [{ id: orgId.value, name: organization.value.name }] : [],
)
const orgEditDialogOpen = ref(false)
const orgEditSaving = ref(false)
const orgEditError = ref<string | null>(null)

const goToProject = (projectId: string) => {
  if (!orgId.value) return
  router.push({ name: 'project-detail', params: { organizationId: orgId.value, id: projectId } })
}

const openEditProject = (project: { id?: string; title?: string; description?: string | null }) => {
  if (!project) return
  editingProject.value = { ...project }
  projectModalMode.value = 'edit'
  projectModalOpen.value = true
  projectStore.setError(null)
}

const openCreateProject = () => {
  editingProject.value = null
  projectModalMode.value = 'create'
  projectModalOpen.value = true
  projectStore.setError(null)
}

const closeProjectModal = () => {
  projectModalOpen.value = false
  editingProject.value = null
  projectStore.setError(null)
}

const handleProjectSave = async (payload: {
  title: string
  description: string | null
  organizationId: string
  projectId?: string
}) => {
  const orgForAction = orgId.value
  if (!orgForAction) return
  if (projectSaving.value) return
  projectSaving.value = true

  const targetProjectId = payload.projectId || editingProject.value?.id

  if (projectModalMode.value === 'edit' && targetProjectId) {
    try {
      await projectStore.updateProject(orgForAction, targetProjectId, {
        title: payload.title,
        description: payload.description,
      })
      projectModalOpen.value = false
      editingProject.value = null

      toast.success('Project updated successfully')
      await loadProjects()
    } catch (error) {
      void error
      toast.error(projectStore.error || 'Could not update project')
    } finally {
      projectSaving.value = false
    }
    return
  }

  try {
    const created = await projectStore.addProject({
      title: payload.title,
      description: payload.description,
      organization_id: orgForAction,
    })

    if (created) {
      projectModalOpen.value = false
      toast.success('Project created successfully')
      await loadProjects()
    }
  } catch (error) {
    void error
    toast.error(projectStore.error || 'Could not create project')
  } finally {
    projectSaving.value = false
  }
}

const deleteProject = async (projectId?: string) => {
  if (!projectId || !orgId.value) return

  const confirmed = confirm('Delete this project? This action cannot be undone.')
  if (!confirmed) return

  await projectStore.deleteProject(projectId, orgId.value)
  toast.success('Project successfully deleted')
  await loadProjects()
}

const openEditOrganization = () => {
  if (!organization.value) return
  orgEditError.value = null
  orgEditDialogOpen.value = true
}

const handleOrgSave = async (payload: { name: string; industry: string }) => {
  if (!orgId.value) return

  orgEditSaving.value = true
  orgEditError.value = null

  const updated = await organizationStore.updateOrganization(orgId.value, payload)

  if (updated) {
    orgEditDialogOpen.value = false
    toast.success('Organization updated successfully')
  } else if (organizationStore.error) {
    orgEditError.value = organizationStore.error
    toast.error(organizationStore.error)
  }

  orgEditSaving.value = false
}

const confirmDeleteOrganization = async () => {
  if (!orgId.value || !organization.value) return

  const confirmed = confirm('Delete this organization? This action cannot be undone.')
  if (!confirmed) return

  const deleted = await organizationStore.deleteOrganization(orgId.value)

  if (deleted) {
    toast.success('Organization removed successfully')
    router.push({ name: 'organizations' })
  } else if (organizationStore.error) {
    toast.error(organizationStore.error)
  }
}

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join('')

const ensureUserId = async () => {
  if (authStore.user?.id) return authStore.user.id
  const loaded = await authStore.loadCurrentUser?.()
  return loaded?.id
}

const ensureOrganizations = async () => {
  if (organizations.value.length || orgLoading.value) return
  const userId = await ensureUserId()
  if (userId) {
    await organizationStore.fetchOrganizations(userId)
  }
}

const fetchOrganizationDetails = async () => {
  if (organization.value || !orgId.value) return
  try {
    const { data } = await organizationService.getOrganizationById(orgId.value)
    const raw = (data?.data as RawOrganization | undefined) ?? null
    upsertOrganization(raw)
  } catch (error) {
    console.error('Failed to fetch organization details', error)
  }
}

const loadProjects = async () => {
  if (!orgId.value) return
  await projectStore.fetchProjects(orgId.value)
}

const openProjects = () => {
  router.push({ name: 'organization-projects', params: { organizationId: orgId.value } })
}

onMounted(async () => {
  await ensureOrganizations()
  await fetchOrganizationDetails()
  await loadProjects()
})

watch(
  () => route.params.organizationId,
  async (newVal) => {
    const id = typeof newVal === 'string' ? newVal : ''
    if (!id) return
    await fetchOrganizationDetails()
    await loadProjects()
  },
)
</script>

<template>
  <main class="app-container min-h-screen flex-1 bg-gray-50 px-4 py-6 md:px-6 lg:px-0 lg:py-14">
    <div class="mx-auto flex flex-col gap-6 md:gap-8">
      <div class="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p class="text-xs font-medium tracking-wide text-[#9CA3AF] uppercase md:text-sm">
            Organization Profile
          </p>
        </div>
        <RouterLink
          to="/dashboard/organizations"
          class="text-xs text-[#401903] underline md:text-sm"
        >
          Back to organizations
        </RouterLink>
      </div>

      <section
        class="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200/60 md:rounded-2xl md:p-8 lg:p-10"
      >
        <div class="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-4 md:gap-6">
            <div
              class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-gray-200 to-gray-100 text-lg font-bold text-gray-500 md:h-24 md:w-24 md:text-2xl"
            >
              {{ initials(organization?.name || 'Org') || 'Org' }}
            </div>
            <div class="min-w-0 flex-1">
              <p
                class="text-[10px] font-semibold tracking-wide text-[#9CA3AF] uppercase md:text-xs"
              >
                Organization
              </p>
              <h2 class="truncate text-lg font-bold text-gray-900 md:text-2xl">
                {{ organization?.name || 'Org Name' }}
              </h2>
              <p class="truncate text-xs text-gray-600 md:text-sm">
                {{ organization?.industry || 'Law, Regulations & Compliance' }}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button class="btn--default btn--sm btn--with-icon md:btn--lg md:self-center">
                <Settings :size="16" class="md:hidden" />
                <Settings :size="18" class="hidden md:block" />
                Manage
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click="openEditOrganization">Edit organization</DropdownMenuItem>
              <DropdownMenuItem class="text-red-600" @click="confirmDeleteOrganization">
                Delete organization
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      <section
        class="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200/60 md:rounded-2xl md:p-6"
      >
        <div class="mb-4 flex flex-wrap items-start justify-between gap-3 md:items-center">
          <div>
            <p class="text-[10px] font-semibold tracking-wide text-[#9CA3AF] uppercase md:text-xs">
              Projects ({{ projects.length }})
            </p>
          </div>
          <div class="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <button @click="openCreateProject" class="btn--default btn--sm md:btn--lg">
              Add Project
            </button>
            <button @click="openProjects" class="btn--link">View all</button>
          </div>
        </div>

        <div v-if="projectsLoading" class="space-y-3">
          <div class="h-16 animate-pulse rounded-xl bg-gray-100 md:h-20"></div>
        </div>
        <div
          v-else-if="!projects.length"
          class="space-y-3 rounded-xl border border-dashed border-gray-200 p-6 text-center"
        >
          <p class="text-xs text-gray-600 md:text-sm">
            No projects yet. Create one to start tracking changes.
          </p>
        </div>
        <div v-else class="space-y-2 md:space-y-3">
          <article
            v-for="project in projects"
            :key="project.id"
            class="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50/60 p-3 transition hover:bg-white md:gap-4 md:rounded-xl md:p-5"
            @click="goToProject(project.id)"
          >
            <div class="min-w-0 flex-1">
              <p class="truncate text-xs font-semibold text-gray-900 md:text-sm">
                {{ project.title }}
              </p>
              <p class="line-clamp-1 text-[10px] text-gray-500 md:line-clamp-2 md:text-xs">
                {{ project.description }}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <button
                  @click.stop
                  class="shrink-0 rounded-full p-1.5 text-gray-500 transition hover:bg-white hover:text-gray-700 md:p-2"
                >
                  <EllipsisVertical :size="16" class="md:hidden" />
                  <EllipsisVertical :size="18" class="hidden md:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click.stop="openEditProject(project)">Edit</DropdownMenuItem>
                <DropdownMenuItem class="text-red-600" @click.stop="deleteProject(project.id)">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </article>
        </div>
      </section>

      <section
        class="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200/60 md:rounded-2xl md:p-6"
      >
        <div class="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p class="text-[10px] font-semibold tracking-wide text-[#9CA3AF] uppercase md:text-xs">
              Members & Invitations
            </p>
            <p class="text-xs text-gray-600 md:text-sm">
              Manage teammates, roles, and invites from the members page.
            </p>
          </div>
          <RouterLink
            :to="{ name: 'organization-members', params: { organizationId: orgId } }"
            class="btn--default btn--sm md:btn--lg"
          >
            Open Members
          </RouterLink>
        </div>
      </section>
    </div>

    <div
      v-if="!organization && !orgLoading"
      class="mx-auto mt-10 max-w-3xl rounded-xl bg-white p-8 text-center shadow-sm"
    >
      <p class="text-lg font-semibold text-gray-900">Organization not found</p>
      <p class="mt-2 text-sm text-gray-600">Return to organizations to choose a valid profile.</p>
      <RouterLink to="/dashboard/organizations" class="mt-4 inline-block text-[#401903] underline">
        Go back
      </RouterLink>
    </div>

    <OrganizationFormDialog
      v-if="organization"
      v-model:open="orgEditDialogOpen"
      :initial-name="organization.name"
      :initial-industry="organization.industry || ''"
      title="Edit organization"
      submit-label="Save changes"
      :loading="orgEditSaving"
      :error="orgEditError"
      @save="handleOrgSave"
    />
  </main>

  <ProjectFormModal
    :open="projectModalOpen"
    :mode="projectModalMode"
    :loading="projectSaving"
    :organizations="organizationOptions"
    :default-organization-id="orgId"
    :project="editingProject || undefined"
    :error="projectError"
    @close="closeProjectModal"
    @save="handleProjectSave"
  />
</template>
