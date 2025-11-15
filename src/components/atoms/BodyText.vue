<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    align?: 'left' | 'center' | 'right'
    tone?: 'default' | 'muted'
  }>(),
  {
    align: 'left',
    tone: 'default',
  },
)

const alignClasses: Record<'left' | 'center' | 'right', string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const toneClasses: Record<'default' | 'muted', string> = {
  default: 'text-[#2a1d15]',
  muted: 'text-[#6c5b52]',
}

const classes = computed(() => [
  'm-0 text-[1.05rem] leading-[1.65]',
  alignClasses[props.align],
  toneClasses[props.tone],
])
</script>

<template>
  <p :class="classes">
    <slot />
  </p>
</template>
