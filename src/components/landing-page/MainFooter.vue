<script setup lang="ts">
import Frame from '@/assets/images/Frame.png'
import Facebook from '@/assets/images/Facebook.png'
import LinkedIn from '@/assets/images/LinkedIn.png'
import Instagram from '@/assets/images/Instagram.png'
import Twitter from '@/assets//images/Twitter.png'
import YouTube from '@/assets/images/YouTube.png'

// const Products = ['Features', 'Pricing', 'Case studies', 'Reviews', 'Updates']
// const Companys = ['About', 'Contact Us', 'Careers', 'Blog']
// const Supports = ['Getting started', 'Help center', 'Server status', 'Report a bug', 'Chat support']
// const Privacys = ['Copyright', 'Terms of Services']
</script>

<template>
  <footer class="bg-white text-gray-800">
    <div class="mx-auto max-w-7xl px-16 py-10">
      <div class="mb-6">
        <div class="flex items-center gap-3">
          <img
            :src="Frame"
            alt="Legal Watch Dog logo"
            class="h-10 w-auto object-contain"
            loading="lazy"
          />
          <h2 class="text-lg font-bold text-[#3C2610]">Watch Dog</h2>
        </div>

        <p class="mt-3 max-w-2xl pb-[30px] text-gray-500">
          LegalWatchDog helps us track cross-border regulation updates in hours, not weeks.
        </p>
        <Separator class="mt-6 bg-gray-200" />
      </div>

      <!-- Links  -->
      <!-- <nav aria-label="Footer navigation" class="mt-8">
        <div class="grid grid-cols-1 gap-8 py-6 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 class="mb-3 font-semibold text-[#3C2610]">Product</h3>
            <ul class="space-y-2 text-sm font-light text-gray-600 opacity-100">
              <li v-for="(product, i) in Products" :key="i">
                {{ product }}
              </li>
            </ul>
          </div>

          <div>
            <h3 class="mb-3 font-semibold text-[#3C2610]">Company</h3>
            <ul class="space-y-2 text-sm font-light text-gray-600 opacity-100">
              <li v-for="(company, i) in Companys" :key="i">
                {{ company }}
              </li>
            </ul>
          </div>

          <div>
            <h3 class="mb-3 font-semibold text-[#3C2610]">Support</h3>
            <ul class="space-y-2 text-sm font-light text-gray-600 opacity-100">
              <li v-for="(support, i) in Supports" :key="i">
                {{ support }}
              </li>
            </ul>
          </div>

          <div>
            <h3 class="mb-3 font-semibold text-[#3C2610]">Privacy</h3>
            <ul class="space-y-2 text-sm font-light text-gray-600 opacity-100">
              <li v-for="(privacy, i) in Privacys" :key="i">
                {{ privacy }}
              </li>
            </ul>
          </div>
        </div>
      </nav> -->

      <Separator class="mt-6 bg-gray-200" />
      <div class="flex flex-col-reverse gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-[#3C2610]">&copy; 2025 LegalWatchDog | All Rights Reserved</p>
      </div>
    </div>
  </footer>
</template>
