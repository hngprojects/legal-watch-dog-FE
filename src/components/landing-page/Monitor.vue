<script setup lang="ts">
import { ref } from 'vue'
import Monitor from '@/assets/Images/Monitor.png'
import HeadingText from '@/components/reusable/HeadingText.vue'
import BodyText from '@/components/reusable/BodyText.vue'

const isPlaying = ref(false)

const playVideo = () => {
  isPlaying.value = true
}
</script>

<template>
  <section class="relative h-screen w-full overflow-hidden">
    <div
      v-if="!isPlaying"
      class="absolute inset-0 h-full w-full"
      :style="{
        backgroundImage: 'url(/hero-poster.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    />
    <div class="relative z-10 flex h-full flex-col items-center justify-start px-4 pt-20 sm:pt-24">
      <div class="mb-10 text-center">
        <HeadingText tag="h2" align="center" class="mb-4">
          A Faster Way to <span class="text-[#F2AB6D]">Monitor</span>
          <br />
          <span>and Keep You Informed</span>
        </HeadingText>

        <BodyText
          align="center"
          tone="muted"
          class="mx-auto max-w-[700px] font-semibold text-[#4B5563]"
        >
          Get a guided look at how the platform automates scanning, summarizes changes, and helps
          teams collaborate on compliance tasks.
        </BodyText>
      </div>

      <!-- Video Box – Same Size as HomeFrame -->
      <div
        class="relative mx-auto mt-8 w-full max-w-[1242px] overflow-hidden rounded-t-4xl px-10 lg:mt-12"
      >
        <!-- Play Button Overlay -->
        <button
          v-if="!isPlaying"
          @click="playVideo"
          class="absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300 hover:opacity-80"
          aria-label="Play video"
        ></button>

        <!-- Poster Image (Same size as HomeFrame) -->
        <div v-if="!isPlaying" class="w-full">
          <img
            :src="Monitor"
            alt="Monitor Preview"
            class="h-auto w-full rounded-t-4xl object-cover"
          />
        </div>

        <!-- iFrame Video -->
        <div v-else class="w-full">
          <div class="aspect-video w-full overflow-hidden rounded-t-4xl bg-black shadow-2xl">
            <iframe
              src="https://drive.google.com/file/d/13Tm2Ysa0wwVKmkTOLcZe9c5eMmxJDb1b/preview"
              allow="autoplay"
              class="h-full w-full"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
button {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
