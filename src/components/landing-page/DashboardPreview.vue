<script setup lang="ts">
// import previewImage from '/images/dashboard-preview.png'
</script>

<template>
  <section
    id="features"
    class="relative flex w-full flex-1 items-center justify-center py-8 sm:py-16"
  >
    <div
      class="mx-auto flex w-full flex-col items-center gap-7 px-6 py-12 text-center sm:px-8 sm:py-16"
    >
      <!-- <img :src="previewImage" alt="Dashboard preview" class="h-auto w-full shadow-2xl" /> -->

      <div class="aspect-video w-full max-w-4xl">
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
