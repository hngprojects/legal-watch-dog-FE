<script setup lang="ts">
import { ref, reactive } from 'vue'

// Modal state
const showCreateModal = ref(false)

// Form state
const formData = reactive({
  projectName: '',
  description: '',
})

// Actions
const openCreateModal = () => {
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
  // Reset form
  formData.projectName = ''
  formData.description = ''
}

const handleCreateProject = () => {
  if (!formData.projectName.trim()) {
    alert('Project name is required')
    return
  }

  // TODO: Replace with real API call later
  console.log('Project created:', { ...formData })

  // Close modal (later we'll redirect to project list)
  closeCreateModal()
}
</script>

<template>
  <!-- ONLY the main content — Navbar & Sidebar come from DashboardLayout.vue -->
  <main class="min-h-screen flex-1 bg-gray-50 p-6 lg:p-10">
    <div class="mx-auto max-w-4xl py-16 text-center lg:py-24">
      <!-- Illustration -->
      <div class="mb-12">
        <svg
          width="340"
          height="240"
          viewBox="0 340 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="mx-auto drop-shadow-sm"
        >
          <path
            d="M170 200C260 200 330 155 330 100C330 45 260 0 170 0C80 0 10 45 10 100C10 155 80 200 170 200Z"
            fill="#F9FAFB"
          />
          <rect x="80" y="90" width="160" height="100" rx="12" fill="white" stroke="#E5E7EB" />
          <rect x="105" y="115" width="90" height="10" rx="5" fill="#F3F4F6" />
          <rect x="105" y="135" width="110" height="8" rx="4" fill="#F3F4F6" />
          <rect x="105" y="150" width="70" height="8" rx="4" fill="#F3F4F6" />
          <rect x="140" y="50" width="160" height="100" rx="12" fill="white" stroke="#E5E7EB" />
          <rect x="165" y="75" width="90" height="10" rx="5" fill="#F3F4F6" />
          <rect x="165" y="95" width="110" height="8" rx="4" fill="#F3F4F6" />
          <rect x="165" y="110" width="60" height="8" rx="4" fill="#F3F4F6" />
        </svg>
      </div>

      <!-- Empty State Text -->
      <h1 class="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">No Project Created</h1>
      <p class="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-gray-600">
        Create a project to start tracking changes on any website.<br class="hidden sm:block" />
        Our AI will monitor the sites and send you summarized updates automatically.
      </p>

      <!-- Create Button -->
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
        Create Project
      </button>
    </div>

    <!-- Create Project Modal -->
    <teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        @click.self="closeCreateModal"
      >
        <div
          class="animate-in fade-in zoom-in relative max-h-[90vh] w-full max-w-[650px] overflow-y-auto rounded-2xl bg-white shadow-2xl duration-200"
        >
          <!-- Close Button -->
          <button
            @click="closeCreateModal"
            class="absolute top-6 right-6 z-10 rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="#654321"
                stroke-width="1.5"
                stroke-opacity="0.2"
              />
              <path
                d="M9 9L15 15"
                stroke="#654321"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15 9L9 15"
                stroke="#654321"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div class="p-8 lg:p-10">
            <!-- Header -->
            <div class="mb-8">
              <h3 class="mb-1 text-2xl font-bold text-gray-900">Create New Project</h3>
              <p class="text-sm text-gray-500">
                Set up a new project to track legal and regulatory changes
              </p>
            </div>

            <!-- Form -->
            <div class="space-y-8">
              <div>
                <h4 class="mb-4 text-sm font-semibold text-gray-900">Project information</h4>

                <!-- Project Name -->
                <div class="relative">
                  <input
                    type="text"
                    v-model="formData.projectName"
                    placeholder="e.g Global Visa Monitoring"
                    class="h-14 w-full rounded-lg border border-gray-300 px-4 text-base placeholder-gray-400 transition-all focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                  />
                  <label
                    class="absolute -top-3 left-4 bg-white px-2 text-xs font-semibold text-gray-600"
                  >
                    Project Name
                  </label>
                  <p class="mt-2 pl-1 text-xs text-gray-500">
                    Give your project a descriptive name
                  </p>
                </div>

                <!-- Description -->
                <div class="relative mt-6">
                  <textarea
                    v-model="formData.description"
                    rows="4"
                    placeholder="What legal areas will you monitor?"
                    class="w-full resize-none rounded-lg border border-gray-300 px-4 py-4 text-base placeholder-gray-400 transition-all focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
                  ></textarea>
                  <label
                    class="absolute -top-3 left-4 bg-white px-2 text-xs font-semibold text-gray-600"
                  >
                    Description
                  </label>
                </div>
              </div>
            </div>

            <!-- Footer Buttons -->
            <div class="mt-10 flex justify-end gap-4">
              <button
                @click="closeCreateModal"
                class="rounded-lg border border-[#F1A75F] px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-orange-50"
              >
                Cancel
              </button>
              <button
                @click="handleCreateProject"
                class="flex items-center gap-2 rounded-lg bg-[#401903] px-6 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#592304]"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 3.33337V12.6667"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M3.33337 8H12.6667"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Create Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </main>
</template>

<style scoped>
.animate-in {
  animation: fadeInUp 0.25s ease-out;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
