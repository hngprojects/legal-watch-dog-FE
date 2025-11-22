<template>
  <div>
    <div class="mb-8 text-center lg:hidden">
      <h1 class="text-2xl font-bold text-accent-subtle">Legal WatchDog</h1>
    </div>
    <div class="mb-12">
      <h2 class="mb-2 text-3xl text-gray-900 font-semibold text-[56px]">{{ headerText }}</h2>
      <slot name="desc" />
    </div>
      <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  headerText?: string;
}>();
</script>
