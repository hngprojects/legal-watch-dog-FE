<script setup lang="ts">
import PillTag from '@/components/reusable/PillTag.vue'
import { Button } from '@/components/ui/button'
import Icon from '@/components/reusable/Icon.vue'
import { PlayIcon } from '@hugeicons/core-free-icons'
import { ref } from 'vue'

import projectImg from '@/assets/Images/how-it-works/project.webp'
import jurisdictionImg from '@/assets/Images/how-it-works/jurisdiction.webp'
import sourcesImg from '@/assets/Images/how-it-works/sources.webp'
import monitoringImg from '@/assets/Images/how-it-works/monitoring.webp'
import workIcon from '@/assets/icons/workIcon.png'
import alertsImg from '@/assets/Images/how-it-works/alerts.webp'

const steps = [
  {
    title: 'Set Your Project',
    description: 'Define what you want to monitor or any topic across multiple jurisdiction.',
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

const showVideo = ref(false)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <main
      class="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-[#F7F7F7] py-12 sm:py-16 lg:py-20"
    >
      <!-- Background gradient - responsive -->
      <div
        class="pointer-events-none absolute top-0 left-1/2 z-0 h-[500px] w-[1200px] -translate-x-1/2 -translate-y-[50%] rounded-[50%] sm:h-[600px] sm:w-[1400px] sm:-translate-y-[55%] lg:h-[800px] lg:w-[1600px] lg:-translate-y-[60%]"
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

      <!-- Hero Section -->
      <section
        class="app-container relative z-10 mb-16 space-y-8 text-center sm:mb-20 sm:space-y-10 lg:mb-24"
      >
        <PillTag>
          <span class="text-sm font-normal text-gray-600 sm:text-base"
            >AI-Powered Regulatory Intelligence</span
          >
        </PillTag>

        <div class="space-y-4 sm:space-y-5">
          <h1
            class="text-primary lg:text-preset-display-md text-3xl font-bold sm:text-4xl md:text-5xl"
          >
            How Legal Watch Dog Works
          </h1>
          <p class="lg:text-preset-body-xx-lg text-base text-gray-600 sm:text-lg md:text-xl">
            Stay ahead of changes with AI-powered monitoring.<br class="hidden sm:block" />
            Never miss an important update across any jurisdiction.
          </p>
        </div>

        <!-- Video Button -->
        <div>
          <Button
            variant="default"
            size="default"
            class="mx-auto hidden w-fit text-sm sm:block sm:text-base"
            @click="showVideo = true"
          >
            <Icon :icon="PlayIcon" class="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Watch 2-minute Demo
          </Button>
        </div>

        <!-- Video Modal -->
        <Teleport to="body">
          <div
            v-if="showVideo"
            class="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4"
            @click="showVideo = false"
          >
            <div class="relative w-full max-w-3xl sm:max-w-4xl lg:max-w-5xl">
              <button
                class="absolute -top-10 right-0 z-10 cursor-pointer text-4xl leading-none font-light text-white transition-colors duration-200 select-none hover:text-gray-300 sm:-top-12 sm:text-5xl"
                @click="showVideo = false"
              >
                ×
              </button>

              <div class="relative overflow-hidden rounded-xl shadow-2xl sm:rounded-2xl">
                <iframe
                  src="https://drive.google.com/file/d/13Tm2Ysa0wwVKmkTOLcZe9c5eMmxJDb1b/preview"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowfullscreen
                  class="aspect-video w-full border-0"
                  title="Legal Watch Dog - 2 Minute Demo"
                ></iframe>
              </div>
            </div>
          </div>
        </Teleport>
      </section>

      <!-- Steps Section -->
      <section class="app-container relative z-10 text-center">
        <div class="mb-16 sm:mb-20 lg:mb-28">
          <h2 class="lg:text-preset-display-sm text-2xl font-semibold sm:text-3xl md:text-4xl">
            5 <span class="text-peach-amber-main">Simple Steps</span> to Stay Informed
          </h2>
          <p
            class="lg:text-preset-body-xx-lg mt-2 text-base text-gray-600 sm:mt-3 sm:text-lg md:text-xl"
          >
            From setups to alerts in minutes
          </p>
        </div>

        <div class="space-y-16 sm:space-y-20">
          <article
            v-for="(step, i) in steps"
            :key="i"
            class="flex w-full flex-col items-center justify-center gap-8 text-center md:gap-10 lg:flex-row lg:items-start lg:text-start"
            :class="{ 'lg:flex-row-reverse': i % 2 !== 0 }"
          >
            <!-- Content Column -->
            <div
              class="w-full max-w-md space-y-4 md:max-w-lg lg:max-w-none lg:basis-1/2 lg:space-y-5 lg:self-center"
              :class="[i % 2 !== 0 ? 'lg:pl-10 xl:pl-14' : 'lg:pr-10 xl:pr-14']"
            >
              <!-- Step Indicator -->
              <div
                class="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
              >
                <div class="flex items-center justify-center p-3 sm:p-4">
                  <img :src="workIcon" alt="icon" class="h-10 w-10 sm:h-12 sm:w-12" />
                </div>
                <div class="flex items-center gap-3">
                  <h3 class="text-peach-amber-main text-lg font-semibold sm:text-xl md:text-2xl">
                    Step {{ i + 1 }}
                  </h3>
                </div>
              </div>

              <!-- Title & Description -->
              <div class="space-y-3">
                <h4 class="lg:text-preset-heading-lg text-xl font-bold sm:text-2xl md:text-3xl">
                  {{ step.title }}
                </h4>
                <p class="text-sm font-medium text-gray-600 sm:text-base md:text-lg lg:pt-1">
                  {{ step.description }}
                </p>
              </div>
            </div>

            <!-- Image Column -->
            <div class="w-full max-w-md md:max-w-lg lg:max-w-none lg:basis-1/2">
              <img
                :src="step.image"
                :alt="step.title"
                class="w-full rounded-2xl shadow-lg sm:rounded-3xl"
              />
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .app-container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (max-width: 768px) {
  /* Stack steps vertically on mobile/tablet */
  article {
    flex-direction: column !important;
  }

  /* Center content on mobile */
  .lg\:text-start {
    text-align: center;
  }

  .lg\:justify-start {
    justify-content: center;
  }
}

/* Hover effects */
button:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* Image optimization */
img {
  max-width: 100%;
  height: auto;
}

/* Prevent content from being too wide on large screens */
@media (min-width: 1536px) {
  .app-container {
    max-width: 1280px;
  }
}
</style>
