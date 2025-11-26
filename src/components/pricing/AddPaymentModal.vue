<script setup lang="ts">
import Dialog from '../ui/dialog/Dialog.vue'
import DialogContent from '../ui/dialog/DialogContent.vue'
import DialogDescription from '../ui/dialog/DialogDescription.vue'
import DialogHeader from '../ui/dialog/DialogHeader.vue'
import DialogTrigger from '../ui/dialog/DialogTrigger.vue'
</script>

<template>
  <Dialog>
    <DialogTrigger asChild>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader> Add Payment Method </DialogHeader>
      <DialogDescription>Enter your payment details.</DialogDescription>
    </DialogContent>
  </Dialog>
</template>
