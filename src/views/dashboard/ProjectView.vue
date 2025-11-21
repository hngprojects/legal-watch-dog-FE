<script setup lang="ts">
import { ref } from 'vue'

// Mock data — replace with real API later
const projects = ref([
  {
    id: 1,
    name: 'Global Visa Monitoring',
    description:
      'Comprehensive monitoring of visa requirements, immigration policies, and entry regulations across major destination countries for skilled workers...',
    jurisdictions: 12,
  },
  {
    id: 2,
    name: 'Global Visa Monitoring',
    description:
      'Comprehensive monitoring of visa requirements, immigration policies, and entry regulations across major destination countries for skilled workers...',
    jurisdictions: 12,
  },
  {
    id: 3,
    name: 'Global Visa Monitoring',
    description:
      'Comprehensive monitoring of visa requirements, immigration policies, and entry regulations across major destination countries for skilled workers...',
    jurisdictions: 12,
  },
  {
    id: 4,
    name: 'Global Visa Monitoring',
    description:
      'Comprehensive monitoring of visa requirements, immigration policies, and entry regulations across major destination countries for skilled workers...',
    jurisdictions: 12,
  },
  {
    id: 5,
    name: 'Global Visa Monitoring',
    description:
      'Comprehensive monitoring of visa requirements, immigration policies, and entry regulations across major destination countries for skilled workers...',
    jurisdictions: 12,
  },
  {
    id: 6,
    name: 'Global Visa Monitoring',
    description:
      'Comprehensive monitoring of visa requirements, immigration policies, and entry regulations across major destination countries for skilled workers...',
    jurisdictions: 12,
  },
])
</script>

<template>
  <main class="min-h-screen flex-1 bg-[#FAFAFA] px-6 py-10 lg:px-12 lg:py-14">
    <div class="mx-auto max-w-7xl">
      <!-- Header -->
      <div
        class="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"
      >
        <h1 class="text-3xl font-bold text-gray-900 lg:text-4xl">My Projects</h1>

        <!-- Create Project Button - Exact match to design -->
        <button
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
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="project in projects"
          :key="project.id"
          class="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/60 transition-all duration-300 hover:shadow-lg hover:ring-[#401903]/10"
        >
          <div class="p-8">
            <!-- Project Title -->
            <h3
              class="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-[#401903]"
            >
              {{ project.name }}
            </h3>

            <!-- Description -->
            <p class="mb-6 line-clamp-3 text-sm leading-relaxed text-gray-600">
              {{ project.description }}
            </p>

            <!-- Jurisdictions -->
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="font-medium text-gray-800"
                >{{ project.jurisdictions }} Jurisdiction</span
              >
            </div>
          </div>
        </article>
      </div>

      <!-- Empty State (if needed later) -->
      <!-- <div v-if="projects.length === 0" class="py-24 text-center">
        <p class="text-lg text-gray-500">No projects created yet.</p>
      </div> -->
    </div>
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

const formHeading = computed(() =>
  editingId.value ? 'Update Project' : 'Create Project',
)

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
  <main class="space-y-8">
    <section class="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm">
      <header class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-amber-700">Projects</p>
          <h1 class="text-2xl font-semibold text-gray-900">Manage Monitored Projects</h1>
        </div>
        <div class="text-sm text-gray-500">
          {{ projects.length }} active record{{ projects.length === 1 ? '' : 's' }}
        </div>
      </header>

      <div class="grid gap-8 lg:grid-cols-[360px,1fr]">
        <form class="rounded-2xl border border-gray-100 bg-amber-50/60 p-5" @submit.prevent="handleSubmit">
          <h2 class="text-lg font-semibold text-gray-900">{{ formHeading }}</h2>
          <p class="mb-4 mt-1 text-xs text-gray-500">
            {{
              editingId
                ? 'Update existing project metadata.'
                : 'Create a new tracked project for your organisation.'
            }}
          </p>

          <div class="space-y-4">
            <div>
              <label class="text-xs font-medium text-gray-600">Project name</label>
              <input
                v-model="formState.name"
                type="text"
                class="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-700/30"
                placeholder="e.g. AI Compliance Radar"
              />
            </div>
            <div>
              <label class="text-xs font-medium text-gray-600">Description</label>
              <textarea
                v-model="formState.description"
                rows="3"
                class="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-700/30"
                placeholder="Short summary of what we are monitoring"
              />
            </div>
            <div>
              <label class="text-xs font-medium text-gray-600">Prompt</label>
              <textarea
                v-model="formState.prompt"
                rows="3"
                class="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-700/30"
                placeholder="Instructions for AI briefings (e.g. tone, scope, frequency)"
              />
            </div>
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              :disabled="isSaving"
              class="inline-flex flex-1 items-center justify-center rounded-full bg-amber-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span v-if="!isSaving">{{ editingId ? 'Update' : 'Create' }}</span>
              <span v-else>Saving…</span>
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              @click="resetForm"
            >
              Reset
            </button>
          </div>
          <p v-if="error" class="mt-4 text-xs text-red-600">{{ error }}</p>
        </form>

        <div class="rounded-2xl border border-gray-100 p-4">
          <div
            v-if="loading"
            class="flex h-48 items-center justify-center text-sm text-gray-400"
          >
            Loading projects…
          </div>
          <div
            v-else-if="projects.length === 0"
            class="flex h-48 flex-col items-center justify-center text-center text-sm text-gray-400"
          >
            <p>No projects yet.</p>
            <p>Create one with the form on the left.</p>
          </div>
          <ul v-else class="space-y-3">
            <li
              v-for="project in projects"
              :key="project.id"
              class="rounded-2xl border border-gray-100 p-4 shadow-sm"
            >
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-semibold text-gray-900">{{ project.name }}</p>
                  <p class="text-xs text-gray-500">
                    Created {{ new Date(project.created_at).toLocaleDateString() }}
                  </p>
                </div>
                <span
                  class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700"
                >
                  {{ project.status }}
                </span>
              </div>
              <p class="mt-2 text-sm text-gray-600">
                {{ project.description || 'No description provided.' }}
              </p>
              <p class="mt-2 text-xs text-amber-900">
                Prompt: {{ project.prompt }}
              </p>
              <div class="mt-3 flex gap-3 text-sm">
                <button
                  class="text-amber-900 underline"
                  @click="populateForm(project)"
                >
                  Edit
                </button>
                <button class="text-red-600 underline" @click="handleDelete(project.id)">
                  Delete
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Optional subtle hover lift */
article:hover {
  transform: translateY(-4px);
}
</style>
