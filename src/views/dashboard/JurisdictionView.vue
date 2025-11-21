<template>
  <div class="grid lg:grid-cols-[400px,1fr] gap-8">
    <JurisdictionForm
      :jurisdictions="jurisdictions"
      :editingId="editingId"
      @updateJurisdictions="updateJurisdictions"
    />
    <JurisdictionList
      :jurisdictions="jurisdictions"
      :editingId="editingId"
      @editJurisdiction="populateForm"
      @updateJurisdictions="updateJurisdictions"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JurisdictionForm from '@/components/reusable/JurisdictionForm.vue'
import JurisdictionList from '@/components/reusable/JurisdictionList.vue'

interface Jurisdiction {
  id: string
  name: string
  description: string
  subJurisdictions: string[]
  created_at: string
}

const jurisdictions = ref<Jurisdiction[]>([])
const editingId = ref<string | null>(null)

const updateJurisdictions = (updated: Jurisdiction[]) => {
  jurisdictions.value = updated
}

const populateForm = (jurisdiction: Jurisdiction) => {
  editingId.value = jurisdiction.id
}
</script>