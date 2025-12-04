<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Swal from '@/lib/swal'
import type { SweetAlertOptions } from 'sweetalert2'
import { Input } from '@/components/ui/input'
import { userService, type UpdateProfilePayload } from '@/api/user'
import { useAuthStore } from '@/stores/auth-store'
import { useProjectStore } from '@/stores/project-store'
import { useOrganizationStore } from '@/stores/organization-store'
import type { Organization } from '@/types/organization'
import type { UserProfile } from '@/types/user'
import editIcon from '@/assets/icons/editIcon.svg'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
} from '@/components/ui/dialog'

const authStore = useAuthStore()
const projectStore = useProjectStore()
const organizationStore = useOrganizationStore()
const { organizations, loading: orgLoading, error: orgError } = storeToRefs(organizationStore)
const { projects, loading: projectsLoading, error: projectError } = storeToRefs(projectStore)

const profileLoading = ref(true)
const profileError = ref<string | null>(null)
const userProfile = ref<UserProfile | null>(null)
const showEditModal = ref(false)

const showSwal = async (options: SweetAlertOptions) => {
  const shouldReopenModal = showEditModal.value
  if (shouldReopenModal) showEditModal.value = false
  const result = await Swal.fire(options)
  if (shouldReopenModal) showEditModal.value = true
  return result
}

const editForm = ref({
  name: '',
  role: '',
  email: '',
})

const fileInputRef = ref<HTMLInputElement | null>(null)
const uploadingImage = ref(false)
const isSaving = ref(false)

const normalizeRoleLabel = (role?: string) => {
  const normalized = role?.toString().trim().toLowerCase()
  switch (normalized) {
    case 'owner':
      return 'Owner'
    case 'admin':
      return 'Admin'
    case 'manager':
      return 'Manager'
    case 'member':
      return 'Member'
    default:
      return 'Member'
  }
}

const fallbackNameFromEmail = computed(() => {
  const email = userProfile.value?.email || ''
  if (!email) return ''
  const handle = email.split('@')[0] || ''
  if (!handle) return ''
  const spaced = handle.replace(/[._]/g, ' ').trim()
  return spaced
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ')
})

const fullName = computed(() => {
  if (userProfile.value?.name) return userProfile.value.name
  const first = userProfile.value?.first_name ?? ''
  const last = userProfile.value?.last_name ?? ''
  const name = [first, last].filter(Boolean).join(' ').trim()
  return name || fallbackNameFromEmail.value || 'User'
})

const primaryRole = computed(() => {
  return normalizeRoleLabel(
    userProfile.value?.role ||
      organizations.value[0]?.user_role ||
      userProfile.value?.organizations?.[0]?.role ||
      'Member',
  )
})

const primaryOrg = computed(() => {
  return organizations.value[0]?.name || userProfile.value?.organizations?.[0]?.name || 'Member'
})

const userEmail = computed(() => {
  return userProfile.value?.email || authStore.user?.email || ''
})

const loadAllProjects = async () => {
  if (organizations.value.length === 0) return

  // Fetch projects for all organizations
  for (const org of organizations.value) {
    try {
      await projectStore.fetchProjects(org.id)
    } catch (error) {
      console.error(`Failed to load projects for organization ${org.name}:`, error)
    }
  }
}

const avatarInitials = computed(() => {
  const name = fullName.value.trim()
  if (!name) return 'U'
  const parts = name.split(' ')
  const [first, second] = [parts[0], parts[1]]
  const initials = `${first?.[0] ?? ''}${second?.[0] ?? ''}`.trim()
  return initials || first?.[0]?.toUpperCase() || 'U'
})

const organizationList = computed<Organization[]>(() => {
  if (organizations.value.length) return organizations.value
  const profileOrgs = userProfile.value?.organizations
  if (!profileOrgs) return []
  return profileOrgs.map((org) => ({
    id: org.organization_id,
    name: org.name,
    industry: org.industry,
    user_role: org.role,
    is_active: org.is_active,
  }))
})

const fetchProfile = async () => {
  profileLoading.value = true
  profileError.value = null
  try {
    const response = await userService.getCurrentUser()
    const payload = response.data?.data
    const apiUser =
      (payload && typeof payload === 'object' && 'user' in payload
        ? (payload as { user?: UserProfile }).user
        : (payload as UserProfile | undefined)) ?? null

    if (!apiUser) {
      profileError.value = 'Unable to load profile right now.'
      return
    }

    userProfile.value = {
      ...apiUser,
      avatar_url:
        apiUser.avatar_url || (apiUser as { profile_picture_url?: string }).profile_picture_url,
      // fallbacks for readable display when name fields are missing
      name: apiUser.name || apiUser.first_name || fallbackNameFromEmail.value || 'User',
    }

    if (apiUser.id) {
      authStore.user = {
        ...(authStore.user ?? {}),
        id: apiUser.id,
        name: apiUser.name,
        first_name: apiUser.first_name,
        last_name: apiUser.last_name,
        email: apiUser.email,
        role: apiUser.role,
        avatar_url:
          apiUser.avatar_url || (apiUser as { profile_picture_url?: string }).profile_picture_url,
      }
    }
  } catch (error) {
    const err = error as { response?: { data?: { message?: string } } }
    profileError.value = err.response?.data?.message || 'Failed to fetch profile.'
  } finally {
    profileLoading.value = false
  }
}

const ensureUserId = async () => {
  if (authStore.user?.id) return authStore.user.id
  const loaded = await authStore.loadCurrentUser()
  return loaded?.id
}

onMounted(async () => {
  await fetchProfile()
  const userId = await ensureUserId()
  if (userId) {
    await organizationStore.fetchOrganizations(userId)
    await loadAllProjects()
  }
})

watch(
  userProfile,
  (profile) => {
    if (!profile) return
    const name =
      profile.name ||
      [profile.first_name, profile.last_name].filter(Boolean).join(' ').trim() ||
      fallbackNameFromEmail.value ||
      ''
    editForm.value = {
      name,
      role: profile.role || organizations.value[0]?.user_role || '',
      email: profile.email || '',
    }
  },
  { immediate: true },
)

const openEditModal = () => {
  showEditModal.value = true
}

const triggerFileInput = () => {
  if (uploadingImage.value) return
  fileInputRef.value?.click()
}

const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    await showSwal({
      icon: 'error',
      title: 'Invalid File Type',
      text: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP).',
      confirmButtonColor: '#401903',
    })
    return
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    await showSwal({
      icon: 'error',
      title: 'File Too Large',
      text: 'Image size must be less than 5MB.',
      confirmButtonColor: '#401903',
    })
    return
  }

  try {
    uploadingImage.value = true

    // Upload image to server
    const response = await userService.uploadProfilePicture(file)

    // Get the uploaded image URL
    const uploadedUrl = response.data?.data?.profile_picture_url

    if (uploadedUrl && userProfile.value) {
      // Update local profile preview
      userProfile.value = {
        ...userProfile.value,
        avatar_url: uploadedUrl,
      }

      // Update auth store
      if (authStore.user) {
        authStore.user = {
          ...authStore.user,
          avatar_url: uploadedUrl,
        }
      }

      await showSwal({
        icon: 'success',
        title: 'Profile Picture Updated',
        text: 'Your profile picture has been successfully uploaded.',
        confirmButtonColor: '#401903',
      })
    }
  } catch (error) {
    console.error('Image upload error:', error)
    const err = error as { response?: { data?: { message?: string; error?: string } } }
    const errorMessage =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      'Failed to upload profile picture. Please try again.'

    await showSwal({
      icon: 'error',
      title: 'Upload Failed',
      text: errorMessage,
      confirmButtonColor: '#401903',
    })
  } finally {
    uploadingImage.value = false
    // Reset file input
    if (target) target.value = ''
  }
}

const closeEditModal = () => {
  showEditModal.value = false
}

const saveEdits = async () => {
  try {
    if (!editForm.value.name.trim()) {
      await showSwal({
        icon: 'error',
        title: 'Validation Error',
        text: 'Name is required.',
        confirmButtonColor: '#401903',
      })
      return
    }

    isSaving.value = true

    const payload: UpdateProfilePayload = {
      name: editForm.value.name.trim(),
    }

    const response = await userService.updateProfile(payload)

    // console.log(response)

    if (response.data?.data) {
      userProfile.value = {
        ...userProfile.value,
        ...response.data.data,
      }

      if (authStore.user) {
        authStore.user = {
          ...authStore.user,
          name: response.data.data.name,
        }
      }
    }

    await showSwal({
      icon: 'success',
      title: 'Profile Updated',
      text: 'Your profile has been successfully updated.',
      confirmButtonColor: '#401903',
    })

    closeEditModal()
  } catch (error) {
    const err = error as {
      response?: { data?: { message?: string; error?: string; errors?: Record<string, string[]> } }
    }

    const errorMessage =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      'Failed to update profile. Please try again.'

    await showSwal({
      icon: 'error',
      title: 'Update Failed',
      text: errorMessage,
      confirmButtonColor: '#401903',
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <main class="min-h-screen flex-1 bg-[#F5F6F8] p-6 lg:p-10">
    <div class="mx-auto flex max-w-6xl flex-col gap-6">
      <div class="flex items-start justify-between">
        <div>
          <!-- <p class="text-sm font-semibold tracking-wide text-[#9CA3AF] uppercase">Profile</p> -->
          <h1 class="text-3xl font-bold text-[#0F172A]">Profile Information</h1>
        </div>
      </div>

      <div
        v-if="profileLoading"
        class="grid gap-6"
        style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))"
      >
        <div class="h-[220px] animate-pulse rounded-2xl bg-white shadow-sm"></div>
        <div class="h-[220px] animate-pulse rounded-2xl bg-white shadow-sm"></div>
      </div>

      <div v-else-if="profileError" class="rounded-2xl border border-red-100 bg-red-50 p-6">
        <p class="text-sm font-medium text-red-700">{{ profileError }}</p>
        <button class="btn btn--link" @click="fetchProfile">Retry</button>
      </div>

      <template v-else>
        <section
          class="flex h-[270px] items-center justify-center rounded-2xl border border-gray-100 bg-[#F5F5F5] p-5 shadow-sm"
        >
          <div class="flex flex-col items-center justify-center">
            <div class="flex flex-col items-center gap-6">
              <div
                class="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-[#F1A75F] to-[#401903] text-2xl font-bold text-white shadow-md"
              >
                <img
                  v-if="userProfile?.avatar_url"
                  :src="userProfile.avatar_url"
                  alt="Profile"
                  class="h-full w-full rounded-full object-cover"
                />
                <span v-else>{{ avatarInitials }}</span>
                <div
                  class="absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#401903]"
                  @click="openEditModal"
                >
                  <img :src="editIcon" alt="Edit Icon" />
                </div>
              </div>
              <!-- <div class="space-y-3"> -->
              <div class="flex flex-col items-center gap-2">
                <p class="text-3xl font-semibold text-[#1A0E04] capitalize">{{ fullName }}</p>
                <p v-if="!(primaryRole === 'Member' && primaryOrg === 'Member')" class="text-xl text-[#1F1F1F]">{{ primaryRole }} - {{ primaryOrg }}</p>
                <p class="text-lg text-[#6B7280]">{{ userEmail }}</p>
              </div>
              <!-- </div> -->
            </div>
          </div>
        </section>

        <!-- <section class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-[#0F172A]">Contact Information</h2>
              <p class="text-sm text-[#6B7280]">Keep your contact details up to date.</p>
            </div>
            <span
              v-if="userProfile?.is_verified"
              class="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"
            >
              Email Verified
            </span>
          </div>
          <div class="space-y-5">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-[#0F172A]" for="email">Email Address</label>
              <Input
                id="email"
                :model-value="userProfile?.email || ''"
                readonly
                class="h-12 rounded-xl border-[#E5E7EB] bg-[#F8FAFC] text-sm text-[#111827] shadow-none"
              />
            </div>
          </div>
        </section> -->

        <section class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
          <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-lg font-semibold text-[#0F172A]">Organizations</h2>
              <!-- <p class="text-sm text-[#6B7280]">Organizations you belong to and your roles.</p> -->
            </div>
            <!-- <button
              type="button"
              class="btn btn--link"
              @click="authStore.user?.id && organizationStore.fetchOrganizations(authStore.user.id)"
            >
              Refresh
            </button> -->
          </div>

          <div v-if="orgLoading && projectsLoading" class="grid gap-4">
            <div
              v-for="skeleton in 3"
              :key="skeleton"
              class="h-24 animate-pulse rounded-xl bg-gray-100"
            />
          </div>

          <div
            v-else-if="orgError && projectError"
            class="rounded-xl border border-red-100 bg-red-50 p-4"
          >
            <p class="text-sm font-medium text-red-700">{{ orgError }}</p>
          </div>

          <div
            v-else-if="organizationList.length === 0"
            class="rounded-xl bg-gray-50 p-6 text-sm text-[#6B7280]"
          >
            You have not joined any organizations yet.
          </div>

          <div v-else class="space-y-4">
            <article
              v-for="org in organizationList"
              :key="org.id"
              class="flex flex-col gap-3 rounded-xl border border-[#EDEDED] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="space-y-1">
                <p class="text-lg font-semibold text-[#0F172A]">{{ org.name }}</p>
                <p class="text-sm text-[#6B7280]">
                  {{ org.industry || 'No industry specified' }}
                </p>
                <p class="text-sm text-[#6B7280]">
                  Projects available:
                  <span class="text-black">{{
                    projects.filter((p) => p.org_id === org.id).length
                  }}</span>
                </p>
              </div>
              <div class="flex flex-col items-start gap-2 sm:items-end">
                <span
                  class="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#C35A11]"
                >
                  {{ normalizeRoleLabel(org.user_role) }}
                </span>
              </div>
            </article>
          </div>
        </section>
      </template>
    </div>

    <Dialog :open="showEditModal" @update:open="(value) => !value && closeEditModal()">
      <DialogScrollContent class="sm:max-w-xl">
        <DialogHeader class="mb-6">
          <DialogTitle class="text-2xl font-semibold text-[#0F172A]">Edit Profile</DialogTitle>
          <DialogDescription class="hidden">Update your profile details.</DialogDescription>
        </DialogHeader>

        <div class="mb-6 flex justify-center">
          <div
            class="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-[#F1A75F] to-[#401903] text-2xl font-bold text-white shadow-md"
          >
            <img
              v-if="userProfile?.avatar_url"
              :src="userProfile.avatar_url"
              alt="Profile"
              class="h-full w-full rounded-full object-cover"
            />
            <span v-else>{{ avatarInitials }}</span>
            <div
              class="absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#401903]"
              :class="{ 'cursor-not-allowed opacity-50': uploadingImage }"
              @click="triggerFileInput"
            >
              <svg
                v-if="uploadingImage"
                class="h-4 w-4 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <img v-else :src="editIcon" alt="Edit Icon" />
            </div>
          </div>
        </div>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleImageUpload"
        />

        <form class="space-y-5" @submit.prevent="saveEdits">
          <div class="space-y-3">
            <label class="text-sm font-semibold text-[#0F172A]" for="name">Name</label>
            <Input
              id="name"
              v-model="editForm.name"
              placeholder="Your full name"
              class="mt-1.5 h-12 rounded-md border-[#E5E7EB] text-sm text-[#111827]"
            />
          </div>
          <div class="space-y-3">
            <label class="text-sm font-semibold text-[#0F172A]" for="role">Role</label>
            <Select :model-value="primaryRole" disabled>
              <SelectTrigger
                class="h-12 w-full cursor-not-allowed rounded-md border-[#D5D7DA] text-sm focus:border-[#401903]"
              >
                <SelectValue :placeholder="primaryRole" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem :value="primaryRole">{{ primaryRole }}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-3">
            <label class="text-sm font-semibold text-[#0F172A]" for="edit-email"
              >Email Address</label
            >
            <Input
              id="edit-email"
              v-model="editForm.email"
              type="email"
              readonly
              placeholder="you@example.com"
              class="border-input focus-visible:border-input mt-1.5 h-12 cursor-not-allowed rounded-md text-sm text-[#111827] outline-none focus-visible:ring-0"
            />
          </div>
          <DialogFooter class="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              class="cursor-pointer rounded-md border border-[#401903] px-12 py-4 text-sm font-semibold text-[#401903] hover:bg-[#401903] hover:text-white"
              @click="closeEditModal"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="cursor-pointer rounded-md bg-[#401903] px-12 py-4 text-sm font-semibold text-white shadow-sm hover:bg-[#2f1202]"
              :disabled="isSaving"
            >
              <span v-if="isSaving">Saving...</span>
              <span v-else>Save</span>
            </button>
          </DialogFooter>
        </form>
      </DialogScrollContent>
    </Dialog>
  </main>
</template>
