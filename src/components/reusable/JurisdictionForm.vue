<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 rounded-2xl border bg-white p-6 shadow-lg">
    <h2 class="text-xl font-bold">{{ formHeading }}</h2>

    <div class="space-y-4">
      <input v-model="formState.name" type="text" placeholder="Jurisdiction Name" class="w-full rounded border px-3 py-2" />
      <textarea v-model="formState.description" placeholder="Description" rows="4" class="w-full rounded border px-3 py-2"></textarea>

      <div v-for="(sub, idx) in formState.subJurisdictions" :key="idx" class="flex gap-2">
        <input v-model="formState.subJurisdictions[idx]" placeholder="Sub-Jurisdiction" class="flex-1 rounded border px-2 py-1" />
        <button type="button" @click="removeSubJurisdiction(idx)">Remove</button>
      </div>

      <button type="button" @click="addSubJurisdiction">Add Sub-Jurisdiction</button>
    </div>

    <div class="flex gap-2">
      <button type="submit" :disabled="isSaving">{{ editingId ? 'Update' : 'Create' }}</button>
      <button type="button" @click="resetForm">Reset</button>
    </div>

    <p v-if="error" class="text-red-600">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

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
}>()

const emit = defineEmits<{
  (e: 'updateJurisdictions', payload: Jurisdiction[]): void
}>()

const editingId = ref<string | null>(props.editingId)
const isSaving = ref(false)
const error = ref<string | null>(null)

const formState = reactive({
  name: '',
  description: '',
  subJurisdictions: [] as string[],
})

const formHeading = computed(() => (editingId.value ? 'Update Jurisdiction' : 'Create Jurisdiction'))

const resetForm = () => {
  editingId.value = null
  formState.name = ''
  formState.description = ''
  formState.subJurisdictions = []
}

const populateForm = (jurisdiction: Jurisdiction) => {
  editingId.value = jurisdiction.id
  formState.name = jurisdiction.name
  formState.description = jurisdiction.description
  formState.subJurisdictions = [...jurisdiction.subJurisdictions]
}

const addSubJurisdiction = () => formState.subJurisdictions.push('')
const removeSubJurisdiction = (idx: number) => formState.subJurisdictions.splice(idx, 1)

const handleSubmit = () => {
  if (!formState.name.trim() || !formState.description.trim()) {
    error.value = 'Name and description are required.'
    return
  }

  isSaving.value = true
  error.value = null

  try {
    const cleanedSubJurisdictions = formState.subJurisdictions.filter(s => s.trim() !== '')

    if (editingId.value) {
      // Update existing jurisdiction
      const existingJurisdiction = props.jurisdictions.find(j => j.id === editingId.value)
      
      if (existingJurisdiction) {
        const updatedJurisdiction: Jurisdiction = {
          id: existingJurisdiction.id,
          name: formState.name.trim(),
          description: formState.description.trim(),
          subJurisdictions: cleanedSubJurisdictions,
          created_at: existingJurisdiction.created_at,
        }
        
        // Find index and update
        const idx = props.jurisdictions.indexOf(existingJurisdiction)
        if (idx !== -1) {
          props.jurisdictions[idx] = updatedJurisdiction
        }
      }
    } else {
      const newJurisdiction: Jurisdiction = {
        id: `jur_${Date.now()}`,
        name: formState.name.trim(),
        description: formState.description.trim(),
        subJurisdictions: cleanedSubJurisdictions,
        created_at: new Date().toISOString(),
      }
      props.jurisdictions.unshift(newJurisdiction)
    }

    resetForm()
    emit('updateJurisdictions', [...props.jurisdictions])
  } catch (err) {
    error.value = 'An error occurred while saving.'
    console.error(err)
  } finally {
    isSaving.value = false
  }
}

defineExpose({ populateForm, resetForm })
</script>