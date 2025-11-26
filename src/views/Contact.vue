<script setup lang="ts">
import ContactUs from '@/components/landing-page/ContactUs.vue'
import MainFooter from '@/components/landing-page/MainFooter.vue'
import MainHeader from '@/components/landing-page/MainHeader.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <MainHeader />
    <main class="mx-auto flex w-full flex-1 flex-col">
      <ContactUs />
    </main>
    <MainFooter />
  </div>
</template>
