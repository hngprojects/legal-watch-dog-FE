<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useOrganizationStore } from '@/stores/organization-store'
import { useProjectStore } from '@/stores/project-store'
import { useAuthStore } from '@/stores/auth-store'
import { organizationService } from '@/api/organization'
import { invitationService } from '@/api/invitation'
import type { OrganizationErrorResponse } from '@/types/organization'
import type { Organization, RawOrganization } from '@/types/organization'
import type { Invitation } from '@/types/invitation'
import type { UserProfile } from '@/types/user'
import Swal from '@/lib/swal'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { EllipsisVertical } from 'lucide-vue-next'
import ProjectFormModal from '@/components/dashboard/ProjectFormModal.vue'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'
import OrganizationFormDialog from '@/components/dashboard/OrganizationFormDialog.vue'
import { Settings } from 'lucide-vue-next'

type MemberRole = 'Admin' | 'Manager' | 'Member'
type MemberStatus = 'Active' | 'Pending' | 'Inactive'

type Member = {
  id: string
  name: string
  email: string
  role: MemberRole
  status: MemberStatus
}

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

const inviteOpen = ref(false)
const inviteForm = ref({ email: '', role: 'Member' as MemberRole })
const inviteSending = ref(false)
const inviteMessage = ref<string | null>(null)
const inviteError = ref<string | null>(null)
const orgInvitations = ref<Invitation[]>([])
const orgInvitationsLoading = ref(false)
const orgInvitationsError = ref<string | null>(null)

const members = ref<Member[]>([])
const membersLoading = ref(false)
const membersError = ref<string | null>(null)

const organization = computed(
  () => organizations.value.find((item) => item.id === orgId.value) || null,
)

const projectModalOpen = ref(false)
const projectModalMode = ref<'edit' | 'create'>('create')
const editingProject = ref<{ id?: string; title?: string; description?: string } | null>(null)
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

const openEditProject = (project: { id?: string; title?: string; description?: string }) => {
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
  description: string
  organizationId: string
  projectId?: string
}) => {
  const orgForAction = orgId.value
  if (!orgForAction) return

  const targetProjectId = payload.projectId || editingProject.value?.id

  if (projectModalMode.value === 'edit' && targetProjectId) {
    await projectStore.updateProject(orgForAction, targetProjectId, {
      title: payload.title,
      description: payload.description,
    })
    projectModalOpen.value = false
    editingProject.value = null
    await Swal.fire('Updated', 'Project updated successfully.', 'success')
    await loadProjects()
    return
  }

  const created = await projectStore.addProject({
    title: payload.title,
    description: payload.description,
    organization_id: orgForAction,
  })
  if (created) {
    projectModalOpen.value = false
    await Swal.fire('Created', 'Project created successfully.', 'success')
    await loadProjects()
  }
}

const deleteProject = async (projectId?: string) => {
  if (!projectId || !orgId.value) return
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
  await projectStore.deleteProject(projectId, orgId.value)
  await Swal.fire('Deleted', 'Project successfully deleted.', 'success')
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

    await Swal.fire('Updated', 'Organization updated successfully.', 'success')
  } else if (organizationStore.error) {
    orgEditError.value = organizationStore.error
  }

  orgEditSaving.value = false
}

const confirmDeleteOrganization = async () => {
  if (!orgId.value || !organization.value) return
  const result = await Swal.fire({
    title: 'Delete organization?',
    text: 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
  })
  if (!result.isConfirmed) return
  const deleted = await organizationStore.deleteOrganization(orgId.value)
  if (deleted) {
    await Swal.fire('Deleted', 'Organization removed successfully.', 'success')
    router.push({ name: 'organizations' })
  } else if (organizationStore.error) {
    await Swal.fire('Could not delete', organizationStore.error, 'error')
  }
}

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join('')

const statusClass = (status: MemberStatus) =>
  status === 'Active'
    ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
    : status === 'Pending'
      ? 'text-amber-700 bg-amber-50 border-amber-100'
      : 'text-red-700 bg-red-50 border-red-100'

const roleClass = (role: MemberRole) => {
  switch (role) {
    case 'Admin':
      return 'text-[#9b3413] bg-[#fbeadd] border-[#f1d2b8]'
    case 'Manager':
      return 'text-[#6e2b3f] bg-[#f9e7ec] border-[#f2c9d8]'
    default:
      return 'text-[#92400e] bg-[#fef6ec] border-[#f5e0c3]'
  }
}

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

const normalizeOrgInvitations = (payload: unknown): Invitation[] => {
  if (Array.isArray(payload)) {
    return payload
      .map((item) => ({
        id: (item as Invitation)?.id,
        token: (item as Invitation)?.token,
        organization_id: (item as Invitation)?.organization_id || orgId.value,
        organization_name: (item as Invitation)?.organization_name,
        role: (item as Invitation)?.role || (item as Invitation)?.role_name,
        role_name: (item as Invitation)?.role_name,
        status: (item as Invitation)?.status,
      }))
      .filter((item) => item.token && item.organization_id)
  }

  if (payload && typeof payload === 'object') {
    const obj = payload as { invitations?: unknown; data?: unknown }
    const list = obj.invitations || obj.data
    if (Array.isArray(list)) return normalizeOrgInvitations(list)
  }

  return []
}

const loadOrganizationInvitations = async () => {
  if (!orgId.value) return
  orgInvitationsLoading.value = true
  orgInvitationsError.value = null
  try {
    const { data } = await invitationService.listMyInvitations()
    const payload = data?.data ?? data
    const allInvites = normalizeOrgInvitations(payload)
    orgInvitations.value = allInvites.filter((invite) => invite.organization_id === orgId.value)
  } catch (error) {
    const err = error as OrganizationErrorResponse
    if (!err.response) {
      orgInvitationsError.value = 'Network error: Unable to reach server'
    } else {
      orgInvitationsError.value =
        err.response.data?.detail?.[0]?.msg ||
        err.response.data?.message ||
        'Failed to load invitations'
    }
  } finally {
    orgInvitationsLoading.value = false
  }
}

const mapUserToMember = (user: UserProfile): Member => {
  const fullName = user.name || `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()
  const memberId = user.id || user.user_id || ''
  const orgRecord = user.organizations?.find((org) => org.organization_id === orgId.value)
  const orgRole = orgRecord?.role || user.role || ''
  const normalizedRole = orgRole?.toLowerCase()
  const role: MemberRole =
    normalizedRole === 'admin' ? 'Admin' : normalizedRole === 'manager' ? 'Manager' : 'Member'
  const orgActive = user.organizations?.find((org) => org.organization_id === orgId.value)
  const effectiveActive =
    orgActive?.is_active ??
    (typeof orgActive?.is_active === 'undefined' ? user.is_active : orgActive?.is_active)
  const status: MemberStatus =
    effectiveActive === false ? 'Inactive' : effectiveActive === true ? 'Active' : 'Pending'
  return {
    id: memberId,
    name: fullName || 'Member',
    email: user.email,
    role,
    status,
  }
}

const memberActionLoading = ref<string | null>(null)

const updateMemberRole = async (member: Member, targetRole: MemberRole) => {
  if (!orgId.value || member.role === targetRole) return
  if (!member.id) {
    await Swal.fire('Missing user', 'Cannot update role: user ID unavailable.', 'error')
    return
  }
  memberActionLoading.value = `${member.id}-role`
  try {
    await organizationService.updateMemberRole(orgId.value, member.id, targetRole)
    members.value = members.value.map((item) =>
      item.id === member.id ? { ...item, role: targetRole } : item,
    )
    await Swal.fire('Role updated', `${member.name} is now ${targetRole}.`, 'success')
  } catch (error) {
    const err = error as OrganizationErrorResponse
    const message = !err.response
      ? 'Network error: Unable to reach server'
      : err.response.data?.detail?.[0]?.msg ||
        err.response.data?.message ||
        'Failed to update member role'
    await Swal.fire('Could not update role', message, 'error')
  } finally {
    memberActionLoading.value = null
  }
}

const toggleMemberStatus = async (member: Member) => {
  if (!orgId.value) return
  if (!member.id) {
    await Swal.fire('Missing user', 'Cannot update status: user ID unavailable.', 'error')
    return
  }
  const targetStatus: MemberStatus = member.status === 'Active' ? 'Inactive' : 'Active'
  memberActionLoading.value = `${member.id}-status`
  try {
    await organizationService.updateMemberStatus(orgId.value, member.id, targetStatus === 'Active')
    members.value = members.value.map((item) =>
      item.id === member.id ? { ...item, status: targetStatus } : item,
    )
    const verb = targetStatus === 'Active' ? 'activated' : 'deactivated'
    await Swal.fire('Status updated', `${member.name} has been ${verb}.`, 'success')
  } catch (error) {
    const err = error as OrganizationErrorResponse
    const message = !err.response
      ? 'Network error: Unable to reach server'
      : err.response.data?.detail?.[0]?.msg ||
        err.response.data?.message ||
        'Failed to update member status'
    await Swal.fire('Could not update status', message, 'error')
  } finally {
    memberActionLoading.value = null
  }
}

const fetchMembers = async () => {
  if (!orgId.value) return
  membersLoading.value = true
  membersError.value = null
  try {
    const { data } = await organizationService.listOrganizationUsers(orgId.value)
    const users = data.data?.users ?? []
    members.value = users.map(mapUserToMember)
  } catch (error) {
    const err = error as OrganizationErrorResponse
    if (!err.response) {
      membersError.value = 'Network error: Unable to reach server'
    } else {
      membersError.value =
        err.response.data?.detail?.[0]?.msg ||
        err.response.data?.message ||
        'Failed to load members'
    }
  } finally {
    membersLoading.value = false
  }
}

const openProjects = () => {
  router.push({ name: 'organization-projects', params: { organizationId: orgId.value } })
}

const sendInvitation = async () => {
  inviteError.value = null
  inviteMessage.value = null
  if (!orgId.value) {
    inviteError.value = 'Select an organization before inviting teammates.'
    return
  }
  if (!inviteForm.value.email.trim()) {
    inviteError.value = 'Email is required'
    return
  }

  inviteSending.value = true
  try {
    const { data } = await organizationService.inviteMember(orgId.value, {
      invited_email: inviteForm.value.email.trim(),
      role_name: inviteForm.value.role,
    })
    inviteMessage.value = data.message || data.data?.message || 'Invitation sent successfully.'
    inviteOpen.value = false
    await loadOrganizationInvitations()
    await Swal.fire('Invitation sent', inviteMessage.value, 'success')
    inviteForm.value.email = ''
    inviteForm.value.role = 'Member'
  } catch (error) {
    const err = error as OrganizationErrorResponse
    if (!err.response) {
      inviteError.value = 'Network error: Unable to reach server'
    } else {
      inviteError.value =
        err.response.data?.detail?.[0]?.msg ||
        err.response.data?.message ||
        'Failed to send invitation'
    }
    inviteOpen.value = false
    await Swal.fire('Could not send invite', inviteError.value, 'error')
  } finally {
    inviteSending.value = false
  }
}

onMounted(async () => {
  await ensureOrganizations()
  await fetchOrganizationDetails()
  await loadProjects()
  await fetchMembers()
  await loadOrganizationInvitations()
})

watch(
  () => route.params.organizationId,
  async (newVal) => {
    const id = typeof newVal === 'string' ? newVal : ''
    if (!id) return
    inviteMessage.value = null
    inviteError.value = null
    inviteForm.value.email = ''
    inviteForm.value.role = 'Member'
    await fetchOrganizationDetails()
    await loadProjects()
    await fetchMembers()
    await loadOrganizationInvitations()
  },
)
</script>

<template>
  <main class="app-container min-h-screen flex-1 bg-gray-50 px-4 py-6 md:px-6 lg:px-0 lg:py-14">
    <div class="mx-auto flex flex-col gap-6 md:gap-8">
      <div class="flex items-center justify-between">
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
        <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
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
              <button
                class="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-[#401903] text-xs font-medium text-white transition-colors hover:bg-[#401903]/90 md:h-11 md:w-auto md:px-8 md:text-sm"
              >
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
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-[10px] font-semibold tracking-wide text-[#9CA3AF] uppercase md:text-xs">
              Projects ({{ projects.length }})
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="openCreateProject"
              class="h-8 rounded-lg bg-[#401903] px-3 text-xs text-white transition-colors hover:bg-[#401903]/90 md:h-11 md:px-8 md:text-sm"
            >
              Add Project
            </button>
            <button
              @click="openProjects"
              class="text-xs font-medium text-[#401903] hover:underline md:text-sm"
            >
              View all
            </button>
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
          <div class="flex justify-center">
            <button
              class="h-9 rounded-lg bg-[#401903] px-4 text-xs text-white transition-colors hover:bg-[#401903]/90 md:h-11 md:px-8 md:text-sm"
              @click="openCreateProject"
            >
              Add Project
            </button>
          </div>
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
        <div class="mb-4 flex items-center justify-between gap-2">
          <div class="min-w-0">
            <p class="text-[10px] font-semibold tracking-wide text-[#9CA3AF] uppercase md:text-xs">
              Members
            </p>
            <p class="truncate text-xs text-gray-500 md:text-sm">
              Invite teammates to collaborate.
            </p>
          </div>
          <Dialog v-model:open="inviteOpen">
            <DialogTrigger as-child>
              <button
                class="h-8 rounded-lg bg-[#401903] px-3 text-xs whitespace-nowrap text-white transition-colors hover:bg-[#401903]/90 md:h-11 md:px-8 md:text-sm"
              >
                Invite Member
              </button>
            </DialogTrigger>
            <DialogContent class="w-[95%] rounded-xl sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Invite teammate</DialogTitle>
                <DialogDescription>
                  Send an invitation email to join this organization.
                </DialogDescription>
              </DialogHeader>
              <form class="space-y-4" @submit.prevent="sendInvitation">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-900" for="invite-email">Email</label>
                  <input
                    id="invite-email"
                    v-model="inviteForm.email"
                    type="email"
                    placeholder="teammate@company.com"
                    required
                    class="h-10 w-full rounded-lg border border-[#D5D7DA] px-3 text-sm text-gray-900 placeholder-[#717680] focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none md:h-11"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-900" for="invite-role">Role</label>
                  <select
                    id="invite-role"
                    v-model="inviteForm.role"
                    class="h-10 w-full rounded-lg border border-[#D5D7DA] px-3 text-sm text-gray-900 focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none md:h-11"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Member">Member</option>
                  </select>
                </div>

                <div v-if="inviteMessage" class="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                  {{ inviteMessage }}
                </div>
                <div v-else-if="inviteError" class="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {{ inviteError }}
                </div>

                <DialogFooter class="mt-2 flex items-center justify-end gap-3">
                  <DialogClose as-child>
                    <button
                      type="button"
                      class="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-700 transition-colors hover:bg-gray-50 md:h-11 md:px-8"
                    >
                      Cancel
                    </button>
                  </DialogClose>
                  <button
                    type="submit"
                    :disabled="inviteSending"
                    class="h-10 rounded-lg bg-[#401903] px-4 text-sm text-white transition-colors hover:bg-[#401903]/90 disabled:cursor-not-allowed disabled:opacity-70 md:h-11 md:px-8"
                  >
                    <span v-if="inviteSending">Sending...</span>
                    <span v-else>Send Invite</span>
                  </button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div class="divide-y divide-gray-100">
          <div v-if="membersLoading" class="space-y-3">
            <div v-for="n in 4" :key="n" class="flex items-center justify-between py-3">
              <div class="flex items-center gap-3">
                <div class="h-8 w-8 rounded-full bg-gray-100 md:h-10 md:w-10"></div>
                <div>
                  <div class="mb-1 h-3 w-24 rounded bg-gray-100 md:h-4 md:w-32"></div>
                  <div class="h-2 w-32 rounded bg-gray-100 md:h-3 md:w-40"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="membersError" class="py-4 text-xs text-red-600 md:text-sm">
            {{ membersError }}
          </div>

          <div v-else-if="!members.length" class="py-4 text-xs text-gray-600 md:text-sm">
            No members yet. Invite someone to get started.
          </div>

          <template v-else>
            <article
              v-for="member in members"
              :key="member.id"
              class="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0"
            >
              <div class="flex min-w-0 flex-1 items-center gap-3">
                <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4dfcd] text-xs font-semibold text-[#5c2a05] md:h-10 md:w-10 md:text-sm"
                >
                  {{ initials(member.name) }}
                </div>
                <div class="min-w-0 flex-1 pr-2">
                  <p class="truncate text-xs font-semibold text-gray-900 md:text-sm">
                    {{ member.name }}
                  </p>
                  <p class="truncate text-[10px] text-[#9b755a] md:text-xs">{{ member.email }}</p>
                </div>
              </div>

              <div
                class="flex w-full items-center justify-between gap-3 pl-[48px] sm:w-auto sm:justify-start sm:pl-0"
              >
                <div class="flex gap-2">
                  <Badge
                    :class="[
                      'border px-2 py-0.5 text-[10px] font-semibold md:px-3 md:py-1 md:text-xs',
                      roleClass(member.role),
                    ]"
                  >
                    {{ member.role }}
                  </Badge>
                  <Badge
                    :class="[
                      'border px-2 py-0.5 text-[10px] font-semibold md:px-3 md:py-1 md:text-xs',
                      statusClass(member.status),
                    ]"
                  >
                    {{ member.status }}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <button
                      @click.stop
                      class="shrink-0 rounded-full p-1.5 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700 md:p-2"
                    >
                      <EllipsisVertical :size="16" class="md:hidden" />
                      <EllipsisVertical :size="18" class="hidden md:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      :disabled="
                        memberActionLoading === `${member.id}-role` || member.role === 'Admin'
                      "
                      @click.stop="updateMemberRole(member, 'Admin')"
                    >
                      Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      :disabled="
                        memberActionLoading === `${member.id}-role` || member.role === 'Manager'
                      "
                      @click.stop="updateMemberRole(member, 'Manager')"
                    >
                      Manager
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      :disabled="
                        memberActionLoading === `${member.id}-role` || member.role === 'Member'
                      "
                      @click.stop="updateMemberRole(member, 'Member')"
                    >
                      Member
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      :disabled="memberActionLoading === `${member.id}-status`"
                      @click.stop="toggleMemberStatus(member)"
                    >
                      {{ member.status === 'Active' ? 'Deactivate' : 'Activate' }}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </article>
          </template>
        </div>

        <div
          class="mt-6 rounded-lg border border-dashed border-gray-200 bg-gray-50/60 p-3 md:mt-8 md:p-4"
        >
          <div class="mb-3 flex items-center justify-between">
            <div>
              <p
                class="text-[10px] font-semibold tracking-wide text-[#9CA3AF] uppercase md:text-xs"
              >
                Pending invitations
              </p>
              <p class="text-xs text-gray-600 md:text-sm">Invites sent for this organization.</p>
            </div>
          </div>
          <div v-if="orgInvitationsLoading" class="space-y-2">
            <div
              v-for="n in 3"
              :key="n"
              class="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm"
            >
              <div class="h-3 w-24 animate-pulse rounded bg-gray-200"></div>
              <div class="h-3 w-12 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
          <div v-else-if="orgInvitationsError" class="text-xs text-red-600 md:text-sm">
            {{ orgInvitationsError }}
          </div>
          <div v-else-if="!orgInvitations.length" class="text-xs text-gray-600 md:text-sm">
            No pending invitations.
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="invite in orgInvitations"
              :key="invite.token"
              class="flex flex-col gap-2 rounded-lg bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="min-w-0">
                <p class="truncate text-xs font-semibold text-gray-900 md:text-sm">
                  {{ invite.organization_name || organization?.name || 'Organization' }}
                </p>
                <p class="truncate text-[10px] text-gray-500 md:text-xs">
                  Token: {{ invite.token }}
                </p>
              </div>
              <span
                class="self-start rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 sm:self-auto md:px-3 md:py-1 md:text-xs"
              >
                {{ invite.role_name || invite.role || 'Member' }}
              </span>
            </div>
          </div>
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
    :organizations="organizationOptions"
    :default-organization-id="orgId"
    :project="editingProject || undefined"
    :error="projectError"
    @close="closeProjectModal"
    @save="handleProjectSave"
  />
</template>
