<template>
  <div class="relative flex min-h-auto flex-col overflow-hidden">
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

    <!-- CAREER PAGE CONTENT -->
    <section class="relative z-10 bg-transparent px-4 py-16 text-center md:py-20">
      <h1 class="mb-4 text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
        Build Your Future In Regulatory
      </h1>
      <p class="mx-auto max-w-2xl text-base text-gray-600 md:text-lg lg:text-xl">
        Discover exciting opportunities and grow your career in a thriving environment.
      </p>
    </section>

    <!-- CAREERS GRID -->
    <section class="relative z-10 mx-auto max-w-7xl bg-transparent px-4 py-12 md:py-20 lg:px-6">
      <!-- UNIFORM RESPONSIVE GRID -->
      <div class="grid grid-cols-1 place-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <!-- WRAPPER (keeps alignment and responsiveness) -->
        <div class="flex items-center justify-center">
          <div class="flex h-[239px] w-[383px] flex-col rounded-2xl bg-[#E3E3E3] p-[50px]">
            <p class="text-sm leading-relaxed text-gray-600">
              It is more than a job, it's a place you learn and grow.
            </p>
            <div class="flex items-center space-x-3 py-3">
              <img :src="small1" class="h-10 w-10 rounded-full object-cover" />
              <div>
                <p class="font-semibold text-gray-900">Piro</p>
                <p class="text-sm text-gray-500">UI/UX Designer</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-center">
          <div class="h-[239px] w-[383px]">
            <img :src="career1" class="h-full w-full rounded-2xl object-cover" />
          </div>
        </div>

        <div class="flex items-center justify-center">
          <div class="h-[239px] w-[383px]">
            <img :src="career3" class="h-full w-full rounded-2xl object-cover" />
          </div>
        </div>

        <div class="flex">
          <div class="h-[239px] w-[300px]">
            <img :src="career2" class="h-full w-full rounded-2xl object-cover" />
          </div>
        </div>

        <div class="flex items-center justify-center">
          <div
            class="flex h-[239px] w-[457px] flex-col justify-center rounded-2xl bg-[#E3E3E3] p-6 lg:mr-6"
          >
            <p class="mb-4 text-sm leading-relaxed text-gray-600">
              Discover something new and valuable
            </p>
            <div class="flex items-center space-x-3">
              <img :src="small2" class="h-10 w-10 rounded-full object-cover" />
              <div>
                <p class="font-semibold text-gray-900">Anna</p>
                <p class="text-sm text-gray-500">Product Manager</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-center">
          <div class="h-[239px] w-[383px]">
            <img :src="career4" class="h-full w-full rounded-2xl object-cover" />
          </div>
        </div>

        <div class="flex items-center justify-center">
          <div class="h-[239px] w-[329px]">
            <img :src="career5" class="h-full w-full rounded-2xl object-cover" />
          </div>
        </div>

        <div class="flex items-center justify-center">
          <div class="h-[239px] w-[478px]">
            <img :src="career6" class="h-full w-full rounded-2xl object-cover" />
          </div>
        </div>

        <div class="flex items-center justify-center">
          <div
            class="flex h-[239px] w-[342px] flex-col justify-center rounded-2xl bg-[#E3E3E3] p-6"
          >
            <p class="mb-4 text-sm leading-relaxed text-gray-600">
              It is more than a job, it's a place you learn and grow.
            </p>
            <div class="flex items-center space-x-3">
              <img :src="small3" class="h-10 w-10 rounded-full object-cover" />
              <div>
                <p class="font-semibold text-gray-900">Yemi</p>
                <p class="text-sm text-gray-500">UI/UX Designer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY JOIN US -->
    <section class="relative z-10 bg-transparent px-4 py-16 text-center md:py-20">
      <h2 class="mb-4 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
        Why <span class="text-[#F2AB6D]">Join</span> Us
      </h2>
      <p class="mx-auto w-[363px] text-base text-gray-600 md:text-lg">
        Experience a workplace that values your growth, creativity, and well-being.
      </p>
    </section>

    <!-- BENEFITS -->
    <section class="mx-auto max-w-7xl space-y-20 bg-transparent px-4 py-10 md:py-20 lg:px-6">
      <!-- FLEXIBLE WORK ENVIRONMENT -->
      <div class="flex flex-col items-center gap-10 lg:flex-row lg:gap-20">
        <div class="order-2 flex-1 text-center lg:order-1 lg:text-left">
          <h3 class="mb-4 text-2xl font-bold md:text-3xl">Flexible Work Environment</h3>
          <p class="mx-auto max-w-md text-base text-gray-600 md:text-lg lg:mx-0">
            Enjoy a healthy work-life with options for remote work and flexible options.
          </p>
        </div>

        <div class="order-1 flex-1 lg:order-2">
          <img :src="why1" class="h-auto w-full rounded-2xl object-cover" />
        </div>
      </div>

      <!-- BENEFIT PACKAGE -->
      <div class="flex flex-col items-center gap-10 lg:flex-row lg:gap-20">
        <div class="flex-1">
          <img :src="why2" class="h-auto w-full rounded-2xl object-cover" />
        </div>

        <div class="flex-1 text-center lg:text-left">
          <h3 class="mb-4 text-2xl font-bold md:text-3xl">Benefit Package</h3>
          <p class="mx-auto max-w-md text-base text-gray-600 md:text-lg lg:mx-0">
            Receive competitive compensation, health package and free health care coverage.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import small1 from '@/assets/Images/small1.png'
import small2 from '@/assets/Images/small2.png'
import small3 from '@/assets/Images/small3.png'
import why1 from '@/assets/Images/why1.png'
import why2 from '@/assets/Images/why2.png'
import career1 from '@/assets/Images/career1.png'
import career2 from '@/assets/Images/career2.png'
import career3 from '@/assets/Images/career3.png'
import career4 from '@/assets/Images/career4.png'
import career5 from '@/assets/Images/career5.png'
import career6 from '@/assets/Images/career6.png'
</script>
