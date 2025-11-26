<script lang="ts" setup>
import type { HTMLAttributes } from "vue"
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <span
    data-slot="breadcrumb-page"
    role="link"
    aria-disabled="true"
    aria-current="page"
    :class="cn('text-neutral-950 font-normal dark:text-neutral-50', props.class)"
  >
    <slot />
  </span>
</template>
