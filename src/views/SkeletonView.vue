<script setup lang="ts">
import MainHeader from '@/components/landing-page/MainHeader.vue'
import MainFooter from '@/components/landing-page/MainFooter.vue'
import SkeletonBlock from '@/components/reusable/SkeletonBlock.vue'
</script>

<template>
  <div class="min-h-screen bg-[#F7F3EF] flex flex-col text-[#3C2610]">
    <MainHeader />

    <main class="flex-1">
      <div class="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-10">
        <section class="space-y-6">
          <SkeletonBlock class="h-10 w-64 rounded-2xl" radius="20px" />
          <div class="space-y-4">
            <SkeletonBlock class="h-6 w-full rounded-xl" radius="16px" />
            <SkeletonBlock class="h-6 w-5/6 rounded-xl" radius="16px" />
            <SkeletonBlock class="h-6 w-2/3 rounded-xl" radius="16px" />
          </div>
          <div class="flex flex-wrap gap-4">
            <SkeletonBlock class="h-12 w-44 rounded-full" />
            <SkeletonBlock class="h-12 w-32 rounded-full" />
          </div>
        </section>

        <section class="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
          <div class="space-y-6">
            <div class="rounded-[28px] bg-white p-6 shadow-[0_25px_80px_rgba(60,38,16,0.08)] space-y-4">
              <SkeletonBlock class="h-48 rounded-2xl" radius="20px" />
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SkeletonBlock class="h-6 w-full rounded-xl" radius="16px" />
                <SkeletonBlock class="h-6 w-5/6 rounded-xl" radius="16px" />
                <SkeletonBlock class="h-6 w-3/4 rounded-xl" radius="16px" />
                <SkeletonBlock class="h-6 w-2/3 rounded-xl" radius="16px" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="rounded-3xl bg-white p-6 space-y-4 shadow-[0_18px_50px_rgba(60,38,16,0.06)]">
                <SkeletonBlock class="h-28 rounded-2xl" radius="20px" />
                <SkeletonBlock class="h-6 w-3/4 rounded-xl" radius="16px" />
                <SkeletonBlock class="h-6 w-2/3 rounded-xl" radius="16px" />
              </div>
              <div class="rounded-3xl bg-white p-6 space-y-4 shadow-[0_18px_50px_rgba(60,38,16,0.06)]">
                <SkeletonBlock class="h-28 rounded-2xl" radius="20px" />
                <SkeletonBlock class="h-6 w-4/5 rounded-xl" radius="16px" />
                <SkeletonBlock class="h-6 w-2/3 rounded-xl" radius="16px" />
              </div>
            </div>
          </div>

          <aside class="rounded-[32px] bg-white p-6 shadow-[0_25px_80px_rgba(60,38,16,0.08)] space-y-6">
            <SkeletonBlock class="h-12 w-48 rounded-full" />
            <div class="space-y-4">
              <SkeletonBlock class="h-6 w-5/6 rounded-xl" radius="16px" />
              <SkeletonBlock class="h-6 w-4/5 rounded-xl" radius="16px" />
              <SkeletonBlock class="h-6 w-2/3 rounded-xl" radius="16px" />
            </div>
            <div class="space-y-3">
              <SkeletonBlock class="h-14 w-full rounded-2xl" radius="16px" />
              <SkeletonBlock class="h-14 w-full rounded-2xl" radius="16px" />
            </div>
          </aside>
        </section>
      </div>
    </main>

    <MainFooter />
  </div>
</template>
