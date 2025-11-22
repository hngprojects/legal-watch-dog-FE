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

const activeMenuId = ref<number | null>(null)

const toggleMenu = (projectId: number, event: Event) => {
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

const deleteProject = async (projectId: number) => {
  await projectStore.deleteProject(projectId)
  closeMenu()
}

const handleCreateProject = async () => {
  projectStore.setError(null)

  if (!formData.value.title.trim()) return projectStore.setError('Project name is required')
  if (!formData.value.description.trim()) return projectStore.setError('Description is required')
  if (!formData.value.master_prompt.trim()) return projectStore.setError('Master prompt is required')

  try {
    await projectStore.addProject({
      title: formData.value.title.trim(),
      description: formData.value.description.trim(),
      master_prompt: formData.value.master_prompt.trim(),
    })
    closeCreateModal()
  } catch (err: any) {
    projectStore.setError(err.response?.data?.message || 'Failed to create project')
  }
}

const goToProject = (id: number) => {
  router.push(`/dashboard/projects/${id}`)
}

onMounted(() => {
  projectStore.fetchProjects()
})
</script>

<template>
  <main class="min-h-screen flex-1 bg-gray-50 px-6 py-10 lg:px-12 lg:py-14">
    <div class="mx-auto max-w-7xl">
      <div class="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <h1 class="text-3xl font-bold text-gray-900 lg:text-4xl">My Projects</h1>
        <button
          @click="openCreateModal"
          class="flex items-center gap-3 rounded-full bg-[#401903] px-8 py-4 font-medium text-white shadow-md transition-all hover:bg-[#592304] hover:shadow-lg"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 4V16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4 10H16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Create Project
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
        <button @click="projectStore.fetchProjects" class="mt-4 text-[#401903] underline">Retry</button>
      </div>

      <div v-else class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" @click="closeMenu">
        <article
          v-for="project in projects"
          :key="project.id"
          @click="goToProject(project.id)"
          class="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-300 hover:shadow-lg hover:ring-[#401903]/10"
        >
          <button
            @click.stop="toggleMenu(project.id, $event)"
            class="absolute right-4 top-4 z-10 rounded-full p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-700 group-hover:opacity-100"
            :class="{ 'opacity-100': activeMenuId === project.id, 'opacity-0': activeMenuId !== project.id }"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          <div
            v-if="activeMenuId === project.id"
            @click.stop
            class="absolute right-4 top-12 z-20 w-48 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black/5"
          >
            <button
              @click="deleteProject(project.id)"
              class="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete Project
            </button>
          </div>

          <div class="p-8">
            <h3 class="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-[#401903]">
              {{ project.title }}
            </h3>
            <p class="line-clamp-3 text-sm leading-relaxed text-gray-600">
              {{ project.description || 'No description provided' }}
            </p>
          </div>
        </article>
      </div>
    </div>

    <teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
        @click.self="closeCreateModal"
      >
        <div class="relative w-full max-w-[640px] rounded-2xl bg-white shadow-xl">
          <button
            @click="closeCreateModal"
            class="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          <div class="p-10">
            <div class="mb-8">
              <h3 class="mb-2 text-xl font-bold text-[#080808]">Create New Project</h3>
              <p class="text-sm text-[#6B7280]">Set up a new project to track legal and regulatory changes</p>
            </div>

            <form @submit.prevent="handleCreateProject" class="space-y-6">
              <div>
                <h4 class="mb-3 text-sm font-medium text-[#121110]">Project information</h4>

                <div class="relative">
                  <input
                    v-model="formData.title"
                    id="projName"
                    placeholder="e.g Global Visa Monitoring"
                    required
                    class="peer h-[52px] w-full rounded-lg border border-[#D5D7DA] px-4 pt-5 pb-3 text-sm text-gray-900 placeholder-[#717680] focus:border-[#401903] focus:outline-none focus:ring-2 focus:ring-[#401903]/20"
                  />
                  <label
                    for="projName"
                    class="pointer-events-none absolute left-3 top-2.5 origin-left -translate-y-6 scale-75 transform bg-white px-1 text-xs font-medium text-[#1F1F1F] transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-[#717680] peer-focus:top-2.5 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#401903]"
                  >
                    Project Name
                  </label>
                </div>
                <p class="mt-1.5 pl-1 text-xs text-[#717680]">Give your project a descriptive name</p>

                <div class="relative mt-6">
                  <textarea
                    v-model="formData.description"
                    id="desc"
                    rows="4"
                    placeholder="What legal areas will you monitor?"
                    required
                    class="peer w-full resize-none rounded-lg border border-[#D5D7DA] px-4 pt-5 pb-3 text-sm text-gray-900 placeholder-[#717680] focus:border-[#401903] focus:outline-none focus:ring-2 focus:ring-[#401903]/20"
                  />
                  <label
                    for="desc"
                    class="pointer-events-none absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-[#1F1F1F] transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-[#717680] peer-focus:-top-2.5 peer-focus:text-[#401903] peer-focus:scale-75"
                  >
                    Description
                  </label>
                </div>

                <div class="relative mt-6">
                  <textarea
                    v-model="formData.master_prompt"
                    id="prompt"
                    rows="4"
                    placeholder="e.g. Summarize any changes to visa policy in the UK, EU, USA, Canada..."
                    required
                    class="peer w-full resize-none rounded-lg border border-[#D5D7DA] px-4 pt-5 pb-3 text-sm text-gray-900 placeholder-[#717680] focus:border-[#401903] focus:outline-none focus:ring-2 focus:ring-[#401903]/20"
                  />
                  <label
                    for="prompt"
                    class="pointer-events-none absolute -top-2.5 left-3 bg-white px-1 text-xs font-medium text-[#1F1F1F] transition-all duration-200 peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-[#717680] peer-focus:-top-2.5 peer-focus:text-[#401903] peer-focus:scale-75"
                  >
                    Master Prompt
                  </label>
                </div>
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