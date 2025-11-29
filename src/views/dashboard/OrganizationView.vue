<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'
import { EllipsisVertical } from 'lucide-vue-next'
import { useOrganizationStore } from '@/stores/organization-store'
import { useAuthStore } from '@/stores/auth-store'
import { useInvitationStore } from '@/stores/invitation-store'
import illustrationImg from '@/assets/Images/dashboardillustration.png'
import type { Organization } from '@/types/organization'

const organizationStore = useOrganizationStore()
const { organizations, loading, error } = storeToRefs(organizationStore)
const invitationStore = useInvitationStore()
const { invitations, loading: inviteLoading, error: inviteError } = storeToRefs(invitationStore)
const router = useRouter()
const authStore = useAuthStore()

const showCreateModal = ref(false)
const formData = ref({
  name: '',
  industry: '',
})
// inviteOrgNames kept for potential future use but not populated here
// const inviteOrgNames = ref<Record<string, string>>({})

const ensureUserId = async () => {
  if (authStore.user?.id) return authStore.user.id
  const loadedUser = await authStore.loadCurrentUser()
  return loadedUser?.id
}

const organizationName = () => 'Organization Invitation'

const openCreateModal = () => {
  showCreateModal.value = true
  formData.value = { name: '', industry: '' }
  organizationStore.setError(null)
}

const closeCreateModal = () => {
  showCreateModal.value = false
  formData.value = { name: '', industry: '' }
  organizationStore.setError(null)
}

const handleCreateOrganization = async () => {
  organizationStore.setError(null)

  if (!formData.value.name.trim())
    return organizationStore.setError('Organization name is required')
  if (!formData.value.industry.trim()) return organizationStore.setError('Industry is required')

  const created = await organizationStore.addOrganization({
    name: formData.value.name.trim(),
    industry: formData.value.industry.trim(),
  })

  if (created) {
    const userId = await ensureUserId()
    if (userId) {
      organizationStore.fetchOrganizations(userId)
    }
    closeCreateModal()
    await Swal.fire(
      'Organization created',
      'You can now add projects under this organization.',
      'success',
    )
  }
}

const goToOrganization = (organizationId: string) => {
  router.push({ name: 'organization-profile', params: { organizationId } })
}

const refreshInvitations = async () => {
  await invitationStore.fetchMyInvitations()
}

const acceptInvite = async (token: string) => {
  try {
    const result = await invitationStore.acceptInvitation(token)
    await Swal.fire('Invitation Accepted', result, 'success')
    const userId = await ensureUserId()
    if (userId) {
      await organizationStore.fetchOrganizations(userId)
    }
    await refreshInvitations()
  } catch (err) {
    void err
    await Swal.fire('Could not accept invitation', invitationStore.error || 'Something went wrong', 'error')
  }
}

const hasMoreOrganizations = computed(() => organizationStore.hasMoreOrganizations)

const loadMoreOrganizations = async () => {
  const userId = await ensureUserId()
  if (!userId) {
    organizationStore.setError('User information missing. Please re-login.')
    return
  }
  await organizationStore.fetchMoreOrganizations(userId)
}

const openEditOrganization = async (org: Organization) => {
  const { value: formValues, isConfirmed } = await Swal.fire({
    title: 'Edit organization',
    html: `
      <div class="text-left space-y-2">
        <label for="swal-org-name" class="text-sm font-semibold text-gray-700">Name</label>
        <input id="swal-org-name" class="swal2-input" placeholder="Organization name" value="${org.name ?? ''}" />
        <label for="swal-org-industry" class="text-sm font-semibold text-gray-700 mt-2">Industry</label>
        <input id="swal-org-industry" class="swal2-input" placeholder="Industry" value="${org.industry ?? ''}" />
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Save',
    preConfirm: () => {
      const nameInput = (document.getElementById('swal-org-name') as HTMLInputElement | null)?.value.trim() || ''
      const industryInput =
        (document.getElementById('swal-org-industry') as HTMLInputElement | null)?.value.trim() ||
        ''
      if (!nameInput) {
        Swal.showValidationMessage('Organization name is required')
        return false
      }
      if (!industryInput) {
        Swal.showValidationMessage('Industry is required')
        return false
      }
      return { name: nameInput, industry: industryInput }
    },
  })

  if (!isConfirmed || !formValues) return
  const updated = await organizationStore.updateOrganization(org.id, {
    name: formValues.name,
    industry: formValues.industry,
  })
  if (updated) {
    await Swal.fire('Updated', 'Organization updated successfully.', 'success')
  } else if (organizationStore.error) {
    await Swal.fire('Could not update', organizationStore.error, 'error')
  }
}

const confirmDeleteOrganization = async (org: Organization) => {
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
  const deleted = await organizationStore.deleteOrganization(org.id)
  if (deleted) {
    await Swal.fire('Deleted', 'Organization removed successfully.', 'success')
  } else if (organizationStore.error) {
    await Swal.fire('Could not delete', organizationStore.error, 'error')
  }
}

onMounted(async () => {
  const userId = await ensureUserId()
  if (!userId) {
    organizationStore.setError('User information missing. Please re-login.')
    return
  }
  await organizationStore.fetchOrganizations(userId)
  await refreshInvitations()
})
</script>

<template>
  <main class="min-h-screen flex-1 bg-gray-50 ">
    <div
      v-if="!loading && organizations.length === 0 && !error"
      class="mx-auto max-w-4xl py-16 text-center lg:py-24 flex flex-col items-center justify-center"
    >
    <img :src="illustrationImg" alt="" srcset="">
      <h1 class="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">No Organization Yet</h1>
      <p class="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-gray-600">
        Create an organization to start grouping projects and jurisdictions.<br
          class="hidden sm:block"
        />
        Projects and jurisdictions are scoped within organizations.
      </p>
      <button @click="openCreateModal" class="btn--primary btn--with-icon">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 4V16"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M4 10H16"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Create Organization
      </button>
    </div>

    <div v-else class="mx-auto max-w-7xl">
      <div
        class="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"
      >
        <div>
          <!-- <p class="text-sm tracking-wide text-[#9CA3AF] uppercase">Organization Workspace</p> -->
          <h1 class="text-3xl font-bold text-gray-900 lg:text-4xl">My Organizations</h1>
          <!-- <p class="mt-1 text-sm text-gray-600">
            Manage your organizations and dive into their projects.
          </p> -->
        </div>
        <button @click="openCreateModal" class="btn--primary btn--with-icon">
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
          Create Organization
        </button>
      </div>

      <div class="mb-8 hidden">
        <div class="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/60">
          <div class="mb-4 flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Invitations</p>
              <p class="text-sm text-gray-600">Organizations you have been invited to join.</p>
            </div>
            <button
              @click="refreshInvitations"
              class="btn--link"
            >
              Refresh
            </button>
          </div>

          <div v-if="inviteLoading" class="space-y-3">
            <div v-for="n in 3" :key="n" class="h-12 animate-pulse rounded-lg bg-gray-100"></div>
          </div>
          <div v-else-if="inviteError" class="text-sm text-red-600">
            {{ inviteError }}
          </div>
          <div v-else-if="!invitations.length" class="text-sm text-gray-600">
            No pending invitations.
          </div>
          <div v-else class="space-y-3">
            <article
              v-for="invite in invitations"
              :key="invite.token"
              class="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
            >
              <div>
                <p class="text-sm font-semibold text-gray-900">
                  {{ invite.organization_name || organizationName() }}
                </p>
                <p class="text-xs text-gray-500">Role: {{ invite.role_name || invite.role || 'Member' }}</p>
              </div>
              <button
                @click="acceptInvite(invite.token)"
                class="btn--primary"
              >
                Accept
              </button>
            </article>
          </div>
        </div>
      </div>

      <div v-if="loading" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="n in 6" :key="n" class="animate-pulse rounded-2xl bg-white p-8 shadow-sm">
          <div class="mb-4 h-6 w-3/4 rounded bg-gray-200"></div>
          <div class="space-y-2">
            <div class="h-4 w-full rounded bg-gray-200"></div>
            <div class="h-4 w-5/6 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>


      <div v-else-if="error" class="py-12 text-center">
        <p class="text-red-600">{{ error }}</p>
        <button
          @click="authStore.user?.id && organizationStore.fetchOrganizations(authStore.user.id)"
          class="mt-4 text-[#401903] underline"
        >
          Retry
        </button>
      </div>
      <!-- Card -->
      <div v-else class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="org in organizations"
          :key="org.id"
           @click="goToOrganization(org.id)"
          class="group flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-300 hover:shadow-lg hover:ring-[#401903]/10 cursor-pointer"
        >
          <div class="relative p-8">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <button
                  @click.stop
                  class="absolute right-4 top-4 rounded-full p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
                >
                  <EllipsisVertical :size="18" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click.stop="openEditOrganization(org)">
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem class="text-red-600" @click.stop="confirmDeleteOrganization(org)">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <!-- <p class="text-xs font-semibold tracking-wide text-[#9CA3AF] uppercase">Organization</p> -->
            <h3
              class="mb-2 text-xl font-bold text-[#1F1F1F] transition-colors group-hover:text-[#401903]"
            >
              {{ org.name }}
            </h3>
            <p class="text-sm text-[#4B5563]">{{ org.industry || 'Industry not specified' }}</p>
            <p class="text-sm text-[#4B5563] mt-6">Projects available: <span class="text-black">
              {{ 0 }}</span></p>
          </div>
          <div
            class="hidden items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4"
          >
            <button
              @click="goToOrganization(org.id)"
              class="btn btn--primary flex items-center gap-1"
            >
              View Organization
              <svg
                class="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M9 18l6-6-6-6"></path>
              </svg>
            </button>
          </div>
        </article>
      </div>

      <div v-if="hasMoreOrganizations" class="mt-8 flex justify-center">
        <button
          @click="loadMoreOrganizations"
          class="btn--primary"
          :disabled="organizationStore.loadingMore"
        >
          <span v-if="organizationStore.loadingMore">Loading...</span>
          <span v-else>Load more</span>
        </button>
      </div>
    </div>

    <teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
        @click.self="closeCreateModal"
      >
        <div class="relative w-full max-w-[540px] rounded-2xl bg-white shadow-xl">
          <div class="p-20">
            <div class="mb-6">
              <h3 class="mb-2 text-xl font-bold text-[#080808]">Set up new Organization</h3>
              <p class="text-sm text-[#6B7280]">
                <template v-if="formData.name">
                  Organisation already registered? <span @click="router.push('/login')" class="text-[#401903] cursor-pointer underline hover:no-underline transition-all">Log In</span>
                </template>
                <template v-else>
                  Enter the name and Industry of your Organization.
                </template>
              </p>
            </div>

            <form @submit.prevent="handleCreateOrganization" class="space-y-5">
              <div class="space-y-2">
                <label for="orgName" class="block text-sm font-medium text-[#1F1F1F]">
                  Company Name
                </label>
                <Input
                  v-model="formData.name"
                  id="orgName"
                  placeholder="Name"
                  required
                  class="h-11 border-[#D5D7DA] text-sm focus:border-[#401903] rounded-md w-full"
                />
              </div>

              <div class="space-y-2">
                <label for="orgIndustry" class="block text-sm font-medium text-[#1F1F1F]">
                  Industry
                </label>
                <Select v-model="formData.industry" required>
                  <SelectTrigger class="h-11! border-[#D5D7DA] rounded-md text-sm focus:border-[#401903] w-full">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Government, Politics & Public Sector">Government, Politics & Public Sector</SelectItem>
                    <SelectItem value="Law, Regulation & Compliance">Law, Regulation & Compliance</SelectItem>
                    <SelectItem value="Business, Finance & Professional Services">Business, Finance & Professional Services</SelectItem>
                    <SelectItem value="Technology, Media & Telecommunications">Technology, Media & Telecommunications</SelectItem>
                    <SelectItem value="Health, Science & Education">Health, Science & Education</SelectItem>
                    <SelectItem value="Energy, Environment & Infrastructure">Energy, Environment & Infrastructure</SelectItem>
                    <SelectItem value="Manufacturing, Trade & Logistics">Manufacturing, Trade & Logistics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div v-if="error" class="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {{ error }}
              </div>

              <div class="flex flex-col justify-center gap-3 pt-8">
                <button type="submit" class="btn btn--primary py-2.5 min-h-10">Continue</button>
                <button
                  type="button"
                  @click="closeCreateModal"
                  class="rounded-lg border border-transparent hover:border-[#F1A75F] py-2.5 text-sm font-medium text-black hover:bg-orange-50 min-h-10 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>
  </main>
</template>
