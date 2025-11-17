<script setup lang="ts">
  import previewImage from '../../assets/img/dashboard-preview.png'
</script>

<template>
  <section id="features" class="relative flex w-full flex-1 items-center justify-center py-8 sm:py-16">
    <div
      class="mx-auto flex w-full items-center max-w-[900px] flex-col gap-7 px-6 py-12 text-center sm:px-8 sm:py-16"
    >
      <img :src="previewImage" alt="Dashboard preview" class="w-full h-auto" />
    </div>
  </section>
</template>
