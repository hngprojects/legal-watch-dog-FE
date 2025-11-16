<script setup lang="ts">
import HeroSection from '@/components/organisms/HeroSection.vue'
import HowItWorks from '@/components/organisms/HowItWorks.vue'
import MainHeader from '@/components/organisms/MainHeader.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col gap-6">
    <MainHeader />
    <HeroSection />
    <HowItWorks />
  </div>
</template>
