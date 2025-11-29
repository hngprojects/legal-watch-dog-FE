<script setup lang="ts">
import PillTag from '@/components/reusable/PillTag.vue'
import { Button } from '@/components/ui/button'
import Icon from '@/components/reusable/Icon.vue'
import { PlayIcon } from '@hugeicons/core-free-icons'

import projectImg from '@/assets/Images/how-it-works/project.webp'
import jurisdictionImg from '@/assets/Images/how-it-works/jurisdiction.webp'
import sourcesImg from '@/assets/Images/how-it-works/sources.webp'
import monitoringImg from '@/assets/Images/how-it-works/monitoring.webp'
import workIcon from '@/assets/icons/workIcon.png'
import alertsImg from '@/assets/Images/how-it-works/alerts.webp'

const steps = [
  {
    title: 'Set Your Project',
    description: 'Define what you want to monitor or any legal topic across multiple jurisdiction.',
    image: projectImg,
  },
  {
    title: 'Define Your Jurisdiction',
    description: 'Choose the country you want to follow and track changes.',
    image: jurisdictionImg,
  },
  {
    title: 'Add Trusted Sources',
    description: 'Choose the government sites or regulatory bodies you want to track.',
    image: sourcesImg,
  },
  {
    title: 'Automated Monitoring',
    description: 'Our system tracks / checks your sources for changes 24/7.',
    image: monitoringImg,
  },
  {
    title: 'Automated Alerts',
    description: 'Receive notification when important changes happen.',
    image: alertsImg,
  },
]
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <main
      class="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#F7F7F7] py-16"
    >
      <div
        class="pointer-events-none absolute top-0 left-1/2 z-0 h-[800px] w-[1600px] -translate-x-1/2 -translate-y-[60%] rounded-[50%]"
        style="
          background: radial-gradient(
            ellipse,
            #f8d9c5 0%,
            rgba(248, 217, 197, 0.5) 40%,
            rgba(247, 247, 247, 0.8) 70%,
            #f7f7f7 100%
          );
        "
      ></div>
      <section class="relative z-10 mb-24 space-y-11 text-center">
        <PillTag>
          <span class="font-normal text-gray-600">AI-Powered Regulatory Intelligence</span>
        </PillTag>
        <div class="space-y-5">
          <h1 class="text-preset-display-md text-primary font-bold">How Legal Watch Dog Works</h1>
          <p class="text-preset-body-xx-lg text-gray-600">
            Stay ahead of legal changes with AI-powered monitoring.<br />
            Never miss an important update across any jurisdiction.
          </p>
        </div>
        <Button variant="secondary" class="my-8 cursor-pointer self-center px-8" size="lg">
          <Icon :icon="PlayIcon" /> Watch 2-minute Demo
        </Button>
      </section>

      <section class="relative z-10 text-center app-container">
        <div class="mb-28">
          <h2 class="text-preset-display-sm font-semibold">
            5 <span class="text-peach-amber-main">Simple Steps</span> to Stay Informed
          </h2>
          <p class="text-preset-body-xx-lg text-gray-600">From setups to alerts in minutes</p>
        </div>

        <div class="space-y-20 text-center lg:text-start">
          <article
            :key="i"
            v-for="(step, i) in steps"
            class="flex w-full flex-col justify-center gap-10 *:basis-1/2 lg:flex-row lg:gap-0 lg:[&>div]:first:flex-1"
            :class="{ 'lg:flex-row-reverse': i % 2 !== 0 }"
          >
            <div class="space-y-4 lg:self-center" :class="[i % 2 !== 0 ? 'lg:pl-14' : 'lg:pr-14']">
              <div class="flex items-center justify-center gap-3 lg:justify-start">
                <div class="p-4">
                  <img :src="workIcon" alt="icon" />
                </div>
                <h3 class="text-preset-heading-lg text-peach-amber-main">Step {{ i + 1 }}</h3>
              </div>
              <h4 class="text-preset-heading-lg">{{ step.title }}</h4>
              <p class="pt-1 font-medium text-gray-600">{{ step.description }}</p>
            </div>

            <div class="w-full self-center md:w-4/5 lg:w-full">
              <img :src="step.image" class="w-full rounded-3xl" />
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
button:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}
</style>
