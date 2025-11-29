<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
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

const authStore = useAuthStore()
const projectStore = useProjectStore()
const organizationStore = useOrganizationStore()
const { organizations, loading: orgLoading, error: orgError } = storeToRefs(organizationStore)
const { projects, loading: projectsLoading, error: projectError } = storeToRefs(projectStore)

const profileLoading = ref(true)
const profileError = ref<string | null>(null)
const userProfile = ref<UserProfile | null>(null)
const showEditModal = ref(false)

const editForm = ref({
  name: '',
  role: '',
  email: '',
})

// const fileInputRef = ref<HTMLInputElement | null>(null)
// const uploadingImage = ref(false)
const selectedImageFile = ref<string | null>(null)

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
  return (
    userProfile.value?.role ||
    organizations.value[0]?.user_role ||
    userProfile.value?.organizations?.[0]?.role ||
    'Member'
  )
})

const primaryOrg = computed(() => {
  return (
    organizations.value[0]?.name ||
    userProfile.value?.organizations?.[0]?.name ||
    'Member'
  )
})

const userEmail = computed(() => {
  return (
    userProfile.value?.email ||
    authStore.user?.email ||''
  )
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
  // Swal.fire({
  //   icon: 'info',
  //   title: 'Profile editing unavailable',
  //   text: 'Profile updates are temporarily disabled. Please check back soon.',
  //   confirmButtonColor: '#401903',
  // })
}

// const triggerFileInput = () => {
//   fileInputRef.value?.click()
// }

// const compressImage = (file: File): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader()
//     reader.readAsDataURL(file)
//     reader.onload = (event) => {
//       const img = new Image()
//       img.src = event.target?.result as string
//       img.onload = () => {
//         const canvas = document.createElement('canvas')
//         const ctx = canvas.getContext('2d')
//         if (!ctx) {
//           reject(new Error('Failed to get canvas context'))
//           return
//         }

//         // Calculate new dimensions (max 200x200 for profile picture)
//         let width = img.width
//         let height = img.height
//         const maxSize = 200

//         if (width > height) {
//           if (width > maxSize) {
//             height = (height * maxSize) / width
//             width = maxSize
//           }
//         } else {
//           if (height > maxSize) {
//             width = (width * maxSize) / height
//             height = maxSize
//           }
//         }

//         canvas.width = width
//         canvas.height = height

//         // Draw and compress
//         ctx.drawImage(img, 0, 0, width, height)
        
//         // Convert to base64 with compression (quality 0.6 for smaller size)
//         const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6)
//         resolve(compressedBase64)
//       }
//       img.onerror = () => reject(new Error('Failed to load image'))
//     }
//     reader.onerror = () => reject(new Error('Failed to read file'))
//   })
// }

// const handleImageUpload = async (event: Event) => {
//   const target = event.target as HTMLInputElement
//   const file = target.files?.[0]
  
//   if (!file) return

//   // Validate file type
//   const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
//   if (!validTypes.includes(file.type)) {
//     Swal.fire({
//       icon: 'error',
//       title: 'Invalid File Type',
//       text: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP).',
//       confirmButtonColor: '#401903',
//     })
//     return
//   }

//   // Validate file size (max 5MB)
//   const maxSize = 5 * 1024 * 1024 // 5MB
//   if (file.size > maxSize) {
//     Swal.fire({
//       icon: 'error',
//       title: 'File Too Large',
//       text: 'Image size must be less than 5MB.',
//       confirmButtonColor: '#401903',
//     })
//     return
//   }

//   try {
//     uploadingImage.value = true
    
//     // Compress the image
//     const compressedImage = await compressImage(file)
    
//     // Store compressed image
//     selectedImageFile.value = compressedImage
    
//     // Update local profile preview
//     if (userProfile.value) {
//       userProfile.value = {
//         ...userProfile.value,
//         avatar_url: compressedImage,
//       }
//     }

//     uploadingImage.value = false
//   } catch (error) {
//     console.error('Image upload error:', error)
//     Swal.fire({
//       icon: 'error',
//       title: 'Upload Failed',
//       text: 'Failed to process the image file. Please try again.',
//       confirmButtonColor: '#401903',
//     })
//     uploadingImage.value = false
//   }
// }

const closeEditModal = () => {
  showEditModal.value = false
}

const saveEdits = async () => {
  try {
    if (!editForm.value.name.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Name is required.',
        confirmButtonColor: '#401903',
      })
      return
    }
    console.log("first")

    const payload: UpdateProfilePayload = {
      name: editForm.value.name.trim(),
    }

    // Only include avatar if we have a new compressed image that's within limits
    // if (selectedImageFile.value && selectedImageFile.value.length <= 500) {
    //   payload.avatar_url = selectedImageFile.value
    // }

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

    // Clear selected image after save
    selectedImageFile.value = null

    Swal.fire({
      icon: 'success',
      title: 'Profile Updated',
      text: 'Your profile has been successfully updated.',
      confirmButtonColor: '#401903',
    })

    closeEditModal()
  } catch (error) {
    const err = error as { response?: { data?: { message?: string; error?: string; errors?: Record<string, string[]> } } }
    
    // Check specifically for avatar_url validation error
    const avatarError = err?.response?.data?.errors?.avatar_url
    if (avatarError) {
      // Silently retry without avatar_url
      try {
        const retryPayload: UpdateProfilePayload = {
          name: editForm.value.name.trim(),
        }
        
        const response = await userService.updateProfile(retryPayload)
        
        if (response.data?.data) {
          userProfile.value = {
            ...userProfile.value,
            ...response.data.data,
            // avatar_url: undefined, // Clear invalid avatar
          }

          if (authStore.user) {
            authStore.user = {
              ...authStore.user,
              name: response.data.data.name,
            }
          }
        }
        
        selectedImageFile.value = null
        
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your name has been updated successfully.',
          confirmButtonColor: '#401903',
        })
        
        closeEditModal()
        return
      } catch (retryError) {
        console.error('Retry failed:', retryError)
      }
    }
    
    const errorMessage = err?.response?.data?.message || err?.response?.data?.error || 'Failed to update profile. Please try again.'
    
    Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: errorMessage,
      confirmButtonColor: '#401903',
    })
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
        <section class="rounded-2xl border border-gray-100 bg-[#F5F5F5] p-5 shadow-sm h-[270px] flex items-center justify-center">
          <div class="flex flex-col items-center justify-center ">
            <div class="flex flex-col gap-6 items-center">
              <div
                class="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-[#F1A75F] to-[#401903] text-2xl font-bold text-white shadow-md relative"
              >
                <img v-if="userProfile?.avatar_url" :src="userProfile.avatar_url" alt="Profile" class="h-full w-full rounded-full object-cover" />
                <span v-else>{{ avatarInitials }}</span>
                <div class="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#401903] flex justify-center items-center cursor-pointer" @click="openEditModal">
                  <img :src="editIcon" alt="Edit Icon">
                </div>
              </div>
              <!-- <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImageUpload"
              /> -->
              <!-- <div class="space-y-3"> -->
                <div class="flex flex-col items-center gap-2">
                  <p class="text-3xl font-semibold text-[#1A0E04] capitalize">{{ fullName }}</p>
                  <p class="text-xl text-[#1F1F1F]">{{ primaryRole }} - {{ primaryOrg }}</p>
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

          <div v-else-if="orgError && projectError" class="rounded-xl border border-red-100 bg-red-50 p-4">
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
                  Projects available: <span class="text-black">{{ projects.filter(p => p.org_id === org.id).length }}</span>
                </p>
              </div>
              <div class="flex flex-col items-start gap-2 sm:items-end">
                <span
                  class="inline-flex items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#C35A11]"
                >
                  {{ org.user_role || 'Member' }}
                </span>
              </div>
            </article>
          </div>
        </section>
      </template>
    </div>

    <teleport to="body">
      <div
        v-if="showEditModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        @click.self="closeEditModal"
      >
        <div class="w-full max-w-xl rounded-2xl bg-white px-12 py-14 shadow-2xl">
          <div class="mb-14">
            <h3 class="text-2xl font-semibold text-[#0F172A]">Edit Profile</h3>
            <!-- <p class="text-sm text-[#6B7280]">Update your profile details.</p> -->
          </div>

          <div class="flex justify-center mb-6">
             <div
                class="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-[#F1A75F] to-[#401903] text-2xl font-bold text-white shadow-md relative"
              >
                {{ avatarInitials }}
                <div class="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#401903] flex justify-center items-center cursor-pointer" 
                >
                <!-- @click="saveEdits" -->
                <img :src="editIcon" alt="Edit Icon">
              </div>
              </div>
          </div>

          <form class="space-y-5" @submit.prevent="saveEdits">
            <div class="space-y-3">
              <label class="text-sm font-semibold text-[#0F172A]" for="name">Name</label>
              <Input
                id="name"
                v-model="editForm.name"
                placeholder="Your full name"
                class="h-12 rounded-md border-[#E5E7EB] text-sm text-[#111827] mt-1.5"
              />
            </div>
            <div class="space-y-3">
              <label class="text-sm font-semibold text-[#0F172A]" for="role">Role</label>
              <Select v-model="editForm.role" required>
                  <SelectTrigger class="h-12 border-[#D5D7DA] rounded-md text-sm focus:border-[#401903] w-full">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <!-- <SelectItem value="Member">Member</SelectItem> -->
                    <!-- <SelectItem value="Viewer">Viewer</SelectItem> -->
                    <!-- <SelectItem value="Editor">Editor</SelectItem> -->
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
                class="h-12 rounded-md outline-none focus-visible:ring-0 focus-visible:border-input text-sm text-[#111827] mt-1.5 cursor-not-allowed"
              />
            </div>
            <div class="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                class="cursor-pointer rounded-md border border-[#401903] py-4 px-12 text-sm font-semibold text-[#401903] hover:bg-[#401903] hover:text-white"
                @click="closeEditModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="cursor-pointer rounded-md bg-[#401903] py-4 px-12 text-sm font-semibold text-white shadow-sm hover:bg-[#2f1202]"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </teleport>
  </main>
</template>
