<script setup lang="ts">
import GlobalConfirmDialog from './components/ui/GlobalConfirmDialog.vue'
import { Toaster } from '@/components/ui/sonner/index'
import { onMounted } from 'vue'

onMounted(() => {
  const loadingScreen = document.getElementById('loading-screen')
  if (loadingScreen) {
    loadingScreen.style.opacity = '0'
    loadingScreen.style.transition = 'opacity 0.3s ease-out'
    setTimeout(() => {
      loadingScreen.remove()
    }, 300)
  }
})
</script>

<template>
  <RouterView />
  <Toaster position="top-right" rich-colors />
  <GlobalConfirmDialog />
</template>
