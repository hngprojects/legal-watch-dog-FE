<script setup lang="ts">
import GlobalStatsSection from '@/components/organisms/GlobalStatsSection.vue';
import HeroSection from '@/components/organisms/HeroSection.vue'
import MainHeader from '@/components/organisms/MainHeader.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col gap-6">
    <MainHeader />
    <HeroSection />
    <GlobalStatsSection/>
  </div>
</template>
