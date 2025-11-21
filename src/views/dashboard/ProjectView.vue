<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/project-store'
import type { Project, ProjectStatus } from '@/types/project'

const projectStore = useProjectStore()
const { projects, loading, error } = storeToRefs(projectStore)

const editingId = ref<string | null>(null)
const isSaving = ref(false)
const formState = reactive({
  name: '',
  description: '',
  prompt: '',
  status: 'active' as ProjectStatus,
})

const formHeading = computed(() => (editingId.value ? 'Update Project' : 'Create Project'))

const resetForm = () => {
  editingId.value = null
  formState.name = ''
  formState.description = ''
  formState.prompt = ''
  formState.status = 'active'
}

const populateForm = (project: Project) => {
  editingId.value = project.id
  formState.name = project.name
  formState.description = project.description
  formState.prompt = project.prompt
  formState.status = project.status
}

const handleSubmit = async () => {
  if (!formState.name.trim() || !formState.description.trim() || !formState.prompt.trim()) {
    projectStore.setError('Name, description, and prompt are required.')
    return
  }

  isSaving.value = true
  try {
    if (editingId.value) {
      await projectStore.updateProject(editingId.value, {
        name: formState.name.trim(),
        description: formState.description.trim(),
        prompt: formState.prompt.trim(),
        status: formState.status,
      })
    } else {
      await projectStore.addProject({
        name: formState.name.trim(),
        description: formState.description.trim(),
        prompt: formState.prompt.trim(),
        status: formState.status,
      })
    }
    resetForm()
  } finally {
    isSaving.value = false
  }
}

const handleDelete = async (id: string) => {
  const confirmed = window.confirm('Remove this project?')
  if (!confirmed) return
  await projectStore.deleteProject(id)
  if (editingId.value === id) {
    resetForm()
  }
}

onMounted(() => {
  projectStore.fetchProjects()
})
</script>

<template>
  <main class="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-gray-50/50 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <section class="overflow-hidden rounded-3xl border border-amber-100/60 bg-white shadow-xl shadow-amber-900/5">
        <header class="border-b border-gray-100 bg-gradient-to-r from-amber-50/40 to-transparent px-8 py-8">
          <div class="flex flex-wrap items-end justify-between gap-4">
            <div class="space-y-1.5">
              <p class="text-[0.6875rem] font-bold tracking-[0.15em] text-amber-800 uppercase">
                Project Management
              </p>
              <h1 class="text-3xl font-bold tracking-tight text-gray-900">
                Monitored Projects
              </h1>
              <p class="mt-1 text-sm text-gray-600">
                Configure and track compliance monitoring initiatives
              </p>
            </div>
            <div class="flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50/50 px-4 py-2 shadow-sm">
              <div class="h-2 w-2 rounded-full bg-amber-600 animate-pulse"></div>
              <span class="text-sm font-semibold text-gray-700">
                {{ projects.length }} Active
              </span>
            </div>
          </div>
        </header>

        <div class="grid gap-8 p-8 lg:grid-cols-[400px,1fr] xl:grid-cols-[440px,1fr]">
          <!-- Form Section -->
          <div class="space-y-6">
            <form
              class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 shadow-lg shadow-gray-900/5 transition-all hover:shadow-xl hover:shadow-gray-900/10"
              @submit.prevent="handleSubmit"
            >
              <div class="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400"></div>
              
              <div class="p-6 pb-5">
                <div class="mb-6 flex items-start justify-between">
                  <div>
                    <h2 class="text-xl font-bold text-gray-900">{{ formHeading }}</h2>
                    <p class="mt-1.5 text-sm leading-relaxed text-gray-500">
                      {{
                        editingId
                          ? 'Modify project configuration and monitoring parameters.'
                          : 'Define a new monitoring project with custom AI briefing instructions.'
                      }}
                    </p>
                  </div>
                  <div v-if="editingId" class="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                </div>

                <div class="space-y-5">
                  <div class="group/field">
                    <label class="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                      Project Name
                      <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="formState.name"
                      type="text"
                      class="block w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-600/10"
                      placeholder="AI Compliance Radar"
                    />
                  </div>

                  <div class="group/field">
                    <label class="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                      Description
                      <span class="text-red-500">*</span>
                    </label>
                    <textarea
                      v-model="formState.description"
                      rows="3"
                      class="block w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-600/10"
                      placeholder="Monitor regulatory updates and compliance requirements for AI deployment in financial services..."
                    />
                  </div>

                  <div class="group/field">
                    <label class="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700">
                      AI Briefing Prompt
                      <span class="text-red-500">*</span>
                    </label>
                    <textarea
                      v-model="formState.prompt"
                      rows="4"
                      class="block w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm leading-relaxed text-gray-900 placeholder-gray-400 shadow-sm transition-all focus:border-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-600/10"
                      placeholder="Generate weekly briefings in formal legal tone. Focus on regulatory changes, case law, and enforcement actions. Include actionable recommendations..."
                    />
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-5">
                <button
                  type="submit"
                  :disabled="isSaving"
                  class="group/btn relative flex-1 overflow-hidden rounded-xl bg-gradient-to-r from-amber-900 to-amber-800 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-amber-900/25 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-900/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                >
                  <span v-if="!isSaving" class="relative z-10">
                    {{ editingId ? 'Update Project' : 'Create Project' }}
                  </span>
                  <span v-else class="relative z-10 flex items-center justify-center gap-2">
                    <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                  <div class="absolute inset-0 bg-gradient-to-r from-amber-800 to-amber-700 opacity-0 transition-opacity group-hover/btn:opacity-100"></div>
                </button>
                <button
                  type="button"
                  class="rounded-xl border-2 border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 active:scale-95"
                  @click="resetForm"
                >
                  Reset
                </button>
              </div>

              <div v-if="error" class="border-t-2 border-red-100 bg-red-50 px-6 py-4">
                <div class="flex items-start gap-3">
                  <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                  <p class="text-sm font-medium text-red-800">{{ error }}</p>
                </div>
              </div>
            </form>
          </div>

          <!-- Projects List Section -->
          <div class="flex min-h-[500px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-900/5">
            <!-- Loading State -->
            <div v-if="loading" class="flex flex-1 flex-col items-center justify-center gap-4 p-12">
              <div class="relative h-16 w-16">
                <div class="absolute inset-0 rounded-full border-4 border-amber-100"></div>
                <div class="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-amber-600"></div>
              </div>
              <p class="text-sm font-medium text-gray-500">Loading projects...</p>
            </div>

            <!-- Empty State -->
            <div
              v-else-if="projects.length === 0"
              class="flex flex-1 flex-col items-center justify-center gap-6 p-12 text-center"
            >
              <div class="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-50 shadow-inner">
                <svg class="h-12 w-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="space-y-2">
                <h3 class="text-lg font-bold text-gray-900">No projects yet</h3>
                <p class="max-w-sm text-sm leading-relaxed text-gray-500">
                  Get started by creating your first monitoring project using the form on the left.
                </p>
              </div>
            </div>

            <!-- Projects List -->
            <div v-else class="flex-1 overflow-auto">
              <div class="space-y-4 p-6">
                <div
                  v-for="project in projects"
                  :key="project.id"
                  class="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:border-amber-200 hover:shadow-lg hover:shadow-amber-900/5"
                >
                  <div class="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                  
                  <div class="p-5">
                    <div class="mb-4 flex flex-wrap items-start justify-between gap-3">
                      <div class="flex-1 space-y-1">
                        <h3 class="text-base font-bold text-gray-900 transition-colors group-hover:text-amber-900">
                          {{ project.name }}
                        </h3>
                        <div class="flex items-center gap-2 text-xs text-gray-500">
                          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Created {{ new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
                        </div>
                      </div>
                      <span
                        class="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gradient-to-br from-gray-50 to-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-gray-700 shadow-sm"
                      >
                        <div class="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                        {{ project.status }}
                      </span>
                    </div>

                    <div class="space-y-3">
                      <div class="rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                        <p class="text-sm leading-relaxed text-gray-700">
                          {{ project.description || 'No description provided.' }}
                        </p>
                      </div>

                      <div class="rounded-lg border border-amber-100 bg-amber-50/30 p-3">
                        <p class="mb-1 text-xs font-bold uppercase tracking-wide text-amber-900">
                          AI Prompt
                        </p>
                        <p class="text-xs leading-relaxed text-amber-900/80">
                          {{ project.prompt }}
                        </p>
                      </div>
                    </div>

                    <div class="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                      <button
                        class="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-900 transition-all hover:border-amber-300 hover:bg-amber-100 active:scale-95"
                        @click="populateForm(project)"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        class="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 transition-all hover:border-red-300 hover:bg-red-100 active:scale-95"
                        @click="handleDelete(project.id)"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
