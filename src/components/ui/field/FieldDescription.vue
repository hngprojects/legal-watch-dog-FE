<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <p
    data-slot="field-description"
    :class="
      cn(
        'text-sm leading-normal font-normal text-neutral-500 group-has-[[data-orientation=horizontal]]/field:text-balance dark:text-neutral-400',
        'last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5',
        '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-neutral-900 dark:[&>a:hover]:text-neutral-50',
        props.class,
      )
    "
  >
    <slot />
  </p>
</template>
