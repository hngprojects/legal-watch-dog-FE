<script setup lang="ts">
import MainFooter from '@/components/landing-page/MainFooter.vue'
import MainHeader from '@/components/landing-page/MainHeader.vue'
import WaitlistSection from '@/components/landing-page/WaitlistSection.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <MainHeader />
    <main class="mx-auto flex w-full flex-1 flex-col">
      <WaitlistSection />
    </main>
    <MainFooter />
  </div>
</template>
