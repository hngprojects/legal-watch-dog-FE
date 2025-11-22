<script setup lang="ts">
import comingSoonImg from '@/assets/images/coming-soon.webp'
import Button from '@/components/ui/button/Button.vue'
</script>

<template>
  <main class="flex h-screen w-screen flex-col items-center justify-center gap-8 text-center">
    <img :src="comingSoonImg" alt="Coming Soon Illustration" class="w-11/12 md:w-3/5 lg:w-2/5" />

    <div>
      <h1 class="text-primary mb-2 text-7xl font-bold">Coming Soon</h1>
      <p class="text-muted-foreground text-center text-xl">
        We're working hard to bring you this feature. Stay tuned!
      </p>
    </div>
    <Button>Join the Waitlist</Button>
  </main>
</template>
