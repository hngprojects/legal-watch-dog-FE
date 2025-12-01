<script setup lang="ts">
import { Button } from '../ui/button'
import backleft from '@/assets/Images/backleft.png'
import backright from '@/assets/Images/backright.png'
</script>

<template>
  <section class="app-container space-y-12">
    <!-- Top White Card Section -->
    <div class="rounded-2xl bg-white p-10 shadow-xl">
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <h2 class="text-3xl font-bold">
          Your Global Legal Pulse,<br />
          All in One Map
        </h2>

        <p class="text-gray-600">
          Our AI monitors and summarizes updates from verified sources across continents, ensuring
          nothing slips through the cracks.
        </p>

        <!-- Map Image -->
        <div class="flex justify-center pt-6">
          <img src="/images/mapbase.png" alt="World Map" class="w-full max-w-xl" />
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-1 gap-8 pt-8 text-center sm:grid-cols-3">
          <div>
            <p class="text-3xl font-bold">5,000+</p>
            <p class="text-sm text-gray-600">Data Sources Worldwide</p>
          </div>

          <div>
            <p class="text-3xl font-bold">200+</p>
            <p class="text-sm text-gray-600">Countries being monitored</p>
          </div>

          <div>
            <p class="text-3xl font-bold">100%</p>
            <p class="text-sm text-gray-600">Regulatory Compliance Assured</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Brown CTA Section -->
    <section
      class="relative container mx-auto mt-12 mb-12 w-full overflow-hidden rounded-3xl bg-[#3C2610] px-6 py-24"
    >
      <img
        :src="backleft"
        alt=""
        class="pointer-events-none absolute bottom-0 left-0 w-48 opacity-50 md:w-64"
      />
      <img
        :src="backright"
        alt=""
        class="pointer-events-none absolute right-0 bottom-0 w-48 opacity-50 md:w-64"
      />

      <div class="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        <h2 class="text-3xl font-bold text-white md:text-4xl">Gain your Strategic Advantage</h2>
        <p class="text-lg leading-relaxed text-white/80">
          Stop worrying about regulatory blindsides. Start tracking changes with precision and
          confidence today.
        </p>
        <Button
          class="rounded-lg bg-[#F2AB6D] px-8 py-6 text-lg font-semibold text-white hover:bg-[#F2AB6D]/90"
        >
          Start monitoring now
        </Button>
      </div>
    </section>
  </section>
</template>
