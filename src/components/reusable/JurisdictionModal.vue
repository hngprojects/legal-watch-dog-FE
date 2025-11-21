<script setup lang="ts">
import { ref, computed } from 'vue'
import JurisdictionModal from '@/components/reusable/JurisdictionModal.vue'
import Vector from '@/assets/Vector.png'

// --- Type Definitions ---
interface Project {
  title: string
  created: string
  updated: string
  description: string
}

interface JurisdictionForm {
  name: string
  description: string
  subJurisdictions: string[]
}

// --- Component State ---
const project: Project = {
  title: 'Global Visa Monitoring',
  created: 'Jan 15, 2026',
  updated: '2 hrs ago',
  description:
    'Monitor changes to UK immigration policy, including skilled worker visas, student visas, and general immigration requirements.',
}

const activeTab = ref<'jurisdictions' | 'activity'>('jurisdictions')
const isModalOpen = ref(false)

const newJurisdiction = ref<JurisdictionForm>({
  name: '',
  description: '',
  subJurisdictions: [],
})

// --- Computed & Methods ---
const formattedProjectTitle = computed(() => project.title)

const openModal = () => {
  newJurisdiction.value = { name: '', description: '', subJurisdictions: [] }
  isModalOpen.value = true
}

const handleCreateJurisdiction = (data: JurisdictionForm) => {
  console.log('Created Jurisdiction:', data)
  isModalOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-800">
    <!-- Main Content -->
    <main class="mx-auto max-w-7xl px-6 py-10">
      <!-- Breadcrumb & Settings -->
      <div class="mb-8 flex items-center justify-between">
        <div class="flex items-center space-x-2 text-sm font-medium text-gray-600">
          <div
            class="flex cursor-pointer items-center gap-3 text-[#926233] transition hover:text-[#3c2610c8]"
          >
            <span>
              <img :src="Vector" alt="Vector" class="w-3.5" />
            </span>
            Project
          </div>
          <span>&gt;</span>
          <span class="text-[#926233]">{{ formattedProjectTitle }}</span>
        </div>
        <button class="rounded-full p-2 text-gray-500 transition hover:text-gray-700">
          <!-- Some settings icon -->
        </button>
      </div>

      <!-- Project Card -->
      <div class="mb-8 rounded-xl border bg-white p-6 shadow-md">
        <h1 class="mb-2 text-3xl font-semibold text-gray-900">{{ project.title }}</h1>
        <div class="mb-4 flex space-x-4 text-sm text-gray-500">
          <div>Created {{ project.created }}</div>
          <div>Updated {{ project.updated }}</div>
        </div>
        <p class="text-gray-600">{{ project.description }}</p>
      </div>

      <!-- Tabs & Add Button -->
      <div class="mb-6 flex items-center justify-between border-b pb-4">
        <div class="flex space-x-6">
          <button
            @click="activeTab = 'jurisdictions'"
            :class="
              activeTab === 'jurisdictions'
                ? 'border-b-2 border-[#3C2610] pb-2 font-medium text-[#3C2610]'
                : 'border-b-2 border-transparent pb-2 font-medium text-[#926233] hover:border-gray-300 hover:text-gray-700'
            "
          >
            Jurisdictions
          </button>
          <button
            @click="activeTab = 'activity'"
            :class="
              activeTab === 'activity'
                ? 'border-b-2 border-[#3C2610] pb-2 font-medium text-[#3C2610]'
                : 'border-b-2 border-transparent pb-2 font-medium text-[#926233] hover:border-gray-300 hover:text-gray-700'
            "
          >
            Activity
          </button>
        </div>
        <button
          @click="openModal"
          class="rounded-lg bg-[#3C2610] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#3C2610]"
        >
          + Add Jurisdiction
        </button>
      </div>

      <!-- Tab Content -->
      <div
        v-if="activeTab === 'jurisdictions'"
        class="rounded-lg bg-white py-12 text-center shadow-inner"
      >
        <p class="text-gray-500 italic">No Jurisdiction found</p>
      </div>

      <div
        v-if="activeTab === 'activity'"
        class="rounded-lg bg-white py-12 text-center shadow-inner"
      >
        <p class="text-gray-500 italic">Activity Feed is empty.</p>
      </div>
    </main>

    <!-- Modal Component -->
    <JurisdictionModal
      v-model="isModalOpen"
      :formData="newJurisdiction"
      @submit="handleCreateJurisdiction"
    />
  </div>
</template>
