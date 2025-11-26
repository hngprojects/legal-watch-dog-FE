<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useOrganizationStore } from '@/stores/organization-store'
import { useAuthStore } from '@/stores/auth-store'

const organizationStore = useOrganizationStore()
const { organizations, loading, error } = storeToRefs(organizationStore)
const router = useRouter()
const authStore = useAuthStore()

const showCreateModal = ref(false)
const formData = ref({
  name: '',
  industry: '',
})

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

  if (!formData.value.name.trim()) return organizationStore.setError('Organization name is required')
  if (!formData.value.industry.trim()) return organizationStore.setError('Industry is required')

  const created = await organizationStore.addOrganization({
    name: formData.value.name.trim(),
    industry: formData.value.industry.trim(),
  })

  if (created) {
    closeCreateModal()
    await Swal.fire('Organization created', 'You can now add projects under this organization.', 'success')
  }
}

const goToProjects = (organizationId: string) => {
  router.push({ name: 'projects', query: { organizationId } })
}

onMounted(async () => {
  let userId = authStore.user?.id
  if (!userId) {
    const loadedUser = await authStore.loadCurrentUser()
    userId = loadedUser?.id
  }
  if (!userId) {
    organizationStore.setError('User information missing. Please re-login.')
    return
  }
  organizationStore.fetchOrganizations(userId)
})
</script>

<template>
  <main class="min-h-screen flex-1 bg-gray-50 p-6 lg:p-10">
    <div
      v-if="!loading && organizations.length === 0 && !error"
      class="mx-auto max-w-4xl py-16 text-center lg:py-24"
    >
      <h1 class="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">No Organization Yet</h1>
      <p class="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-gray-600">
        Create an organization to start grouping projects and jurisdictions.<br class="hidden sm:block" />
        Projects and jurisdictions are scoped within organizations.
      </p>
      <button
        @click="openCreateModal"
        class="inline-flex items-center gap-3 rounded-xl bg-[#401903] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-[#592304] hover:shadow-xl"
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
      <div class="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p class="text-sm uppercase tracking-wide text-[#9CA3AF]">Organization Workspace</p>
          <h1 class="text-3xl font-bold text-gray-900 lg:text-4xl">Organizations</h1>
          <p class="mt-1 text-sm text-gray-600">
            Manage your organizations and dive into their projects.
          </p>
        </div>
        <button
          @click="openCreateModal"
          class="flex items-center gap-3 rounded-full bg-[#401903] px-8 py-4 font-medium text-white shadow-md transition-all hover:bg-[#592304] hover:shadow-lg"
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
          Create Organization
        </button>
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

      <div v-else class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="org in organizations"
          :key="org.id"
          class="group flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-300 hover:shadow-lg hover:ring-[#401903]/10"
        >
          <div class="p-8">
            <p class="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Organization</p>
            <h3 class="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-[#401903]">
              {{ org.name }}
            </h3>
            <p class="text-sm text-gray-600">{{ org.industry || 'Industry not specified' }}</p>
          </div>
          <div class="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4">
            <div class="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
              Projects are scoped within this organization
            </div>
            <button
              @click="goToProjects(org.id)"
              class="inline-flex items-center gap-2 rounded-full bg-[#401903] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#2a1102]"
            >
              View Projects
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18l6-6-6-6"></path>
              </svg>
            </button>
          </div>
        </article>
      </div>
    </div>

    <teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
        @click.self="closeCreateModal"
      >
        <div class="relative w-full max-w-[540px] rounded-2xl bg-white shadow-xl">
          <button
            @click="closeCreateModal"
            class="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div class="p-8">
            <div class="mb-6">
              <h3 class="mb-2 text-xl font-bold text-[#080808]">Create Organization</h3>
              <p class="text-sm text-[#6B7280]">Organizations hold projects and jurisdictions.</p>
            </div>

            <form @submit.prevent="handleCreateOrganization" class="space-y-5">
              <div class="relative">
                <input
                  v-model="formData.name"
                  id="orgName"
                  placeholder="e.g. Acme Corporation"
                  required
                  class="peer h-[52px] w-full rounded-lg border border-[#D5D7DA] px-4 pt-5 pb-3 text-sm text-gray-900 placeholder-[#717680] focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                />
                <label
                  for="orgName"
                  class="pointer-events-none absolute top-2.5 left-3 origin-left -translate-y-6 scale-75 transform bg-white px-1 text-xs font-medium text-[#1F1F1F] transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-[#717680] peer-focus:top-2.5 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#401903]"
                >
                  Organization Name
                </label>
              </div>

              <div class="relative">
                <input
                  v-model="formData.industry"
                  id="orgIndustry"
                  placeholder="e.g. Technology"
                  required
                  class="peer h-[52px] w-full rounded-lg border border-[#D5D7DA] px-4 pt-5 pb-3 text-sm text-gray-900 placeholder-[#717680] focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                />
                <label
                  for="orgIndustry"
                  class="pointer-events-none absolute top-2.5 left-3 origin-left -translate-y-6 scale-75 transform bg-white px-1 text-xs font-medium text-[#1F1F1F] transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-[#717680] peer-focus:top-2.5 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#401903]"
                >
                  Industry
                </label>
              </div>

              <div v-if="error" class="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {{ error }}
              </div>

              <div class="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  @click="closeCreateModal"
                  class="rounded-lg border border-[#F1A75F] px-5 py-2.5 text-sm font-medium text-[#F1A75F] hover:bg-orange-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#2a1102]"
                >
                  Save Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>
  </main>
</template>
