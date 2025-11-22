<template>
  <div :class="alertClasses" class="rounded-lg p-4" role="alert">
    <div class="flex gap-3">
      <div v-if="showIcon" class="shrink-0">
        <img :src="iconSrc" :alt="props.variant + ' icon'" class="h-5 w-5" />
      </div>
      <div class="flex-1">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'

export type AlertVariant = 'default' | 'destructive' | 'warning' | 'success'

interface AlertProps {
  variant?: AlertVariant
  showIcon?: boolean
}

const props = withDefaults(defineProps<AlertProps>(), {
  variant: 'default',
  showIcon: true,
})

// --- Styles ---
const variantStyles: Record<AlertVariant, string> = {
  default: 'bg-blue-50 border border-blue-200',
  destructive: 'bg-red-50 border border-red-200',
  warning: 'bg-orange-50 border border-orange-200',
  success: 'bg-green-50 border border-green-200',
}

// --- Icon Images ---
const iconMap: Record<AlertVariant, string> = {
  default: '/icons/security.png',
  destructive: '/icons/x-circle.png',
  warning: '/icons/alert-circle.png',
  success: '/icons/check-circle.png',
}

// --- Computed ---
const alertClasses = computed(() => variantStyles[props.variant])
const iconSrc = computed(() => iconMap[props.variant])

// Provide variant to child components if needed
provide('alertVariant', props.variant)
</script>
