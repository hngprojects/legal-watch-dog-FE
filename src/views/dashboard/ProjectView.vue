<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProjectStore } from '@/stores/project-store'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const projectStore = useProjectStore()
const { projects, loading, error } = storeToRefs(projectStore)
const router = useRouter()

const showCreateModal = ref(false)
const formData = ref({
  title: '',
  description: '',
  master_prompt: '',
})

// Kebab menu state — now uses string IDs
const activeMenuId = ref<string | null>(null)

const toggleMenu = (projectId: string, event: Event) => {
  event.stopPropagation()
  activeMenuId.value = activeMenuId.value === projectId ? null : projectId
}

const closeMenu = () => {
  activeMenuId.value = null
}

const openCreateModal = () => {
  showCreateModal.value = true
  formData.value = { title: '', description: '', master_prompt: '' }
  projectStore.setError(null)
}

const closeCreateModal = () => {
  showCreateModal.value = false
  formData.value = { title: '', description: '', master_prompt: '' }
  projectStore.setError(null)
}

const deleteProject = async (projectId: string) => {
  await projectStore.deleteProject(projectId)
  closeMenu()
}

const handleCreateProject = async () => {
  projectStore.setError(null)

  if (!formData.value.title.trim()) return projectStore.setError('Project name is required')
  if (!formData.value.description.trim()) return projectStore.setError('Description is required')
  if (!formData.value.master_prompt.trim())
    return projectStore.setError('Master prompt is required')

  const newProject = await projectStore.addProject({
    title: formData.value.title.trim(),
    description: formData.value.description.trim(),
    master_prompt: formData.value.master_prompt.trim(),
  })

  if (newProject) {
    closeCreateModal()
    router.push(`/dashboard/projects/${newProject.id}`)
  }
}

const goToProject = (id: string) => {
  router.push(`/dashboard/projects/${id}`)
}

onMounted(() => {
  projectStore.fetchProjects()
})
</script>

<template>
  <main class="min-h-screen flex-1 bg-gray-50 px-6 py-10 lg:px-12 lg:py-14">
    <div class="mx-auto max-w-7xl">
      <div v-if="loading" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="n in 6" :key="n" class="animate-pulse rounded-2xl bg-white p-8 shadow-sm">
          <div class="mb-4 h-6 w-3/4 rounded bg-gray-200"></div>
          <div class="space-y-2">
            <div class="h-4 w-full rounded bg-gray-200"></div>
            <div class="h-4 w-5/6 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>

      <div v-else-if="projects.length === 0" class="flex items-center justify-center">
        <div class="text-center">
          <div class="mb-6 flex justify-center">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
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
            class="inline-flex items-center gap-2 rounded-lg bg-[#401903] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#592304]"
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

      <div v-else-if="error" class="flex min-h-[600px] items-center justify-center">
        <div class="text-center">
          <p class="mb-4 text-red-600">{{ error }}</p>
          <button @click="projectStore.fetchProjects" class="text-[#401903] underline">
            Retry
          </button>
        </div>
      </div>

      <div v-else-if="projects.length > 0" class="space-y-8">
        <!-- Header with Create Button -->
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold text-gray-900 lg:text-4xl">My Projects</h1>
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
            Create Project
          </button>
        </div>

        <!-- Projects Grid -->
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" @click="closeMenu">
          <article
            v-for="project in projects"
            :key="project.id"
            @click="goToProject(project.id)"
            class="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-300 hover:shadow-lg hover:ring-[#401903]/10"
          >
            <!-- <button
              @click.stop="toggleMenu(project.id, $event)"
              class="absolute top-4 right-4 z-10 rounded-full p-2 text-gray-400 transition-all group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-700"
              :class="{
                'opacity-100': activeMenuId === project.id,
                'opacity-0': activeMenuId !== project.id,
              }"
            >
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                />
              </svg>
            </button> -->

            <!-- <div
              v-if="activeMenuId === project.id"
              @click.stop
              class="absolute top-12 right-4 z-20 w-48 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black/5"
            >
              <button
                @click="deleteProject(project.id)"
                class="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Delete Project
              </button>
            </div> -->

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

    <teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]"
        @click.self="closeCreateModal"
      >
        <div class="relative w-full max-w-[540px] rounded-sm bg-white shadow-xl">
          <button
            @click="closeCreateModal"
            class="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
              <h3 class="mb-2 text-xl font-bold text-[#080808]">Create New Project</h3>
              <p class="text-sm text-[#6B7280]">
                Set up a new project to track legal and regulatory changes
              </p>
            </div>

            <form @submit.prevent="handleCreateProject" class="space-y-5">
              <div>
                <label for="projName" class="mb-2 block text-sm font-medium text-[#1F1F1F]">
                  Project Name
                </label>
                <input
                  v-model="formData.title"
                  id="projName"
                  placeholder="e.g Global Visa Monitoring"
                  required
                  class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4 text-sm text-gray-900 placeholder-[#717680] focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                />
                <p class="mt-1.5 text-xs text-[#717680]">Give your project a descriptive name</p>
              </div>

              <div>
                <label for="desc" class="mb-2 block text-sm font-medium text-[#1F1F1F]">
                  Description
                </label>
                <textarea
                  v-model="formData.description"
                  id="desc"
                  rows="3"
                  placeholder="What legal areas will you monitor?"
                  required
                  class="w-full resize-none rounded-lg border border-[#D5D7DA] px-4 py-3 text-sm text-gray-900 placeholder-[#717680] focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                />
              </div>

              <div>
                <label for="prompt" class="mb-2 block text-sm font-medium text-[#1F1F1F]">
                  Master Prompt
                </label>
                <textarea
                  v-model="formData.master_prompt"
                  id="prompt"
                  rows="3"
                  placeholder="e.g. Summarize any changes to visa policy in the UK, EU, USA, Canada..."
                  required
                  class="w-full resize-none rounded-lg border border-[#D5D7DA] px-4 py-3 text-sm text-gray-900 placeholder-[#717680] focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                />
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
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>
  </main>
</template>

<style scoped>
article:hover {
  transform: translateY(-4px);
}
</style>
