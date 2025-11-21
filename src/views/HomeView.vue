<script setup lang="ts">
import DashboardPreview from '@/components/landing-page/DashboardPreview.vue'
import FeaturesSection from '@/components/landing-page/FeaturesSection.vue'
import GlobalStatsSection from '@/components/landing-page/GlobalStatsSection.vue'
import HeroSection from '@/components/landing-page/HeroSection.vue'
import HowItWorks from '@/components/landing-page/HowItWorks.vue'
import MainFooter from '@/components/landing-page/MainFooter.vue'
import MainHeader from '@/components/landing-page/MainHeader.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <MainHeader />
    <main class="relative mx-auto flex w-full flex-1 flex-col bg-[#F7F7F7] overflow-hidden">

      <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[1600px] h-[800px] rounded-[50%] pointer-events-none z-0" style="background: radial-gradient(ellipse, #F8D9C5 0%, rgba(248, 217, 197, 0.5) 40%, rgba(247, 247, 247, 0.8) 70%, #F7F7F7 100%);"></div>
      
      <HeroSection />
      <DashboardPreview />
      <HowItWorks />
      <FeaturesSection />
      <GlobalStatsSection />
    </main>
    <MainFooter />
  </div>
</template>