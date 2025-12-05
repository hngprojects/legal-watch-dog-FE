<script setup lang="ts">
// import previewImage from '/images/dashboard-preview.png'
// import Dashboard from '@/assets/Images/Dashboard.png'
</script>

<template>
  <section
    id="features"
    class="relative flex w-full flex-1 items-center justify-center py-8 sm:py-16"
  >
    <div class="mx-auto flex w-full flex-col items-center gap-7 px-6 text-center sm:px-8">
      <!-- <div class="w-full max-w-4xl">
        <img :src="Dashboard" alt="Dashboard-image" />
      </div> -->
      <!-- <img :src="previewImage" alt="Dashboard preview" class="h-auto w-full shadow-2xl" /> -->

      <div class="aspect-video w-full max-w-4xl shadow-2xl">
        <iframe
          src="https://drive.google.com/file/d/13Tm2Ysa0wwVKmkTOLcZe9c5eMmxJDb1b/preview"
          allow="autoplay"
          class="size-full"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </section>
</template>
