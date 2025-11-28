<script setup lang="ts">
import Features from '@/components/landing-page/Features.vue'
import MainFooter from '@/components/landing-page/MainFooter.vue'
import MainHeader from '@/components/landing-page/MainHeader.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <MainHeader />
    <main class="mx-auto flex w-full flex-1 flex-col">
      <Features />
    </main>
    <MainFooter />
  </div>
</template>
