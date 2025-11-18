<script setup lang="ts">
import MainFooter from '@/shared/components/layout/MainFooter.vue'
import MainHeader from '@/shared/components/layout/MainHeader.vue'
import DashboardPreview from '@/features/home/components/DashboardPreview.vue'
import GlobalStatsSection from '@/features/home/components/GlobalStatsSection.vue'
import HeroSection from '@/features/home/components/HeroSection.vue'
import HowItWorks from '@/features/home/components/HowItWorks.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col gap-8">
    <MainHeader />
    <main class="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-6 px-4 sm:px-6 lg:px-8">
      <HeroSection />
      <DashboardPreview />
      <HowItWorks />
      <GlobalStatsSection />
    </main>
    <MainFooter/>
  </div>
</template>
