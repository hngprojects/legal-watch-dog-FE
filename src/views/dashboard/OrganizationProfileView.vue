<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useOrganizationStore } from '@/stores/organization-store'
import { useProjectStore } from '@/stores/project-store'
import { useAuthStore } from '@/stores/auth-store'
import { organizationService } from '@/api/organization'
import type { OrganizationErrorResponse } from '@/types/organization'
import type { UserProfile } from '@/types/user'
import Swal from 'sweetalert2'
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

type MemberRole = 'Admin' | 'User' | 'Manager' | 'Member'
type MemberStatus = 'Active' | 'Pending'

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

const inviteOpen = ref(false)
const inviteForm = ref({ email: '', role: 'Member' as MemberRole })
const inviteSending = ref(false)
const inviteMessage = ref<string | null>(null)
const inviteError = ref<string | null>(null)

const members = ref<Member[]>([])
const membersLoading = ref(false)
const membersError = ref<string | null>(null)

const organization = computed(() =>
  organizations.value.find((item) => item.id === orgId.value) || null,
)

const primaryProject = computed(() => projects.value[0] || null)
const projectModalOpen = ref(false)
const projectModalMode = ref<'edit' | 'create'>('create')
const editingProject = ref<{ id?: string; title?: string; description?: string } | null>(null)
const organizationOptions = computed(() =>
  orgId.value && organization.value
    ? [{ id: orgId.value, name: organization.value.name }]
    : [],
)

const goToProject = (projectId: string) => {
  if (!orgId.value) return
  router.push({ name: 'project-detail', params: { organizationId: orgId.value, id: projectId } })
}

const openEditProject = () => {
  if (!primaryProject.value) return
  editingProject.value = { ...primaryProject.value }
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
  if (!payload.projectId || !orgId.value) return
  await projectStore.updateProject(orgId.value, payload.projectId, {
    title: payload.title,
    description: payload.description,
  })
  projectModalOpen.value = false
  editingProject.value = null
  await Swal.fire('Updated', 'Project updated successfully.', 'success')
}

const deleteProject = async () => {
  if (!primaryProject.value || !orgId.value) return
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
  await projectStore.deleteProject(primaryProject.value.id, orgId.value)
  await Swal.fire('Deleted', 'Project successfully deleted.', 'success')
  await loadProjects()
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
    : 'text-amber-700 bg-amber-50 border-amber-100'

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

const loadProjects = async () => {
  if (!orgId.value) return
  await projectStore.fetchProjects(orgId.value)
}

const mapUserToMember = (user: UserProfile): Member => {
  const fullName = user.name || `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()
  const orgRole =
    user.organizations?.find((org) => org.organization_id === orgId.value)?.role || user.role || ''
  const role: MemberRole =
    orgRole?.toLowerCase() === 'admin'
      ? 'Admin'
      : orgRole?.toLowerCase() === 'manager'
        ? 'Manager'
        : 'User'
  const status: MemberStatus = user.is_active ? 'Active' : 'Pending'
  return {
    id: user.id,
    name: fullName || 'User',
    email: user.email,
    role,
    status,
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
    await Swal.fire('Invitation sent', inviteMessage.value, 'success')
    inviteForm.value.email = ''
    inviteForm.value.role = 'User'
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
  await loadProjects()
  await fetchMembers()
})

watch(
  () => route.params.organizationId,
  async (newVal) => {
    const id = typeof newVal === 'string' ? newVal : ''
    if (!id) return
    inviteMessage.value = null
    inviteError.value = null
    inviteForm.value.email = ''
    inviteForm.value.role = 'User'
    await loadProjects()
    await fetchMembers()
  },
)
</script>

<template>
  <main class="min-h-screen flex-1 bg-gray-50 px-6 py-10 lg:px-12 lg:py-14">
    <div class="mx-auto flex max-w-6xl flex-col gap-8">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium uppercase tracking-wide text-[#9CA3AF]">
            Organization Profile
          </p>
        </div>
        <RouterLink to="/dashboard/organizations" class="text-sm text-[#401903] underline">
          Back to organizations
        </RouterLink>
      </div>

      <section
        class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/60 md:p-8 lg:p-10"
      >
        <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-4 md:gap-6">
            <div
              class="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-gray-200 to-gray-100 text-2xl font-bold text-gray-500"
            >
              {{ initials(organization?.name || 'Org') || 'Org' }}
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                Organization
              </p>
              <h2 class="text-2xl font-bold text-gray-900">{{ organization?.name || 'Org Name' }}</h2>
              <p class="text-sm text-gray-600">
                {{ organization?.industry || 'Law, Regulations & Compliance' }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/60">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Projects</p>
            <p class="text-sm text-gray-500">
              {{ projects.length ? `Showing ${projects.length}` : 'No projects yet' }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button @click="openCreateProject" class="btn--primary">Add Project</button>
            <button @click="openProjects" class="btn--link">View all</button>
          </div>
        </div>

        <div v-if="projectsLoading" class="space-y-4">
          <div class="h-20 animate-pulse rounded-xl bg-gray-100"></div>
        </div>
        <div v-else-if="!primaryProject" class="space-y-4 rounded-xl border border-dashed border-gray-200 p-6 text-center">
          <p class="text-sm text-gray-600">No projects yet. Create one to start tracking changes.</p>
          <div class="flex justify-center">
            <button class="btn--primary" @click="openCreateProject">Add Project</button>
          </div>
        </div>
        <div
          v-else
          class="flex cursor-pointer items-center justify-between rounded-xl border border-gray-100 bg-gray-50/60 p-5 transition hover:bg-white"
          @click="goToProject(primaryProject.id)"
        >
          <div>
            <p class="text-sm font-semibold text-gray-900">{{ primaryProject.title }}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <button
                @click.stop
            class="rounded-full p-2 text-gray-500 transition hover:bg-white hover:text-gray-700"
          >
            <EllipsisVertical :size="18" />
          </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem @click.stop="openEditProject">Edit</DropdownMenuItem>
              <DropdownMenuItem class="text-red-600" @click.stop="deleteProject">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      <section class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/60">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Members</p>
            <p class="text-sm text-gray-500">Invite teammates to collaborate.</p>
          </div>
          <Dialog v-model:open="inviteOpen">
            <DialogTrigger as-child>
              <button
                class="btn--primary"
              >
                Invite Member
              </button>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[480px]">
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
                    class="h-11 w-full rounded-lg border border-[#D5D7DA] px-3 text-sm text-gray-900 placeholder-[#717680] focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-900" for="invite-role">Role</label>
                  <select
                    id="invite-role"
                    v-model="inviteForm.role"
                    class="h-11 w-full rounded-lg border border-[#D5D7DA] px-3 text-sm text-gray-900 focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                  >
                    <option value="Admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
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
                      class="h-10 rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </DialogClose>
                  <button
                    type="submit"
                    :disabled="inviteSending"
                    class="h-10 rounded-lg bg-[#401903] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2a1102] disabled:cursor-not-allowed disabled:opacity-70"
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
                <div class="h-10 w-10 rounded-full bg-gray-100"></div>
                <div>
                  <div class="mb-1 h-4 w-32 rounded bg-gray-100"></div>
                  <div class="h-3 w-40 rounded bg-gray-100"></div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <div class="h-6 w-20 rounded-full bg-gray-100"></div>
                <div class="h-6 w-20 rounded-full bg-gray-100"></div>
                <div class="h-8 w-8 rounded-full bg-gray-100"></div>
              </div>
            </div>
          </div>

          <div v-else-if="membersError" class="py-4 text-sm text-red-600">
            {{ membersError }}
          </div>

          <div v-else-if="!members.length" class="py-4 text-sm text-gray-600">
            No members yet. Invite someone to get started.
          </div>

          <template v-else>
            <article
              v-for="member in members"
              :key="member.id"
              class="flex items-center justify-between py-3"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4dfcd] text-sm font-semibold text-[#5c2a05]"
                >
                  {{ initials(member.name) }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ member.name }}</p>
                  <p class="text-xs text-[#9b755a]">{{ member.email }}</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <Badge
                  :class="['border px-3 py-1 text-xs font-semibold', roleClass(member.role)]"
                >
                  {{ member.role }}
                </Badge>
                <Badge
                  :class="['border px-3 py-1 text-xs font-semibold', statusClass(member.status)]"
                >
                  {{ member.status }}
                </Badge>
                <button
                  class="rounded-full p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
                >
                  <EllipsisVertical :size="18" />
                </button>
              </div>
            </article>
          </template>
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
