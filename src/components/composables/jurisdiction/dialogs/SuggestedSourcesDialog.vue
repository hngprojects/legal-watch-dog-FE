<script setup lang="ts">
import {
  Dialog,
  DialogDescription,
  DialogScrollContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import SuggestedSources from '@/views/dashboard/sources/SuggestedSources.vue'

defineProps<{
  open: boolean
  jurisdictionId: string
  jurisdictionName: string
  jurisdictionDescription: string
  projectDescription: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'cancel'): void
  (e: 'save', count: number): void
  (e: 'sources-added'): void
}>()
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogScrollContent class="max-w-3xl">
      <DialogHeader>
        <DialogTitle>AI Suggested Sources</DialogTitle>
        <DialogDescription>
          Review and add AI suggested sources. Saved sources will appear in your list instantly.
        </DialogDescription>
      </DialogHeader>
      <SuggestedSources
        :jurisdiction-id="jurisdictionId"
        :jurisdiction-name="jurisdictionName"
        :jurisdiction-description="jurisdictionDescription"
        :project-description="projectDescription"
        @cancel="emit('cancel')"
        @save="emit('save', $event)"
        @sources-added="emit('sources-added')"
      />
    </DialogScrollContent>
  </Dialog>
</template>
