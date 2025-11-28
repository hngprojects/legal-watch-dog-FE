<script setup lang="ts">
import { watch, ref } from 'vue'

interface OrganizationOption {
  id: string
  name: string
}

type Mode = 'create' | 'edit'

const props = defineProps<{
  open: boolean
  mode: Mode
  organizations: OrganizationOption[]
  defaultOrganizationId?: string
  project?: { id?: string; title?: string; description?: string; org_id?: string }
  error?: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: { title: string; description: string; organizationId: string; projectId?: string }): void
}>()

const formState = ref({
  title: '',
  description: '',
  organizationId: '',
})

const localError = ref<string | null>(null)

const resetState = () => {
  formState.value = {
    title: props.project?.title || '',
    description: props.project?.description || '',
    organizationId: props.project?.org_id || props.defaultOrganizationId || props.organizations[0]?.id || '',
  }
  localError.value = null
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      resetState()
    }
  },
)

const handleClose = () => {
  emit('close')
  localError.value = null
}

const handleSubmit = () => {
  localError.value = null
  if (!formState.value.title.trim()) {
    localError.value = 'Project name is required'
    return
  }
  if (!formState.value.description.trim()) {
    localError.value = 'Description is required'
    return
  }
  emit('save', {
    title: formState.value.title.trim(),
    description: formState.value.description.trim(),
    organizationId: formState.value.organizationId,
    projectId: props.project?.id,
  })
}
</script>

<template>
  <teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]"
      @click.self="handleClose"
    >
      <div class="relative w-full max-w-[540px] rounded-sm bg-white shadow-xl">
        <button
          @click="handleClose"
          class="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L13 13M13 1L1 13"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <div class="p-8">
          <div class="mb-6">
            <h3 class="mb-2 text-xl font-bold text-[#080808]">
              {{ mode === 'edit' ? 'Edit Project' : 'Create New Project' }}
            </h3>
            <p class="text-sm text-[#6B7280]">
              {{ mode === 'edit' ? 'Update project details.' : 'Set up a new project to track changes.' }}
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div>
              <label for="projName" class="mb-2 block text-sm font-medium text-[#1F1F1F]">
                Project Name
              </label>
              <input
                v-model="formState.title"
                id="projName"
                placeholder="e.g Global Visa Monitoring"
                required
                class="h-12 w-full rounded-lg border border-[#D5D7DA] px-4 text-sm text-gray-900 placeholder-[#717680] focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
              />
              <p class="mt-1.5 text-xs text-[#717680]">Give your project a descriptive name</p>
            </div>

            <div>
              <label for="desc" class="mb-2 block text-sm font-medium text-[#1F1F1F]">
                Description
              </label>
              <textarea
                v-model="formState.description"
                id="desc"
                rows="3"
                placeholder="What legal areas will you monitor?"
                required
                class="w-full resize-none rounded-lg border border-[#D5D7DA] px-4 py-3 text-sm text-gray-900 placeholder-[#717680] focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
              />
            </div>

            <div v-if="localError" class="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {{ localError }}
            </div>
            <div v-else-if="error" class="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {{ error }}
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                @click="handleClose"
                class="cursor-pointer rounded-lg border border-[#F1A75F] px-5 py-2.5 text-sm font-medium text-[#F1A75F] hover:bg-orange-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="cursor-pointer rounded-lg bg-[#401903] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#2a1102]"
              >
                {{ mode === 'edit' ? 'Save Changes' : 'Save Project' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </teleport>
</template>
