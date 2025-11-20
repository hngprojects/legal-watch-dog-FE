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
  </main>
</template>

<style scoped>
/* Optional subtle hover lift */
article:hover {
  transform: translateY(-4px);
}
</style>
