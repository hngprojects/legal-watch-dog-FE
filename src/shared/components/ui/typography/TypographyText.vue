<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/shared/lib/utils'

type Align = 'left' | 'center' | 'right'
type Tone = 'default' | 'muted'

const props = withDefaults(
  defineProps<{
    align?: Align
    tone?: Tone
    as?: 'p' | 'span'
    class?: HTMLAttributes['class']
  }>(),
  {
    align: 'left',
    tone: 'default',
    as: 'p',
  },
)

const alignClasses: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const toneClasses: Record<Tone, string> = {
  default: 'text-[#2a1d15]',
  muted: 'text-muted-foreground',
}

const tagName = computed(() => props.as)
const classes = computed(() =>
  cn(
    'text-base leading-[1.65] text-balance',
    alignClasses[props.align],
    toneClasses[props.tone],
    props.class,
  ),
)
</script>

<template>
  <component :is="tagName" :class="classes">
    <slot />
  </component>
</template>
