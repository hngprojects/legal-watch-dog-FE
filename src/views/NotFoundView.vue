<script setup lang="ts">
import comingSoonImg from '@/assets/Images/coming-soon.webp'
import Button from '@/components/ui/button/Button.vue'
</script>

<template>
  <main class="flex flex-col gap-8 text-center justify-center items-center w-screen h-screen">
    <img :src="comingSoonImg" alt="Coming Soon Illustration" class="w-11/12 md:w-3/5 lg:w-2/5" />

    <div>
      <h1 class="text-7xl font-bold text-primary mb-2">Coming Soon</h1>
      <p class="text-xl text-muted-foreground text-center">
        We're working hard to bring you this feature. Stay tuned!
      </p>
    </div>
    <Button>Join the Waitlist</Button>
  </main>
</template>
