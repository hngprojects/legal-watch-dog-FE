<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

type Level = 'h1' | 'h2' | 'h3'
type Align = 'left' | 'center' | 'right'

const props = withDefaults(
  defineProps<{
    level?: Level
    align?: Align
    class?: HTMLAttributes['class']
  }>(),
  {
    level: 'h1',
    align: 'left',
  },
)

const levelClasses: Record<Level, string> = {
  h1: 'scroll-m-20 text-[clamp(2.5rem,5vw,3.75rem)] font-bold tracking-tight text-[#2a0d00]',
  h2: 'scroll-m-20 text-[clamp(2rem,4vw,3rem)] font-semibold tracking-tight text-[#2a0d00]',
  h3: 'scroll-m-20 text-[clamp(1.5rem,3vw,2.25rem)] font-semibold tracking-tight text-[#2a0d00]',
}

const alignClasses: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const tagName = computed(() => props.level)
const classes = computed(() =>
  cn('leading-tight', levelClasses[props.level], alignClasses[props.align], props.class),
)
</script>

<template>
  <component :is="tagName" :class="classes">
    <slot />
  </component>
</template>
