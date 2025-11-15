<script setup lang="ts">
import BaseButton from '@/components/atoms/BaseButton.vue'
import BrandLogo from '@/components/molecules/BrandLogo.vue'
</script>

<template>
  <header
    class="flex w-full flex-col gap-4 rounded-3xl border border-white/80 bg-white/80 px-6 py-4 text-text-main shadow-[0_20px_45px_rgba(14,13,11,0.08),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:gap-0"
  >
    <BrandLogo />
    <BaseButton variant="primary" size="md">Get Started</BaseButton>
  </header>
</template>
