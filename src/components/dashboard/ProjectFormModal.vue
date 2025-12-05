<script setup lang="ts">
import { watch, ref } from 'vue'
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
} from '@/components/ui/dialog'

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
  project?: {
    id?: string
    title?: string
    description?: string
    org_id?: string
    masterPrompt?: string
  }
  error?: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (
    e: 'save',
    payload: {
      title: string
      description: string
      organizationId: string
      projectId?: string
      masterPrompt?: string
    },
  ): void
}>()

const formState = ref({
  title: '',
  description: '',
  organizationId: '',
  masterPrompt: '',
})

const localError = ref<string | null>(null)

const resetState = () => {
  formState.value = {
    title: props.project?.title || '',
    description: props.project?.description || '',
    organizationId:
      props.project?.org_id || props.defaultOrganizationId || props.organizations[0]?.id || '',
    masterPrompt: props.project?.masterPrompt || '',
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
    masterPrompt: formState.value.masterPrompt.trim() || undefined,
  })
}
</script>

<template>
  <Dialog :open="open" @update:open="(value) => !value && handleClose()">
    <DialogScrollContent class="sm:max-w-[540px]">
      <DialogHeader>
        <DialogTitle>{{ mode === 'edit' ? 'Edit Project' : 'Create New Project' }}</DialogTitle>
        <DialogDescription>
          {{
            mode === 'edit' ? 'Update project details.' : 'Set up a new project to track changes.'
          }}
        </DialogDescription>
      </DialogHeader>

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
            placeholder="What areas will you monitor?"
            required
            class="w-full resize-none rounded-lg border border-[#D5D7DA] px-4 py-3 text-sm text-gray-900 placeholder-[#717680] focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
          />
        </div>

        <div>
          <label for="masterPrompt" class="mb-2 block text-sm font-medium text-[#1F1F1F]">
            Master Prompt
          </label>
          <textarea
            v-model="formState.masterPrompt"
            id="masterPrompt"
            rows="3"
            placeholder="Global instructions that apply to all jurisdictions in this project (optional)"
            class="w-full resize-none rounded-lg border border-[#D5D7DA] px-4 py-3 text-sm text-gray-900 placeholder-[#717680] focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
          />
          <p class="mt-1.5 text-xs text-[#717680]">
            Optional instructions that will be inherited by every jurisdiction
          </p>
        </div>

        <div v-if="localError" class="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {{ localError }}
        </div>
        <div v-else-if="error" class="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {{ error }}
        </div>

        <DialogFooter class="flex justify-end gap-3 pt-2">
          <button type="button" @click="handleClose" class="btn--secondary btn--lg">Cancel</button>
          <button type="submit" class="btn--default btn--lg">
            {{ mode === 'edit' ? 'Save Changes' : 'Save Project' }}
          </button>
        </DialogFooter>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>
