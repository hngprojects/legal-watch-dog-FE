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
  (e: 'update:form', payload: Partial<{ name: string; description: string; prompt: string }>): void
  (e: 'submit'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogScrollContent class="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle>Define your Sub-Jurisdiction</DialogTitle>
        <DialogDescription>Define a specific legal domain or region to monitor</DialogDescription>
      </DialogHeader>

      <form @submit.prevent="emit('submit')" class="space-y-5">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-900">Sub-Jurisdiction Name</label>
          <input
            :value="form.name"
            type="text"
            required
            placeholder="e.g Global Visa Monitoring"
            class="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm placeholder-gray-400 focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
            @input="emit('update:form', { name: ($event.target as HTMLInputElement).value })"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm font-medium text-gray-900">Description</label>
          <textarea
            :value="form.description"
            rows="4"
            required
            placeholder="What legal areas will you monitor?"
            class="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder-gray-400 focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/20 focus:outline-none"
            @input="
              emit('update:form', { description: ($event.target as HTMLTextAreaElement).value })
            "
          ></textarea>
        </div>

        <DialogFooter class="flex justify-end gap-3 pt-4">
          <button type="button" class="btn--secondary btn--lg" @click="emit('cancel')">
            Cancel
          </button>

          <button type="submit" class="btn--primary btn--lg">Create Sub-Jurisdiction</button>
        </DialogFooter>
      </form>
    </DialogScrollContent>
  </Dialog>
</template>
