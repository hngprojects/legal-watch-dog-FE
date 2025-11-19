<script setup lang="ts">
import DashboardPreview from '@/components/landing-page/DashboardPreview.vue';
import FeaturesSection from '@/components/landing-page/FeaturesSection.vue';
import GlobalStatsSection from '@/components/landing-page/GlobalStatsSection.vue';
import HeroSection from '@/components/landing-page/HeroSection.vue';
import HowItWorks from '@/components/landing-page/HowItWorks.vue';
import MainFooter from '@/components/landing-page/MainFooter.vue';
import MainHeader from '@/components/landing-page/MainHeader.vue';


</script>

<template>
  <div class="flex min-h-screen flex-col gap-8">
    <MainHeader />
    <main class="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-6 px-4 sm:px-6 lg:px-8">
      <HeroSection />
      <DashboardPreview />
      <HowItWorks />
      <FeaturesSection />
      <GlobalStatsSection />
    </main>
    <MainFooter/>
  </div>
</template>
