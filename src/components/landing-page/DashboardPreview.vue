<script setup lang="ts">
<<<<<<<< HEAD:src/features/home/components/DashboardPreview.vue
import previewImage from '@/assets/Images/dashboard-preview.png';
========
  import previewImage from '/images/dashboard-preview.png';
>>>>>>>> 2dbf94defbe3a4f9b1b225cca6199a2e3cd6390f:src/shared/components/landing-page/DashboardPreview.vue
</script>

<template>
  <section id="features" class="relative flex w-full flex-1 items-center justify-center py-8 sm:py-16">
    <div
      class="mx-auto flex w-full items-center max-w-[900px] flex-col gap-7 px-6 py-12 text-center sm:px-8 sm:py-16"
    >
      <img :src="previewImage" alt="Dashboard preview" class="w-full h-auto shadow-2xl" />
    </div>
  </section>
</template>
