<script setup lang="ts">
import GlobalConfirmDialog from './components/ui/GlobalConfirmDialog.vue'
import { Toaster } from '@/components/ui/sonner/index'
</script>

<template>
  <RouterView />
  <Toaster position="top-right" rich-colors />
  <GlobalConfirmDialog />
</template>
