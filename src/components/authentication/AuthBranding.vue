<template>
  <div class="hidden flex-col items-center justify-center bg-white p-4 lg:flex lg:w-full">
    <div class="relative min-h-[820px] w-full overflow-hidden rounded-3xl bg-neutral-300">
      <transition name="fade" mode="out-in">
        <img
          :key="currentImage"
          :src="currentImage"
          alt="Stay informed"
          class="absolute inset-0 min-h-screen w-full object-cover"
        />
      </transition>

      <div class="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/45" />
      <div class="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 p-8 text-white">
        <div class="flex flex-col gap-2 text-center text-xl leading-tight font-semibold">
          <p>Stay informed,</p>
          <p>Stay Confident</p>
        </div>
        <div class="flex items-center gap-2">
          <span
            v-for="(slide, index) in slides"
            :key="slide"
            class="block h-1 w-10 rounded-full transition-all"
            :class="index === currentIndex ? 'bg-accent-main' : 'w-6 bg-white/40'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import authBg00 from '@/assets/images/auth-bg-00.jpg'
import authBg01 from '@/assets/images/auth-bg-01.jpg'
import authBg02 from '@/assets/images/auth-bg-02.jpg'

const slides = [authBg00, authBg01, authBg02]
const currentIndex = ref(0)
const intervalMs = 5000
let timer: ReturnType<typeof setInterval> | null = null

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % slides.length
}

onMounted(() => {
  timer = setInterval(nextSlide, intervalMs)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

const currentImage = computed(() => slides[currentIndex.value])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
