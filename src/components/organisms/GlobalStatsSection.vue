<template>
  <section class="px-4 py-12 space-y-12">
    <!-- Top White Card Section -->
    <div class="p-10 rounded-2xl shadow-sm bg-white">
      <div class="text-center max-w-3xl mx-auto space-y-4">
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
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 text-center">
          <div>
            <p class="text-3xl font-bold">5,000+</p>
            <p class="text-gray-600 text-sm">Data Sources Worldwide</p>
          </div>

          <div>
            <p class="text-3xl font-bold">200+</p>
            <p class="text-gray-600 text-sm">Countries being monitored</p>
          </div>

          <div>
            <p class="text-3xl font-bold">100%</p>
            <p class="text-gray-600 text-sm">Regulatory Compliance Assured</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Brown CTA Section -->
    <div class="rounded-2xl bg-[#3c2610] text-white relative overflow-hidden p-12 text-center">
      <div
        class="absolute left-0 top-0 h-full w-40 bg-no-repeat bg-bottom"
        style="background-image: url('images/logo.png'); background-size: contain"
      ></div>
      <div
        class="absolute right-0 top-0 h-full w-40 bg-no-repeat bg-bottom scale-x-[-1]"
        style="background-image: url('images/logo.png'); background-size: contain"
      ></div>

      <div class="relative z-10 space-y-4 max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold">Gain your Strategic Advantage</h2>

        <p class="text-gray-200">
          Stop reacting to change. Start predicting it. See how LegalWatchDog can transform your
          workflow with intelligence and autonomous updates in real time.
        </p>

        <button
          class="bg-white text-[#5A3A1A] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition mt-4"
        >
          Get Monitoring For Free
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>
