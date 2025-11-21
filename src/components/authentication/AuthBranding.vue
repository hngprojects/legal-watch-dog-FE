<template>
  <div class="hidden flex-col items-center justify-center bg-white p-12 lg:flex lg:w-full">
    <div class="relative overflow-hidden rounded-3xl bg-neutral-300">
      <img :src="authBackground" alt="Stay informed" class="h-full w-full object-cover" />
      <div class="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/45" />
      <div class="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 p-8 text-white">
        <div class="flex flex-col gap-2 text-center text-xl font-semibold leading-tight">
          <p>Stay informed,</p>
          <p>Stay Confident</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="block h-0.5 w-10 rounded-full bg-white/80"></span>
          <span class="block h-0.5 w-6 rounded-full bg-white/50"></span>
          <span class="block h-0.5 w-6 rounded-full bg-white/50"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import authBackground from '@/assets/images/auth-bg-1.jpg'
</script>
