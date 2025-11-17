<script setup lang="ts">
import WaitlistSection from '@/components/organisms/WaitlistSection.vue';
import MainHeader from '@/components/organisms/MainHeader.vue'
import DashboardPreview from '@/components/organisms/DashboardPreview.vue';
import MainFooter from '@/components/organisms/MainFooter.vue';
</script>

<template>
  <div class="flex min-h-screen flex-col gap-6">
    <MainHeader />
     <WaitlistSection />
     <DashboardPreview />
    <MainFooter/>
  </div>
</template>
