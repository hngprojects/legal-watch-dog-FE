<script setup lang="ts"></script>

<template>
  <section class="space-y-12 px-4 py-12">
    <!-- Top White Card Section -->
    <div class="rounded-2xl bg-white p-10 shadow-sm">
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
    <div
      class="relative flex min-h-130 flex-col items-center justify-center overflow-hidden rounded-2xl bg-[#3c2610] p-5 text-center text-white md:p-12"
    >
      <div
        class="absolute top-0 left-0 h-full w-40 bg-bottom bg-no-repeat md:w-60 lg:w-90"
        style="background-image: url('images/logo.png'); background-size: contain"
      ></div>
      <div
        class="absolute top-0 right-0 h-full w-40 scale-x-[-1] bg-bottom bg-no-repeat md:w-60 lg:w-90"
        style="background-image: url('images/logo.png'); background-size: contain"
      ></div>

      <div class="relative z-10 mx-auto flex max-w-2xl flex-col gap-5">
        <h2 class="text-3xl font-bold">Gain your Strategic Advantage</h2>

        <p class="text-gray-200">
          Stop reacting to change. Start predicting it. See how LegalWatchDog can transform your
          workflow with intelligence and autonomous updates in real time.
        </p>
        <div>
          <button
            class="mt-8 rounded-lg bg-white px-6 py-3 font-medium text-[#5A3A1A] transition hover:bg-gray-100"
          >
            Get Monitoring For Free
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
