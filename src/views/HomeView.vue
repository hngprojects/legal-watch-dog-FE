<script setup lang="ts">
import DashboardPreview from '@/components/landing-page/DashboardPreview.vue'
import FeaturesSection from '@/components/landing-page/FeaturesSection.vue'
import GlobalStatsSection from '@/components/landing-page/GlobalStatsSection.vue'
import HeroSection from '@/components/landing-page/HeroSection.vue'
import HowItWorks from '@/components/landing-page/HowItWorks.vue'
// import Monitor from '@/components/landing-page/Monitor.vue'
import HomeFrame from '@/components/landing-page/HomeFrame.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <main class="relative mx-auto flex w-full flex-1 flex-col overflow-hidden bg-[#F7F7F7]">
      <div
        class="pointer-events-none absolute top-0 left-1/2 z-0 h-[800px] w-[1600px] -translate-x-1/2 -translate-y-[60%] rounded-[50%]"
        style="
          background: radial-gradient(
            ellipse,
            #f8d9c5 0%,
            rgba(248, 217, 197, 0.5) 40%,
            rgba(247, 247, 247, 0.8) 70%,
            #f7f7f7 100%
          );
        "
      ></div>
      <HeroSection />
      <DashboardPreview />
      <HowItWorks />
      <HomeFrame />
      <!-- <FeaturesSection /> -->
      <!-- <Monitor /> -->
      <GlobalStatsSection />
    </main>
  </div>
</template>
