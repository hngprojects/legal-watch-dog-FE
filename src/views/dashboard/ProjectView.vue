<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/project-store'
import { useOrganizationStore } from '@/stores/organization-store'
import { useAuthStore } from '@/stores/auth-store'
import Swal from 'sweetalert2'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import ProjectFormModal from '@/components/dashboard/ProjectFormModal.vue'

const projectStore = useProjectStore()
const organizationStore = useOrganizationStore()
const authStore = useAuthStore()
const { projects, loading, error } = storeToRefs(projectStore)
const { organizations, loading: orgLoading } = storeToRefs(organizationStore)
const router = useRouter()
const route = useRoute()

const showProjectModal = ref(false)
const projectModalMode = ref<'create' | 'edit'>('create')

const inviteForm = ref({
  email: '',
  role: 'Member',
})
// const inviteSending = ref(false)
const inviteMessage = ref<string | null>(null)
const inviteError = ref<string | null>(null)

const organizationId = computed(() => {
  const id = route.params.organizationId
  return typeof id === 'string' ? id : ''
})
const hasOrganization = computed(() => Boolean(organizationId.value))
const organizationName = computed(() => {
  const currentId = organizationId.value
  if (!currentId) return ''
  return organizations.value.find((org) => org.id === currentId)?.name || 'Organization'
})
const organizationOptions = computed(() =>
  organizations.value.map((org) => ({ id: org.id, name: org.name })),
)

const ensureOrganizations = async () => {
  if (organizations.value.length || orgLoading.value) return
  let userId = authStore.user?.id
  if (!userId) {
    const loaded = await authStore.loadCurrentUser?.()
    userId = loaded?.id
  }
  if (userId) {
    await organizationStore.fetchOrganizations(userId)
  }
}

const openCreateModal = async () => {
  await ensureOrganizations()

  if (!organizationId.value && !organizations.value.length) {
    projectStore.setError('Add an organization before creating a project.')
    router.push({ name: 'organizations' })
    return
  }

  projectModalMode.value = 'create'
  showProjectModal.value = true
  projectStore.setError(null)
}

const closeProjectModal = () => {
  showProjectModal.value = false
  projectStore.setError(null)
}

const handleProjectSave = async (payload: {
  title: string
  description: string
  organizationId: string
  projectId?: string
}) => {
  projectStore.setError(null)

  const orgIdToUse = payload.organizationId || organizationId.value

  if (!orgIdToUse) {
    projectStore.setError('Select an organization before creating a project.')
    return
  }

  if (projectModalMode.value === 'edit' && payload.projectId) {
    try {
      await projectStore.updateProject(orgIdToUse, payload.projectId, {
        title: payload.title,
        description: payload.description,
      })
      await Swal.fire('Updated', 'Project updated successfully.', 'success')
      closeProjectModal()
    } catch (error) {
      void error
      await Swal.fire('Update failed', projectStore.error || 'Could not update project', 'error')
    }
    return
  }

  try {
    const newProject = await projectStore.addProject({
      title: payload.title,
      description: payload.description,
      organization_id: orgIdToUse,
    })

    if (newProject) {
      await Swal.fire('Created', 'Project created successfully.', 'success')
      closeProjectModal()
      router.push({
        name: 'organization-projects',
        params: { organizationId: orgIdToUse },
      })
    }
  } catch (error) {
    void error
    await Swal.fire('Create failed', projectStore.error || 'Could not create project', 'error')
  }
}

// const sendInvitation = async () => {
//   inviteError.value = null
//   inviteMessage.value = null

//   if (!organizationId.value) {
//     inviteError.value = 'Select an organization before inviting teammates.'
//     return
//   }

//   if (!inviteForm.value.email.trim()) {
//     inviteError.value = 'Email is required'
//     return
//   }

//   inviteSending.value = true
//   try {
//     const { data } = await organizationService.inviteMember(organizationId.value, {
//       invited_email: inviteForm.value.email.trim(),
//       role_name: inviteForm.value.role,
//     })

//     const message = data.message || data.data?.message || 'Invitation sent successfully.'

//     inviteMessage.value = message
//     await Swal.fire('Invitation sent', message, 'success')
//     inviteForm.value.email = ''
//   } catch (error) {
//     const err = error as OrganizationErrorResponse
//     if (!err.response) {
//       inviteError.value = 'Network error: Unable to reach server'
//     } else {
//       inviteError.value =
//         err.response.data?.detail?.[0]?.msg ||
//         err.response.data?.message ||
//         'Failed to send invitation'
//     }
//     await Swal.fire('Could not send invite', inviteError.value, 'error')
//   } finally {
//     inviteSending.value = false
//   }
// }

const goToProject = (id: string) => {
  router.push({
    name: 'project-detail',
    params: { organizationId: organizationId.value, id },
  })
}

onMounted(() => {
  if (organizationId.value) {
    projectStore.fetchProjects(organizationId.value)
  } else {
    projectStore.setError('Select an organization to view projects.')
  }
  void ensureOrganizations()
})

watch(
  () => route.params.organizationId,
  (newVal) => {
    const id = typeof newVal === 'string' ? newVal : ''
    inviteMessage.value = null
    inviteError.value = null
    inviteForm.value.email = ''
    inviteForm.value.role = 'Member'
    if (id) {
      projectStore.fetchProjects(id)
    } else {
      projectStore.projects = []
      projectStore.setError('Select an organization to view projects.')
    }
  },
)
</script>

<template>
  <main class="min-h-screen flex-1 bg-gray-50 px-6 py-10 lg:px-12 lg:py-14">
    <div
      v-if="!organizationId"
      class="mx-auto max-w-4xl rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-gray-100"
    >
      <h1 class="text-2xl font-bold text-gray-900">Choose an organization first</h1>
      <p class="mt-2 text-sm text-gray-600">
        Projects live under organizations. Select an organization to view or create projects.
      </p>
      <div class="mt-6 flex justify-center">
        <RouterLink
          to="/dashboard/organizations"
          class="btn--primary"
        >
          Go to Organizations
        </RouterLink>
      </div>
    </div>
    <div v-else class="mx-auto max-w-7xl space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink as-child>
                <RouterLink :to="{ name: 'organizations' }">Organizations</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem v-if="hasOrganization">
              <BreadcrumbLink as-child>
                <RouterLink
                  :to="{ name: 'organization-profile', params: { organizationId } }"
                >
                  {{ organizationName || 'Organization' }}
                </RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem v-else>
              <BreadcrumbPage>Organization</BreadcrumbPage>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Projects</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div class="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div>
          <div v-if="loading" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="n in 6" :key="n" class="animate-pulse rounded-2xl bg-white p-8 shadow-sm">
              <div class="mb-4 h-6 w-3/4 rounded bg-gray-200"></div>
              <div class="space-y-2">
                <div class="h-4 w-full rounded bg-gray-200"></div>
                <div class="h-4 w-5/6 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>

          <div v-else-if="error" class="flex min-h-[600px] items-center justify-center">
            <div class="text-center">
              <p class="mb-4 text-red-600">{{ error }}</p>
              <button
                @click="organizationId && projectStore.fetchProjects(organizationId)"
                :disabled="!organizationId"
                class="btn btn--link"
              >
                Retry
              </button>
            </div>
          </div>

          <div v-else-if="projects.length === 0" class="flex items-center justify-center">
            <div class="text-center flex flex-col items-center">
              <div class="mb-6 flex justify-center">
                <svg
                  width="240"
                  height="240"
                  viewBox="0 0 240 240"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="20"
                    y="35"
                    width="50"
                    height="40"
                    rx="4"
                    stroke="#E5E7EB"
                    stroke-width="2"
                    fill="white"
                  />
                  <rect
                    x="50"
                    y="45"
                    width="50"
                    height="40"
                    rx="4"
                    stroke="#E5E7EB"
                    stroke-width="2"
                    fill="white"
                  />
                  <line x1="35" y1="50" x2="55" y2="50" stroke="#E5E7EB" stroke-width="2" />
                  <line x1="35" y1="60" x2="50" y2="60" stroke="#E5E7EB" stroke-width="2" />
                </svg>
              </div>
              <h2 class="mb-3 text-2xl font-bold text-gray-900">No Project Created</h2>
              <p class="mb-2 text-sm text-gray-600">
                Create a project to start tracking changes on any website.
              </p>
              <p class="mb-8 text-sm text-gray-600">
                Our AI will monitor the sites and send you summarized updates automatically.
              </p>
              <button
                @click="openCreateModal"
                class="btn--primary btn--with-icon"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 3V13"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3 8H13"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Create Project
              </button>
            </div>
          </div>

          <div v-else class="space-y-8">
            <!-- Header with Create Button -->
            <div class="flex items-center justify-between">
              <h1 class="text-3xl font-bold text-gray-900 lg:text-4xl">
                {{ organizationName || 'Organization' }}'s Projects
              </h1>
              <button
                @click="openCreateModal"
                class="btn--with-icon btn--primary"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 4V16"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M4 10H16"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Create Project
              </button>
            </div>

            <!-- Projects Grid -->
            <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <article
                v-for="project in projects"
                :key="project.id"
                @click="goToProject(project.id)"
                class="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-300 hover:shadow-lg hover:ring-[#401903]/10"
              >
                <div class="p-8">
                  <h3
                    class="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-[#401903]"
                  >
                    {{ project.title }}
                  </h3>
                  <p
                    v-if="project.description"
                    class="line-clamp-3 text-sm leading-relaxed text-gray-600"
                  >
                    {{ project.description }}
                  </p>
                </div>
              </article>
            </div>
          </div>
        </div>

        <!-- <aside class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/60">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                Team Access
              </p>
              <h2 class="mt-1 text-lg font-bold text-gray-900">Invite teammates</h2>
              <p class="mt-1 text-sm text-gray-600">
                Share access to this organization by sending an invitation link.
              </p>
            </div>
            <span class="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-[#92400e]">
              Organization
            </span>
          </div>

          <form @submit.prevent="sendInvitation" class="mt-6 space-y-4">
            <div class="space-y-1">
              <label for="inviteEmail" class="text-sm font-medium text-gray-900">Email address</label>
              <input
                id="inviteEmail"
                v-model="inviteForm.email"
                type="email"
                placeholder="teammate@company.com"
                required
                class="h-11 w-full rounded-lg border border-[#D5D7DA] px-3 text-sm text-gray-900 placeholder-[#717680] focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
              />
            </div>

            <div class="space-y-1">
              <label for="inviteRole" class="text-sm font-medium text-gray-900">Role</label>
              <select
                id="inviteRole"
                v-model="inviteForm.role"
                class="h-11 w-full rounded-lg border border-[#D5D7DA] px-3 text-sm text-gray-900 focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
              >
                <option value="Admin">Admin</option>
                <option value="Member">Member</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            <div
              v-if="inviteMessage"
              class="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {{ inviteMessage }}
            </div>
            <div
              v-else-if="inviteError"
              class="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {{ inviteError }}
            </div>

            <button
              type="submit"
              :disabled="inviteSending"
              class="flex w-full items-center justify-center gap-2 rounded-lg bg-[#401903] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#2a1102] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span v-if="inviteSending">Sending...</span>
              <span v-else>Send invite</span>
            </button>

            <p class="text-xs text-gray-500">
              Recipients get an email to join this organization with the selected role.
            </p>
          </form>
        </aside> -->
      </div>
    </div>

  </main>

  <ProjectFormModal
    :open="showProjectModal"
    :mode="projectModalMode"
    :organizations="organizationOptions"
    :default-organization-id="organizationId || organizations[0]?.id"
    :error="projectStore.error"
    @close="closeProjectModal"
    @save="handleProjectSave"
  />
</template>

<style scoped>
article:hover {
  transform: translateY(-4px);
}
</style>
