<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/project-store'
import { ref, onMounted } from 'vue'
import type { Project } from '@/types/project'
import { ArrowLeftIcon, ChevronRight, Plus, Settings, X } from 'lucide-vue-next'


const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const projectId = route.params.id as string
const project = ref<Project | null>(null) 
const loading = ref(true)
const activeTab = ref<'jurisdictions' | 'activity'>('jurisdictions')
const showAddJurisdictionModal = ref(false)

const jurisdictions = ref<any[]>([])

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
  const existingProject = projectStore.projects.find(p => p.id === projectId)
  
  if (existingProject) {
    project.value = existingProject
  } else {
    await projectStore.fetchProjects()
    const foundProject = projectStore.projects.find(p => p.id === projectId)
    project.value = foundProject || null
  }
  
  loading.value = false
})
</script>

<template>
  <main class="min-h-screen flex-1 bg-gray-50 p-6 lg:p-10">
    <div v-if="loading" class="mx-auto max-w-7xl">
      <div class="animate-pulse">
        <div class="h-6 w-64 bg-gray-200 rounded mb-8"></div>
        <div class="h-10 w-96 bg-gray-200 rounded mb-4"></div>
        <div class="h-5 w-full max-w-2xl bg-gray-200 rounded"></div>
      </div>
    </div>

    <div v-else-if="!project" class="mx-auto max-w-7xl py-16 text-center">
      <h1 class="mb-4 text-2xl font-bold text-gray-900">Project not found</h1>
      <button
        @click="goBack"
        class="text-[#401903] hover:underline cursor-pointer"
      >
        <ArrowLeftIcon :size=18 /> Back to Projects
      </button>
    </div>

    <div v-else class="mx-auto max-w-7xl">
      <div class="mb-8 flex items-center justify-between">
        <nav class="flex items-center gap-2 text-sm">
          <button
            @click="goBack"
            class="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <ArrowLeftIcon :size=18 />
            <span>Project</span>
          </button>
          <ChevronRight :size="18"/>
          <span class="font-medium text-[#C17A3F]">{{ project.title }}</span>
        </nav>
        
        <button class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors">
          <Settings :size="18" />
        </button>
      </div>

      <div class="mb-8 rounded-[10px] bg-white p-5 flex flex-col gap-5">
        <h1 class="text-2xl font-bold text-gray-900 leading-[30px]">{{ project.title }}</h1>
        <p class="text-sm text-gray-600 leading-5">{{ project.description }}</p>
      </div>

      <div class="mb-8 flex items-end justify-between border-b border-gray-200 md:mt-[88px]">
        <div class="flex gap-8">
          <button
            @click="activeTab = 'jurisdictions'"
            :class="[
              'pb-4 text-sm font-medium transition-colors relative',
              activeTab === 'jurisdictions'
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            Jurisdictions
            <div
              v-if="activeTab === 'jurisdictions'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#401903]"
            ></div>
          </button>
          <button
            @click="activeTab = 'activity'"
            :class="[
              'pb-4 text-sm font-medium transition-colors relative',
              activeTab === 'activity'
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            ]"
          >
            Activity
            <div
              v-if="activeTab === 'activity'"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#401903]"
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

      
      <div class="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/60">
      
        <div v-if="activeTab === 'jurisdictions'">
          
          <div v-if="jurisdictions.length === 0" class="flex flex-col items-center justify-center py-20">
            <p class="text-gray-500 text-sm">No Jurisdiction found</p>
          </div>
          
          
          <div v-else class="p-6">
            
          </div>
        </div>

        
        <div v-else-if="activeTab === 'activity'" class="flex flex-col items-center justify-center py-20">
          <p class="text-gray-500 text-sm">No activity yet</p>
        </div>
      </div>
    </div>

    <teleport to="body">
      <div
        v-if="showAddJurisdictionModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
        @click.self="closeAddJurisdictionModal"
      >
        <div class="relative w-full max-w-[640px] rounded-2xl bg-white shadow-xl">
          <button
            @click="closeAddJurisdictionModal"
            class="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
          >
           <X :size="18"/>
          </button>

          <div class="p-10">
            <div class="mb-8">
              <h3 class="mb-2 text-xl font-bold text-[#080808]">Add Jurisdiction</h3>
              <p class="text-sm text-[#6B7280]">Add a new jurisdiction to monitor for this project</p>
            </div>

            <form @submit.prevent="() => {}" class="space-y-6">
              <div class="relative">
                <input
                  id="jurisdictionName"
                  placeholder="e.g. United Kingdom"
                  required
                  class="peer h-[52px] w-full rounded-lg border border-[#D5D7DA] px-4 pt-5 pb-3 text-sm text-gray-900 placeholder-[#717680] focus:border-[#401903] focus:outline-none focus:ring-2 focus:ring-[#401903]/20"
                />
                <label
                  for="jurisdictionName"
                  class="pointer-events-none absolute left-3 top-2.5 origin-left -translate-y-6 scale-75 transform bg-white px-1 text-xs font-medium text-[#1F1F1F] transition-all duration-200
                         peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-[#717680]
                         peer-focus:top-2.5 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-[#401903]"
                >
                  Jurisdiction Name
                </label>
              </div>

              <div class="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  @click="closeAddJurisdictionModal"
                  class="rounded-lg border border-[#F1A75F] px-5 py-2.5 text-sm font-medium text-[#F1A75F] hover:bg-orange-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#2a1102]"
                >
                  Add Jurisdiction
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>
  </main>
</template>