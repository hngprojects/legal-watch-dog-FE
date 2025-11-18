<template>
  <footer class="bg-white text-gray-800">
    <div class="max-w-7xl mx-auto px-6 py-10">
      <div class="mb-6">
        <div class="flex items-center gap-3">
          <img
            :src="Frame"
            alt="Legal Watch Dog logo"
            class="h-10 w-auto object-contain"
            loading="lazy"
          />
          <h2 class="text-[#3C2610] font-bold text-lg">Watch Dog</h2>
        </div>

        <p class="text-gray-500 mt-3 max-w-2xl pb-[30px]">
          LegalWatchDog helps us track cross-border regulation updates in hours, not weeks.
        </p>
        <Separator class="mt-6 bg-gray-200" />
      </div>

      <!-- Links  -->
      <nav aria-label="Footer navigation" class="mt-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-6">
          <div>
            <h3 class="font-semibold text-[#3C2610] mb-3">Product</h3>
            <ul class="space-y-2 text-sm font-light text-gray-600 opacity-100">
              <li v-for="(product, i) in Products" :key="i">
               {{ product }}
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold text-[#3C2610] mb-3">Company</h3>
            <ul class="space-y-2 text-sm font-light text-gray-600 opacity-100">
              <li v-for="(company, i) in Companys" :key="i">
                {{ company }}
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold text-[#3C2610] mb-3">Support</h3>
            <ul class="space-y-2 text-sm font-light text-gray-600 opacity-100">
              <li v-for="(support, i) in Supports" :key="i">
                {{ support }}
              </li>
            </ul>
          </div>

          <div>
            <h3 class="font-semibold text-[#3C2610] mb-3">Privacy</h3>
            <ul class="space-y-2 text-sm font-light text-gray-600 opacity-100">
              <li v-for="(privacy, i) in Privacys" :key="i">
                {{ privacy }}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Separator class="mt-6 bg-gray-200" />
      <div class="flex flex-col-reverse gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-[#3C2610]"> &copy; 2025 LegalWatchDog | All Rights Reserved</p>
        <div class="flex items-center gap-4">
          <RouterLink to="/"> <img :src="Facebook" alt="Facebook" class="w-[7px]" /></RouterLink>
          <RouterLink to="/">
            <img :src="linkdin" alt="linkdin" class="w-3.5" />
          </RouterLink>
          <RouterLink to="/">
            <img :src="Instagram" alt="Instagram" class="w-3.5" />
          </RouterLink>
          <RouterLink to="/">
            <img :src="Twitter" alt="Twitter" class="w-3.5" />
          </RouterLink>
          <RouterLink to="/">
            <img :src="YouTube" alt="YouTube" class="w-3.5" />
          </RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import Frame from '@/assets/Frame.png'
import Facebook from '@/assets/Facebook.png'
import linkdin from '@/assets/linkdin.png'
import Instagram from '@/assets/Instagram.png'
import Twitter from '@/assets/Twitter.png'
import YouTube from '@/assets/YouTube.png'

const Products = ['Features', 'Pricing', 'Case studies', 'Reviews', 'Updates']
const Companys = ['About', 'Contact Us', 'Careers', 'Blog']
const Supports = ['Getting started', 'Help center', 'Server status', 'Report a bug', 'Chat support']
const Privacys = ['Copyright', 'Terms of Services']
</script>
