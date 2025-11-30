<script setup lang="ts">
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
  DialogTitle,
} from '@/components/ui/dialog'

defineProps<{
  open: boolean
  form: { name: string; description: string; prompt: string }
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save'): void
  (e: 'cancel'): void
  (e: 'update:form', payload: Partial<{ name: string; description: string; prompt: string }>): void
}>()
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogScrollContent class="sm:max-w-[560px]">
      <DialogHeader>
        <DialogTitle>Edit Jurisdiction</DialogTitle>
        <DialogDescription>Update the name, description, and instructions.</DialogDescription>
      </DialogHeader>

      <form @submit.prevent="emit('save')" class="space-y-4">
        <div>
          <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">Name</label>
          <input
            :value="form.name"
            class="h-12 w-full rounded-lg border px-4 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
            @input="emit('update:form', { name: ($event.target as HTMLInputElement).value })"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">Description</label>
          <textarea
            :value="form.description"
            rows="3"
            class="w-full rounded-lg border px-4 py-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
            @input="
              emit('update:form', { description: ($event.target as HTMLTextAreaElement).value })
            "
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-[#1F1F1F]">Instructions</label>
          <textarea
            :value="form.prompt"
            rows="3"
            class="w-full rounded-lg border px-4 py-3 text-sm focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
            @input="emit('update:form', { prompt: ($event.target as HTMLTextAreaElement).value })"
          />
        </div>

        <DialogFooter class="flex justify-end gap-3 pt-2">
          <button type="button" class="btn--secondary btn--lg" @click="emit('cancel')">
            Cancel
          </button>
          <button type="submit" class="btn--primary btn--lg">Save Changes</button>
        </DialogFooter>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>
