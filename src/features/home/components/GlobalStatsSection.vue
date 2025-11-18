<script setup lang="ts">
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
</script>

<template>
  <section class="space-y-12 px-4 py-12">
    <Card class="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <CardHeader class="space-y-4 px-6 pt-10 text-center sm:px-10">
        <CardTitle class="text-3xl font-bold text-foreground">
          Your Global Legal Pulse,<br />
          All in One Map
        </CardTitle>
        <CardDescription class="text-base text-gray-600">
          Our AI monitors and summarizes updates from verified sources across continents, ensuring
          nothing slips through the cracks.
        </CardDescription>
      </CardHeader>

      <CardContent class="space-y-8 px-6 pb-10 sm:px-10">
        <div class="flex justify-center pt-2">
          <img src="/images/mapbase.png" alt="World Map" class="w-full max-w-xl" />
        </div>

        <div class="grid grid-cols-1 gap-5 pt-4 text-center sm:grid-cols-3">
          <div class="rounded-2xl border border-border bg-white/90 p-5 shadow-xs">
            <p class="text-3xl font-bold text-foreground">5,000+</p>
            <p class="text-sm text-muted-foreground">Data Sources Worldwide</p>
          </div>

          <div class="rounded-2xl border border-border bg-white/90 p-5 shadow-xs">
            <p class="text-3xl font-bold text-foreground">200+</p>
            <p class="text-sm text-muted-foreground">Countries being monitored</p>
          </div>

          <div class="rounded-2xl border border-border bg-white/90 p-5 shadow-xs">
            <p class="text-3xl font-bold text-foreground">100%</p>
            <p class="text-sm text-muted-foreground">Regulatory Compliance Assured</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card
      class="relative overflow-hidden rounded-2xl border-0 bg-[#3c2610] text-white shadow-lg py-20"
    >
      <div
        class="pointer-events-none absolute left-0 top-0 h-full w-40 bg-bottom bg-no-repeat md:w-60 lg:w-80 opacity-5"
        style="background-image: url('images/logo.png'); background-size: contain"
      />
      <div
        class="pointer-events-none absolute right-0 top-0 h-full w-40 scale-x-[-1] bg-bottom bg-no-repeat md:w-60 lg:w-80 opacity-5"
        style="background-image: url('images/logo.png'); background-size: contain"
      />

      <CardContent class="relative z-10 flex flex-col gap-5 px-6 py-10 text-center md:px-12 items-center max-w-[800px] mx-auto">
        <CardTitle class="text-3xl font-bold text-white text-center">Gain your Strategic Advantage</CardTitle>
        <CardDescription class="text-base text-gray-200">
          Stop reacting to change. Start predicting it. See how LegalWatchDog can transform your
          workflow with intelligence and autonomous updates in real time.
        </CardDescription>
        <Button
          variant="secondary"
          class="mx-auto mt-2 bg-white text-[#5A3A1A] hover:bg-gray-100"
        >
          Get Monitoring For Free
        </Button>
      </CardContent>
    </Card>
  </section>
</template>
