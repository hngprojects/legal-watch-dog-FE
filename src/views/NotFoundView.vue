<script setup lang="ts">
import MainHeader from '@/components/landing-page/MainHeader.vue'
import Button from '@/components/ui/button/Button.vue'
import TypographyHeading from '@/components/ui/typography/TypographyHeading.vue'
import TypographyText from '@/components/ui/typography/TypographyText.vue'
import { RouterLink } from 'vue-router'
// import { onMounted, onUnmounted } from 'vue'

// onMounted(() => {
//   document.body.style.overflow = 'hidden'
// })

// onUnmounted(() => {
//   document.body.style.overflow = ''
// })
</script>

<template>
  <div class="w-screen h-screen">
    <MainHeader />
    <main class="absolute inset-0 flex flex-col justify-center items-center overflow-hidden w-screen h-screen gap-6">
      <TypographyHeading
        level="h1"
        class="text-[100px] sm:text-[120px] md:text-[140px] font-semibold tracking-[-0.04em] text-center p-0 -mb-8"
      >
        404
      </TypographyHeading>
      <TypographyText
        class="max-w-md text-center text-2xl sm:text-3xl md:text-4xl font-semibold text-black"
      >
        Page Not Found
      </TypographyText>
      <TypographyText class="max-w-md text-center">
        Sorry, we can’t find the page you’re looking for
      </TypographyText>
      <Button
        aria-label="Go back to homepage"
        :as="RouterLink"
        :to="{ path: '/' }"
        size="lg"
      >
        Back Home
      </Button>
      <footer class="absolute bottom-10 text-center w-full">
        <small class="text-gray-400 text-[15px]">
          &copy; 2025 LegalWatchDog. All Rights Reserved | Terms of Use
        </small>
      </footer>
    </main>
  </div>
</template>

