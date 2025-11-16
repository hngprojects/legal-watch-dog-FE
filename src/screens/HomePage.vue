<script setup lang="ts">
import HeroSection from '@/components/organisms/HeroSection.vue'
import MainFooter from '@/components/organisms/MainFooter.vue';
import MainHeader from '@/components/organisms/MainHeader.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col gap-6">
    <MainHeader />
    <HeroSection />
    <MainFooter/>
  </div>
</template>
