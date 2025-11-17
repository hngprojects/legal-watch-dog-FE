<script setup lang="ts">
import MainFooter from '@/components/organisms/MainFooter.vue'
import MainHeader from '@/components/organisms/MainHeader.vue'
import GlobalStatsSection from '@/components/organisms/GlobalStatsSection.vue'
import HeroSection from '@/components/organisms/HeroSection.vue'
import HowItWorks from '@/components/organisms/HowItWorks.vue'
import DashboardPreview from '@/components/organisms/DashboardPreview.vue'
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
