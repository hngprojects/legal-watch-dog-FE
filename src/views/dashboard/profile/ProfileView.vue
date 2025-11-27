<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
import { Input } from '@/components/ui/input'
import { userService } from '@/api/user'
import { useAuthStore } from '@/stores/auth-store'
import { useOrganizationStore } from '@/stores/organization-store'
import type { Organization } from '@/types/organization'
import type { UserProfile } from '@/types/user'

const authStore = useAuthStore()
const organizationStore = useOrganizationStore()
const { organizations, loading: orgLoading, error: orgError } = storeToRefs(organizationStore)

const profileLoading = ref(true)
const profileError = ref<string | null>(null)
const userProfile = ref<UserProfile | null>(null)
const showEditModal = ref(false)

const editForm = ref({
  name: '',
  role: '',
  email: '',
})

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
    organizationStore.fetchOrganizations(userId)
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
  Swal.fire({
    icon: 'info',
    title: 'Profile editing unavailable',
    text: 'Profile updates are temporarily disabled. Please check back soon.',
    confirmButtonColor: '#401903',
  })
}

const closeEditModal = () => {
  showEditModal.value = false
}

const saveEdits = () => {
  Swal.fire({
    icon: 'info',
    title: 'Profile editing unavailable',
    text: 'Profile updates are temporarily disabled. Please check back soon.',
    confirmButtonColor: '#401903',
  })
  closeEditModal()
}
</script>

<template>
  <main class="min-h-screen flex-1 bg-[#F5F6F8] p-6 lg:p-10">
    <div class="mx-auto flex max-w-6xl flex-col gap-6">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-[#9CA3AF]">Profile</p>
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
        <button class="btn btn--link" @click="fetchProfile">
          Retry
        </button>
      </div>

      <template v-else>
        <section class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
          <div
            class="flex flex-col items-start justify-between gap-6 md:flex-row md:gap-10"
          >
            <div class="flex flex-col gap-6">
              <div
                class="flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-[#F1A75F] to-[#401903] text-2xl font-bold text-white shadow-md"
              >
                {{ avatarInitials }}
              </div>
              <div class="space-y-3">
                <div class="space-y-2">
                  <p class="text-2xl font-semibold text-[#0F172A]">{{ fullName }}</p>
                  <p class="text-sm text-[#6B7280]">{{ primaryRole }}</p>
                </div>
              </div>
            </div>
            <button
              type="button"
              class="btn btn--primary"
              @click="openEditModal"
            >
              Edit Profile
            </button>
          </div>
        </section>

        <section class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
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
        </section>

        <section class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
          <div class="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 class="text-lg font-semibold text-[#0F172A]">Organizations</h2>
              <p class="text-sm text-[#6B7280]">
                Organizations you belong to and your roles.
              </p>
            </div>
            <button
              type="button"
              class="btn btn--link"
              @click="authStore.user?.id && organizationStore.fetchOrganizations(authStore.user.id)"
            >
              Refresh
            </button>
          </div>

          <div v-if="orgLoading" class="grid gap-4">
            <div v-for="skeleton in 3" :key="skeleton" class="h-24 animate-pulse rounded-xl bg-gray-100" />
          </div>

          <div v-else-if="orgError" class="rounded-xl border border-red-100 bg-red-50 p-4">
            <p class="text-sm font-medium text-red-700">{{ orgError }}</p>
          </div>

          <div v-else-if="organizationList.length === 0" class="rounded-xl bg-gray-50 p-6 text-sm text-[#6B7280]">
            You have not joined any organizations yet.
          </div>

          <div v-else class="space-y-4">
            <article
              v-for="org in organizationList"
              :key="org.id"
              class="flex flex-col gap-3 rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="space-y-1">
                <p class="text-lg font-semibold text-[#0F172A]">{{ org.name }}</p>
                <p class="text-sm text-[#6B7280]">
                  {{ org.industry || 'No industry specified' }}
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
        <div class="w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl">
          <div class="mb-6">
            <h3 class="text-2xl font-semibold text-[#0F172A]">Edit Profile</h3>
            <p class="text-sm text-[#6B7280]">Update your profile details.</p>
          </div>

          <form class="space-y-5" @submit.prevent="saveEdits">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-[#0F172A]" for="name">Name</label>
              <Input
                id="name"
                v-model="editForm.name"
                placeholder="Your full name"
                class="h-12 rounded-xl border-[#E5E7EB] text-sm text-[#111827]"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-[#0F172A]" for="role">Role</label>
              <Input
                id="role"
                v-model="editForm.role"
                placeholder="Your role"
                class="h-12 rounded-xl border-[#E5E7EB] text-sm text-[#111827]"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-[#0F172A]" for="edit-email">Email Address</label>
              <Input
                id="edit-email"
                v-model="editForm.email"
                type="email"
                placeholder="you@example.com"
                class="h-12 rounded-xl border-[#E5E7EB] text-sm text-[#111827]"
              />
            </div>
            <div class="flex items-center justify-between gap-3 pt-4">
              <button
                type="button"
                class="rounded-full border border-[#401903] px-5 py-2 text-sm font-semibold text-[#401903] hover:bg-[#401903] hover:text-white"
                @click="closeEditModal"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="rounded-full bg-[#401903] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#2f1202]"
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
