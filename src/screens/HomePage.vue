<script setup lang="ts">
import HeroSection from '@/components/organisms/HeroSection.vue'
import MainHeader from '@/components/organisms/MainHeader.vue'
import DashboardPreview from '@/components/organisms/DashboardPreview.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col gap-6">
    <MainHeader />
    <HeroSection />
    <DashboardPreview />
  </div>
</template>
