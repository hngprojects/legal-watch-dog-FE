<script setup lang="ts">
import AuthBranding from '@/components/authentication/AuthBranding.vue';

</script>

<template>
  <main class="min-h-screen bg-gray-50 flex">
    <AuthBranding />

    <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
      <slot />
    </div>
  </main>
</template>
