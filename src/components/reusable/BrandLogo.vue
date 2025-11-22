<script setup lang="ts">
import LogoImage from '@/assets/images/logo.png'

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
      class="h-11 w-11 shrink-0 rounded-full shadow-[0_15px_30px_rgba(75,30,0,0.2)]"
    />
    <span class="text-xl leading-none font-bold">{{ label }}</span>
  </div>
</template>
