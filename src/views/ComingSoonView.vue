<script setup lang="ts">
import comingSoonImg from '@/assets/Images/coming-soon.webp';
import MainHeader from '@/components/landing-page/MainHeader.vue';
import MainFooter from '@/components/landing-page/MainFooter.vue';
import Button from '@/components/ui/button/Button.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <MainHeader />

    <main class="flex-1 flex flex-col gap-8 text-center justify-center items-center px-4">
      <img :src="comingSoonImg" alt="Coming Soon Illustration" class="w-11/12 md:w-3/5 lg:w-2/5" />

      <div>
        <h1 class="text-5xl md:text-7xl font-bold text-primary mb-2">Coming Soon</h1>
        <p class="text-lg md:text-xl text-muted-foreground">
          We're working hard to bring you this experience. Stay tuned!
        </p>
      </div>

      <RouterLink to="/waitlist" class="inline-flex">
        <Button class="cursor-pointer">Join the List</Button>
      </RouterLink>
    </main>

    <MainFooter />
  </div>
</template>
