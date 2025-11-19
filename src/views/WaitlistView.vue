<script setup lang="ts">
<<<<<<< HEAD:src/pages/WailistPage.vue
import MainFooter from '@/shared/components/layout/MainFooter.vue';
import MainHeader from '@/shared/components/layout/MainHeader.vue';
import WaitlistSection from '@/features/waitlist/components/WaitlistSection.vue';
=======
import MainFooter from '@/components/landing-page/MainFooter.vue';
import MainHeader from '@/components/landing-page/MainHeader.vue';
import WaitlistSection from '@/components/landing-page/WaitlistSection.vue';
>>>>>>> 2dbf94defbe3a4f9b1b225cca6199a2e3cd6390f:src/views/WaitlistView.vue
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
