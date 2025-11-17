<script setup lang="ts">
import LogoImage from '@/assets/Images/logo.png'  // Import for optimization (Vite handles)

withDefaults(
  defineProps<{
    label?: string
  }>(),
  {
    label: 'WatchDog',
  },
)
</script>

<template>
  <div class="flex items-center gap-3 text-[#2a0d00]">
    <img
      :src="LogoImage"
      alt="Legal Watchdog Logo"
      class="h-11 w-11 flex-shrink-0 rounded-full shadow-[0_15px_30px_rgba(75,30,0,0.2)]"
    />
    <span class="text-xl font-bold leading-none">{{ label }}</span>
  </div>
</template>