<script setup lang="ts">
import LogoMark from '@/components/atoms/LogoMark.vue'

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
    <LogoMark />
    <span class="text-xl font-bold leading-none">{{ label }}</span>
  </div>
</template>
