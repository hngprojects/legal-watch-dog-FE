<script setup lang="ts">
import MainFooter from '@/components/landing-page/MainFooter.vue'
import MainHeader from '@/components/landing-page/MainHeader.vue'
import Icon from '@/components/reusable/Icon.vue'
import { Copy01Icon } from '@hugeicons/core-free-icons'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <MainHeader />
    <main
      class="relative mx-auto flex w-full flex-1 flex-col items-center overflow-hidden bg-[#F7F7F7] px-6 py-16 text-center md:px-12 lg:px-24"
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

      <div class="z-10">
        <section class="mb-16">
          <div class="max-w-lg lg:max-w-4xl">
            <h1 class="text-preset-display-md text-primary mb-5">Frequently Asked Questions</h1>
            <p class="mb-16 text-lg text-gray-600">
              LegalWatchDog uses AI to track all changes on any website, from Visa portals to
              employment laws and delivers concise actionable summaries.
            </p>
          </div>

          <div class="rounded-lg bg-white px-8 py-10"></div>
        </section>

        <section>
          <div class="mx-auto max-w-md">
            <h2 class="text-preset-heading-lg text-primary mb-3">Have any other question?</h2>
            <p class="mb-6 text-gray-600">
              Don’t hesitate to send us an email with your enquiry or statement at:
            </p>
            <div
              class="mx-auto flex w-fit items-center justify-center gap-2 rounded-md bg-white px-2.5 py-3 md:w-full md:justify-between"
            >
              <p class="text-lg font-medium">Contact@LegalWatchDog.com</p>
              <button class="bg-peach-amber-50 flex items-center gap-2 rounded-md px-2.5 py-1.5">
                Copy
                <Icon :icon="Copy01Icon" color="black" :size="20" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
    <MainFooter />
  </div>
</template>
