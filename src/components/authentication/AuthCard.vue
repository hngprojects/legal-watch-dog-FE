<template>
  <div>
    <div class="mb-8 text-center lg:hidden">
      <h1 class="text-accent-subtle text-2xl font-bold">Legal WatchDog</h1>
    </div>
    <div class="mb-12">
      <h2 class="mb-2 text-3xl text-[56px] font-semibold text-gray-900">{{ headerText }}</h2>
      <slot name="desc" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  headerText?: string
}>()
</script>
