<script setup lang="ts">
import MainFooter from '@/components/landing-page/MainFooter.vue'
import MainHeader from '@/components/landing-page/MainHeader.vue'
import Terms from '@/components/landing-page/Terms.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <MainHeader />
    <main class="mx-auto flex w-full flex-1 flex-col">
      <Terms />
    </main>
    <MainFooter />
  </div>
</template>
