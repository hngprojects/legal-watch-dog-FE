<script setup lang="ts">
import { reactive, watch, defineProps, defineEmits } from 'vue'

interface JurisdictionForm {
  name: string
  description: string
  subJurisdictions: string[]
}

// Props
const props = defineProps<{
  modelValue: boolean
  formData: JurisdictionForm
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: JurisdictionForm): void
}>()

// Create a local reactive copy of formData
const localFormData = reactive({ ...props.formData })

// Keep localFormData in sync when modal opens
watch(
  () => props.modelValue,
  (val) => {
    if (val) Object.assign(localFormData, props.formData)
  },
)

// Methods
const closeModal = () => emit('update:modelValue', false)

const handleSubmit = () => {
  emit('submit', { ...localFormData })
  closeModal()
}

const addSubJurisdiction = () => {
  localFormData.subJurisdictions.push('')
}

const removeSubJurisdiction = (index: number) => {
  localFormData.subJurisdictions.splice(index, 1)
}
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50" @click="closeModal"></div>

      <!-- Modal Card -->
      <div class="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <!-- Close Button -->
        <button
          @click="closeModal"
          class="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" x2="6" y1="6" y2="18" />
            <line x1="6" x2="18" y1="6" y2="18" />
          </svg>
        </button>

        <!-- Modal Content -->
        <div class="p-8">
          <h2 class="mb-1 text-2xl font-semibold text-gray-900">Define your Jurisdiction</h2>
          <p class="mb-8 text-sm text-gray-500">
            Define a specific legal domain or region to monitor
          </p>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Jurisdiction Name -->
            <fieldset class="rounded-lg border border-gray-300 p-4">
              <legend class="px-2 text-xs text-gray-600">Jurisdiction Name</legend>
              <input
                v-model="localFormData.name"
                type="text"
                placeholder="e.g Global Visa Monitoring"
                required
                class="w-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
              />
            </fieldset>

            <!-- Description -->
            <fieldset class="rounded-lg border border-gray-300 p-4">
              <legend class="px-2 text-xs text-gray-600">Instruction/Description</legend>
              <textarea
                v-model="localFormData.description"
                rows="3"
                placeholder="What legal areas will you monitor?"
                class="w-full resize-none text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
              />
            </fieldset>

            <!-- Add Sub-Jurisdictions -->
            <button
              type="button"
              @click="addSubJurisdiction"
              class="flex items-center text-sm text-gray-700 transition-colors hover:text-gray-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="12" x2="12" y1="5" y2="19"></line>
                <line x1="5" x2="19" y1="12" y2="12"></line>
              </svg>
              Add Sub-Jurisdictions (Optional)
            </button>

            <!-- Sub-Jurisdiction List -->
            <div
              v-for="(sub, index) in localFormData.subJurisdictions"
              :key="index"
              class="flex items-center gap-3"
            >
              <fieldset class="flex-1 rounded-lg border border-gray-300 p-4">
                <legend class="px-2 text-xs text-gray-600">Sub-Jurisdiction {{ index + 1 }}</legend>
                <input
                  v-model="localFormData.subJurisdictions[index]"
                  type="text"
                  :placeholder="`Sub-Jurisdiction ${index + 1}`"
                  class="w-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </fieldset>
              <button
                type="button"
                @click="removeSubJurisdiction(index)"
                class="text-sm text-gray-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>

            <!-- Action Buttons -->
            <div class="mt-8 flex justify-end gap-3">
              <button
                type="button"
                @click="closeModal"
                class="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                class="rounded-lg px-6 py-2.5 text-white shadow-sm"
                style="background-color: #551d0c"
              >
                Create Jurisdiction
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
fieldset {
  position: relative;
}
legend {
  margin-left: -0.5rem;
}
</style>
