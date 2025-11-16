<script setup lang="ts">
import HeroSection from '@/components/organisms/HeroSection.vue'
import HowItWorks from '@/components/organisms/HowItWorks.vue'
import MainHeader from '@/components/organisms/MainHeader.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col gap-6">
    <MainHeader />

    <div class="px-4 md:px-10 lg:px-24">
      <HeroSection />
      <HowItWorks />
    </div>
  </div>
</template>
