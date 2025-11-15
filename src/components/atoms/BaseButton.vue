<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    as?: 'button' | 'a'
    href?: string
    variant?: 'primary' | 'ghost'
    size?: 'md' | 'lg'
  }>(),
  {
    as: 'button',
    variant: 'primary',
    size: 'md',
  },
)

const componentTag = computed(() => props.as)

const baseClasses =
  'inline-flex items-center justify-center rounded-[8px] font-semibold text-[0.95rem] text-[#2a0d00] transition duration-200 ease-out hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#4b1e00] cursor-pointer select-none'

const variantClasses: Record<'primary' | 'ghost', string> = {
  primary:
    'border border-transparent bg-[#4b1e00] text-white shadow-[0_15px_35px_rgba(75,30,0,0.2)] hover:bg-[#3d1900]',
  ghost:
    'border border-[#4b1e004d] bg-transparent text-[#4b1e00] hover:bg-[#4b1e000d]',
}

const sizeClasses: Record<'md' | 'lg', string> = {
  md: 'px-6 py-2',
  lg: 'px-10 py-3 text-base',
}

const buttonClasses = computed(() => [baseClasses, variantClasses[props.variant], sizeClasses[props.size]])
</script>

<template>
  <component
    :is="componentTag"
    :href="componentTag === 'a' ? href : undefined"
    :type="componentTag === 'button' ? 'button' : undefined"
    :class="buttonClasses"
  >
    <slot />
  </component>
</template>
