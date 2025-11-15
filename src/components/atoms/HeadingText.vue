<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    tag?: 'h1' | 'h2' | 'h3'
    align?: 'left' | 'center' | 'right'
  }>(),
  {
    tag: 'h1',
    align: 'left',
  },
)

const tagName = computed(() => props.tag)

const alignClasses: Record<'left' | 'center' | 'right', string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const sizeClasses: Record<'h1' | 'h2' | 'h3', string> = {
  h1: 'text-[clamp(2.5rem,5vw,3.75rem)]',
  h2: 'text-[clamp(2rem,4vw,3rem)]',
  h3: 'text-[clamp(1.5rem,3vw,2.25rem)]',
}

const headingClasses = computed(() => [
  'm-0 font-bold leading-tight text-[#2a0d00]',
  alignClasses[props.align],
  sizeClasses[props.tag],
])
</script>

<template>
  <component :is="tagName" :class="headingClasses">
    <slot />
  </component>
</template>
