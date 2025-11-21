<template>
  <div class="space-y-4">
    <div v-for="jurisdiction in paginatedJurisdictions" :key="jurisdiction.id" class="border rounded p-4">
      <h3 class="font-bold">{{ jurisdiction.name }}</h3>
      <p>{{ jurisdiction.description }}</p>
      <div v-if="jurisdiction.subJurisdictions.length">
        <small>Sub-Jurisdictions: {{ jurisdiction.subJurisdictions.join(', ') }}</small>
      </div>
      <div class="flex gap-2 mt-2">
        <button @click="populateForm(jurisdiction)">Edit</button>
        <button @click="handleDelete(jurisdiction.id)">Delete</button>
      </div>
    </div>

    <div class="flex gap-2 mt-4">
      <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Prev</button>
      <button v-for="page in totalPages" :key="page" @click="goToPage(page)">{{ page }}</button>
      <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Jurisdiction {
  id: string
  name: string
  description: string
  subJurisdictions: string[]
  created_at: string
}

const props = defineProps<{
  jurisdictions: Jurisdiction[]
  editingId: string | null
}>();

const emit = defineEmits<{
  (e: 'editJurisdiction', payload: Jurisdiction): void
  (e: 'updateJurisdictions', payload: Jurisdiction[]): void
}>()

const currentPage = ref(1)
const itemsPerPage = ref(10)

const totalPages = computed(() => Math.ceil(props.jurisdictions.length / itemsPerPage.value))
const paginatedJurisdictions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return props.jurisdictions.slice(start, start + itemsPerPage.value)
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

const populateForm = (jurisdiction: Jurisdiction) => {
  emit('editJurisdiction', jurisdiction)
}

const handleDelete = (id: string) => {
  const confirmed = window.confirm('Remove this jurisdiction?')
  if (!confirmed) return
  const updated = props.jurisdictions.filter(j => j.id !== id)
  emit('updateJurisdictions', updated)
}
</script>