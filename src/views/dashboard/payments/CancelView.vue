<script setup lang="ts">
import Dialog from '@/components/ui/dialog/Dialog.vue'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue'
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue'
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import XIcon from '@/assets/icons/checkmark-circle-2.svg'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoHome = async () => {
  router.push({ name: 'dashboard' })
}
</script>

<template>
  <Dialog defaultOpen>
    <DialogContent>
      <DialogHeader class="text-center">
        <img :src="XIcon" class="mx-auto size-[118px]" alt="" />

        <DialogTitle> Payment Failed </DialogTitle>
        <DialogDescription class="py-4">
          Something went wrong while processing your payment
        </DialogDescription>
      </DialogHeader>
      <DialogFooter class="flex w-full flex-row items-center justify-center! gap-4 text-center">
        <button class="btn--primary btn--md" @click="handleGoHome">Return to Dashboard</button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
