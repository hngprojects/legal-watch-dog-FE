<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { badgeVariants } from './index'
import type { BadgeVariants } from './index'

const props = withDefaults(
  defineProps<{
    variant?: BadgeVariants['variant']
    size?: 'sm' | 'md'
  }>(),
  {
    variant: 'default',
    size: 'sm',
  },
)

const classes = computed(() => {
  return cn(
    badgeVariants({ variant: props.variant }),
    props.size === 'sm' && 'text-xs px-2 py-0.5',
    props.size === 'md' && 'text-sm px-3 py-1',
  )
})
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
