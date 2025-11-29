<script setup lang="ts">
import MainHeader from '@/components/landing-page/MainHeader.vue'
</script>

<template>
  <div class="container--wide flex flex-col bg-gray-50 min-h-screen">
    <MainHeader />
    <main class="flex-1 overflow-y-auto p-6">
      <router-view />
    </main>
  </div>
</template>
