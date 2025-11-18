<script setup lang="ts">
import MainFooter from '@/shared/components/layout/MainFooter.vue';
import MainHeader from '@/shared/components/layout/MainHeader.vue';
import WaitlistSection from '@/features/waitlist/components/WaitlistSection.vue';
</script>

<template>
  <div class="flex min-h-screen flex-col gap-8">
    <MainHeader />
    <main class="mx-auto flex w-full max-w-[1240px] flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
      <WaitlistSection />
    </main>
    <MainFooter />
  </div>
</template>
