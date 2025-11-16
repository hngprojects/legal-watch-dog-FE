<script setup lang="ts">
import HeroSection from '@/components/organisms/HeroSection.vue'
import MainHeader from '@/components/organisms/MainHeader.vue'
import FeaturesSection from '@/components/organisms/FeaturesSection.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col gap-6">
    <MainHeader />
    <HeroSection />
    <FeaturesSection />
  </div>
</template>