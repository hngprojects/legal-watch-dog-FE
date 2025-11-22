<script setup lang="ts">
import { ref } from 'vue'
import JurisdictionModal from '@/components/reusable/JurisdictionModal.vue'
import type { JurisdictionForm, Jurisdiction } from '@/types/jurisdiction'
import { useJurisdictionStore } from '@/stores/jurisdiction'
import deleteicon from '@/assets/delete.png'
import editicon from '@/assets/Edit.png'
import vector from '@/assets/Vector.png'

const store = useJurisdictionStore()
const activeTab = ref<'jurisdictions' | 'activity'>('jurisdictions')
const isModalOpen = ref(false)

const project = ref({
  title: 'EU Travel Policy Update',
  description:
    'Monitor changes to EU travel rules, visa requirements, entry conditions, and policy updates across all Schengen and EU member states',
})

const jurisdictions = ref<Jurisdiction[]>([])

const openModal = () => {
  isModalOpen.value = true
}

const handleCreateJurisdiction = async (data: JurisdictionForm) => {
  try {
    jurisdictions.value.push({
      id: String(Date.now()),
      name: data.name,
      description: data.description,
      timestamp: 'Just now',
      changesDetected: false,
    })
    isModalOpen.value = false
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA]">
    <main class="mx-auto max-w-[1100px] px-6 py-8">
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-2 text-sm">
          <a
            href="#"
            class="flex items-center gap-2 font-medium text-[#926233] hover:text-[#3C2610]"
          >
           
          
            <img :src="vector" class="h-5 w-auto" />
            Project
          </a>
          <span class="text-gray-400">&gt;</span>
          <span class="font-medium text-[#926233]">{{ project.title }}</span>
        </div>

        <button
          class="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-500 hover:bg-gray-50"
        >
          <img :src="deleteicon" class="h-5 w-auto" />
          Delete project
        </button>
      </div>

      <div class="mb-10 rounded-xl  bg-white p-9 shadow-sm flex justify-between ">
        <span>
          <h1 class="text-[22px] font-semibold text-gray-900">{{ project.title }}s</h1>
          <p class="mt-3 text-sm leading-relaxed text-gray-600">{{ project.description }}</p>
        </span>
        <span ><img :src="editicon" class="border border-gray-400 rounded p-1" /></span>
      </div>

      <div class="mb-6 flex items-end justify-between">
        <div class="flex">
          <button
            @click="activeTab = 'jurisdictions'"
            class="relative pb-3 text-sm font-medium"
            :class="
              activeTab === 'jurisdictions' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
            "
          >
            Jurisdictions
            <span
              v-if="activeTab === 'jurisdictions'"
              class="absolute right-0 bottom-0 left-0 h-0.5 bg-[#3C2610]"
            ></span>
          </button>
          <button
            @click="activeTab = 'activity'"
            class="relative ml-8 pb-3 text-sm font-medium"
            :class="
              activeTab === 'activity' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
            "
          >
            Activity
            <span
              v-if="activeTab === 'activity'"
              class="absolute right-0 bottom-0 left-0 h-0.5 bg-[#3C2610]"
            ></span>
          </button>
        </div>
        <button
          @click="openModal"
          class="flex h-10 items-center gap-2 rounded-lg bg-[#3C2610] px-5 text-sm font-medium text-white hover:bg-[#2d1c0c]"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1V11M1 6H11"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          Add Jurisdiction
        </button>
      </div>

      <!-- Jurisdiction Cards -->
      <div v-if="activeTab === 'jurisdictions'" class="space-y-4">
        <div
          v-if="jurisdictions.length === 0"
          class="flex min-h-[280px] items-center justify-center rounded-lg bg-[#F9FAFB]"
        >
          <p class="text-sm text-gray-500">No Juridiction found</p>
        </div>

        <!-- Jurisdiction Card -->
        <div
          v-for="jurisdiction in jurisdictions"
          :key="jurisdiction.id"
          class="rounded-xl border border-gray-200 bg-white p-5"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-base font-semibold text-gray-900">{{ jurisdiction.name }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-gray-600">
                {{ jurisdiction.description }}
              </p>
              <p class="mt-3 text-xs text-gray-400">{{ jurisdiction.timestamp }}</p>
            </div>
            <span
              v-if="jurisdiction.changesDetected"
              class="ml-4 shrink-0 rounded-md border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600"
            >
              Changes detected
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="activeTab === 'activity'"
        class="flex min-h-[280px] items-center justify-center rounded-lg bg-[#F9FAFB]"
      >
        <p class="text-sm text-gray-500">Activity Feed is empty.</p>
      </div>
    </main>
    <JurisdictionModal v-model="isModalOpen" @submit="handleCreateJurisdiction" />
  </div>
</template>
