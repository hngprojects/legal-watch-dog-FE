<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/project-store'
import { ref, onMounted } from 'vue'
import { watch } from 'vue'
import type { Project } from '@/types/project'
import { ArrowLeftIcon, ChevronRight, Plus, Settings, X } from 'lucide-vue-next'
import Swal from 'sweetalert2'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const projectId = route.params.id as string
const project = ref<Project | null>(null)
const loading = ref(true)
const activeTab = ref<'jurisdictions' | 'activity'>('jurisdictions')
const showAddJurisdictionModal = ref(false)

const jurisdictions = ref([])

const goBack = () => {
  router.push('/dashboard/projects')
}

const openAddJurisdictionModal = () => {
  showAddJurisdictionModal.value = true
}

const closeAddJurisdictionModal = () => {
  showAddJurisdictionModal.value = false
}

onMounted(async () => {
  const existingProject = projectStore.projects.find((p) => p.id === projectId)

  if (existingProject) {
    project.value = existingProject
  } else {
    await projectStore.fetchProjects()
    const foundProject = projectStore.projects.find((p) => p.id === projectId)
    project.value = foundProject || null
  }

  loading.value = false
})

const showSettingsMenu = ref(false)
const showInlineEdit = ref(false)

const editForm = ref({
  title: '',
  description: '',
  master_prompt: '',
})

const toggleSettingsMenu = () => {
  showSettingsMenu.value = !showSettingsMenu.value
}

const closeSettingsMenu = () => {
  showSettingsMenu.value = false
}

// handle delete
const deleteProject = async () => {
  closeSettingsMenu()

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

  await projectStore.deleteProject(projectId)

  await Swal.fire({
    title: 'Deleted!',
    text: 'Project successfully deleted.',
    icon: 'success',
    timer: 1500,
    showConfirmButton: false,
  })

  router.push('/dashboard/projects')
}

const startEdit = () => {
  editForm.value = {
    title: project.value?.title || '',
    description: project.value?.description || '',
    master_prompt: project.value?.master_prompt || '',
  }

  showInlineEdit.value = true
  closeSettingsMenu()
}

const saveEdit = async () => {
  try {
    const updated = await projectStore.updateProject(projectId, {
      title: editForm.value.title,
      description: editForm.value.description,
      master_prompt: editForm.value.master_prompt,
    })

    if (project.value && updated) {
      project.value.title = editForm.value.title
      project.value.description = editForm.value.description
      project.value.master_prompt = editForm.value.master_prompt
    }

    await Swal.fire({
      title: 'Updated!',
      text: 'Project updated successfully.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    })

    showInlineEdit.value = false
  } catch (err: any) {
    Swal.fire(
      'Error',
      projectStore.error || err?.response?.data?.detail?.[0]?.msg || 'Failed to update project',
      'error',
    )
  }
}

watch(
  () => projectStore.projects,
  (newProjects) => {
    const found = newProjects.find((p) => p.id === projectId)
    if (found) project.value = found
  },
  { deep: true },
)
</script>

<template>
  <main class="min-h-screen flex-1 bg-gray-50 p-6 lg:p-10">
    <div v-if="loading" class="mx-auto max-w-7xl">
      <div class="animate-pulse">
        <div class="mb-8 h-6 w-64 rounded bg-gray-200"></div>
        <div class="mb-4 h-10 w-96 rounded bg-gray-200"></div>
        <div class="h-5 w-full max-w-2xl rounded bg-gray-200"></div>
      </div>
    </div>

    <div v-else-if="!project" class="mx-auto max-w-7xl py-16 text-center">
      <h1 class="mb-4 text-2xl font-bold text-gray-900">Project not found</h1>
      <button @click="goBack" class="cursor-pointer text-[#401903] hover:underline">
        <ArrowLeftIcon :size="18" /> Back to Projects
      </button>
    </div>

    <div v-else class="mx-auto max-w-7xl">
      <div class="mb-8 flex items-center justify-between">
        <nav class="flex items-center gap-2 text-sm">
          <button
            @click="goBack"
            class="flex cursor-pointer items-center gap-2 text-gray-500 transition-colors hover:text-gray-700"
          >
            <ArrowLeftIcon :size="18" />
            <span>Project</span>
          </button>
          <ChevronRight :size="18" />
          <span class="font-medium text-[#C17A3F]">{{ project.title }}</span>
        </nav>

        <div class="relative">
          <button
            @click.stop="toggleSettingsMenu"
            class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
          >
            <Settings :size="18" />
          </button>

          <div
            v-if="showSettingsMenu"
            @click.stop
            class="absolute right-0 z-50 mt-2 w-44 rounded-md bg-white shadow-lg ring-1 ring-black/5"
          >
            <button @click="startEdit" class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">
              Edit Project
            </button>
            <button
              @click="deleteProject"
              class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Delete Project
            </button>
          </div>
        </div>
      </div>

      <!-- inline editable project card -->
      <div class="mb-8 flex flex-col gap-5 rounded-[10px] bg-white p-5">
        <template v-if="showInlineEdit">
          <form @submit.prevent="saveEdit" class="w-full space-y-4">
            <div>
              <label class="text-sm font-medium text-[#1F1F1F]">Project Name</label>
              <input
                v-model="editForm.title"
                class="h-[52px] w-full rounded-lg border border-[#D5D7DA] px-4 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20"
              />
            </div>

            <div>
              <label class="text-sm font-medium text-[#1F1F1F]">Description</label>
              <textarea
                v-model="editForm.description"
                rows="3"
                class="w-full rounded-lg border border-[#D5D7DA] px-4 py-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20"
              ></textarea>
            </div>

            <div>
              <label class="text-sm font-medium text-[#1F1F1F]">Master Prompt</label>
              <textarea
                v-model="editForm.master_prompt"
                rows="3"
                class="w-full rounded-lg border border-[#D5D7DA] px-4 py-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20"
              ></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                @click="showInlineEdit = false"
                class="rounded-lg border border-[#F1A75F] px-5 py-2.5 text-sm font-medium text-[#F1A75F] hover:bg-orange-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2a1102]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </template>

        <template v-else>
          <h1 class="text-2xl leading-[30px] font-bold text-gray-900">{{ project.title }}</h1>
          <p class="text-sm leading-5 text-gray-600">{{ project.description }}</p>
        </template>
      </div>

      <div class="mb-8 flex items-end justify-between border-b border-gray-200 md:mt-[88px]">
        <div class="flex gap-8">
          <button
            @click="activeTab = 'jurisdictions'"
            :class="[
              'relative pb-4 text-sm font-medium transition-colors',
              activeTab === 'jurisdictions' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            Jurisdictions
            <div
              v-if="activeTab === 'jurisdictions'"
              class="absolute right-0 bottom-0 left-0 h-0.5 bg-[#401903]"
            ></div>
          </button>
          <button
            @click="activeTab = 'activity'"
            :class="[
              'relative pb-4 text-sm font-medium transition-colors',
              activeTab === 'activity' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
            ]"
          >
            Activity
            <div
              v-if="activeTab === 'activity'"
              class="absolute right-0 bottom-0 left-0 h-0.5 bg-[#401903]"
            ></div>
          </button>
        </div>

        <button
          v-if="activeTab === 'jurisdictions'"
          @click="openAddJurisdictionModal"
          class="mb-3 flex items-center gap-2 rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#592304]"
        >
          <Plus :size="18" />
          Add Jurisdiction
        </button>
      </div>

      <div class="rounded-xl bg-white shadow-sm ring-1 ring-gray-200/60">
        <div v-if="activeTab === 'jurisdictions'">
          <div
            v-if="jurisdictions.length === 0"
            class="flex flex-col items-center justify-center py-20"
          >
            <p class="text-sm text-gray-500">No Jurisdiction found</p>
          </div>

          <div v-else class="p-6"></div>
        </div>

        <div
          v-else-if="activeTab === 'activity'"
          class="flex flex-col items-center justify-center py-20"
        >
          <p class="text-sm text-gray-500">No activity yet</p>
        </div>
      </div>
    </div>
  </main>
</template>
