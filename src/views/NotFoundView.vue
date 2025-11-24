<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Button from '@/components/ui/button/Button.vue'
</script>

<template>
  <main
    class="flex h-screen w-screen flex-col items-center justify-center gap-6 bg-gray-50 p-4 text-center"
  >
    <div class="flex flex-col items-center justify-center gap-4">
      <h1 class="text-8xl font-bold tracking-tighter text-gray-800">404</h1>
      <p class="text-2xl font-semibold text-gray-600">Page Not Found</p>
      <p class="max-w-md text-gray-500">
        Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or
        maybe you just mistyped the URL.
      </p>
    </div>
    <Button as-child class="text-white">
      <RouterLink to="/">Go Back Home</RouterLink>
    </Button>
  </main>
</template>
