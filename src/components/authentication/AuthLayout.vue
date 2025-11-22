<script setup lang="ts">
import AuthBranding from '@/components/authentication/AuthBranding.vue'

defineProps<{
  wrapperClass?: string
  mainClass?: string
  containerClass?: string
}>()
</script>

<template>
  <div :class="['flex min-h-screen flex-col bg-white', wrapperClass]">
    <main :class="['relative flex flex-1', mainClass]">
      <AuthBranding />
      <div :class="['flex w-full items-center justify-center p-4', containerClass]">
        <div class="max-w-[600px]">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>
