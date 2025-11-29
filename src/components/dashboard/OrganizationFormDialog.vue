<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps<{
  open: boolean
  title?: string
  submitLabel?: string
  initialName?: string
  initialIndustry?: string
  error?: string | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', payload: { name: string; industry: string }): void
}>()

const form = reactive({
  name: props.initialName ?? '',
  industry: props.initialIndustry ?? '',
})

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      form.name = props.initialName ?? ''
      form.industry = props.initialIndustry ?? ''
    }
  },
)

watch(
  () => props.initialName,
  (val) => {
    if (props.open) form.name = val ?? ''
  },
)
watch(
  () => props.initialIndustry,
  (val) => {
    if (props.open) form.industry = val ?? ''
  },
)

const isValid = computed(() => form.name.trim().length > 0 && form.industry.trim().length > 0)

const industries = [
  'Government, Politics & Public Sector',
  'Law, Regulation & Compliance',
  'Business, Finance & Professional Services',
  'Technology, Media & Telecommunications',
  'Health, Science & Education',
  'Energy, Environment & Infrastructure',
  'Manufacturing, Trade & Logistics',
]

const handleSubmit = () => {
  if (!isValid.value || props.loading) return
  emit('save', {
    name: form.name.trim(),
    industry: form.industry.trim(),
  })
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogScrollContent class="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle>{{ title || 'Organization' }}</DialogTitle>
        <DialogDescription>Update organization details.</DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <Field>
          <FieldLabel class="text-sm font-medium text-gray-900">Name</FieldLabel>
          <FieldContent>
            <Input
              v-model="form.name"
              placeholder="Organization name"
              class="h-11"
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel class="text-sm font-medium text-gray-900">Industry</FieldLabel>
          <FieldContent>
            <Select v-model="form.industry">
              <SelectTrigger class="h-11 w-full">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="industry in industries" :key="industry" :value="industry">
                  {{ industry }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      </div>

      <DialogFooter class="pt-4">
        <button
          type="button"
          class="btn--secondary btn--lg"
          @click="emit('update:open', false)"
          :disabled="loading"
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn--primary btn--lg disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="!isValid || loading"
          @click="handleSubmit"
        >
          <span v-if="loading">Saving...</span>
          <span v-else>{{ submitLabel || 'Save' }}</span>
        </button>
      </DialogFooter>
    </DialogScrollContent>
  </Dialog>
</template>
