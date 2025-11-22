<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { ArrowLeftIcon, ChevronRight } from 'lucide-vue-next'
import { useJurisdictionStore } from '@/stores/jurisdiction-store'
import type { Jurisdiction } from '@/api/jurisdiction'

const route = useRoute()
const router = useRouter()
const jurisdictionStore = useJurisdictionStore()
const jurisdictionId = route.params.id as string
const jurisdiction = ref<Jurisdiction | null>(null)
const loading = ref(true)

const goBack = () => {
  router.back()
}

onMounted(() => {
  jurisdiction.value = jurisdictionStore.jurisdictions.find((j) => j.id === jurisdictionId) || null
  loading.value = false
})
</script>

<template>
  <main class="min-h-screen flex-1 bg-gray-50 p-6 lg:p-10">
    <div v-if="loading" class="mx-auto max-w-7xl animate-pulse">
      <div class="mb-8 h-6 w-64 rounded bg-gray-200"></div>
      <div class="h-10 w-96 rounded bg-gray-200"></div>
    </div>

    <div v-else-if="!jurisdiction" class="mx-auto max-w-7xl py-16 text-center">
      <h1 class="mb-4 text-2xl font-bold text-gray-900">Jurisdiction not found</h1>
      <button @click="goBack" class="cursor-pointer text-[#401903] hover:underline">Back</button>
    </div>

    <div v-else class="mx-auto max-w-7xl">
      <nav class="mb-8 flex items-center gap-2 text-sm">
        <button
          @click="goBack"
          class="flex cursor-pointer items-center gap-2 text-gray-500 transition-colors hover:text-gray-700"
        >
          <ArrowLeftIcon :size="18" />
          <span>Back</span>
        </button>
        <ChevronRight :size="18" />
        <span class="font-medium text-[#C17A3F]">{{ jurisdiction.name }}</span>
      </nav>

      <div class="rounded-lg bg-white p-8 shadow-sm">
        <h1 class="mb-3 text-3xl font-bold text-gray-900">{{ jurisdiction.name }}</h1>
        <p class="text-gray-600">{{ jurisdiction.description }}</p>
      </div>
    </div>
  </main>
</template>
