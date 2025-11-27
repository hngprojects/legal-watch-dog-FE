<template>
  <footer class="border-t border-gray-100 bg-[#F9FAFB] text-gray-800">
    <div class="mx-auto max-w-7xl px-6 pt-16 pb-6 lg:px-8">
      <div class="mb-12">
        <div class="flex items-center gap-3">
          <img
            :src="Frame"
            alt="Legal Watch Dog logo"
            class="h-10 w-auto object-contain"
            loading="lazy"
          />

          <h2 class="text-lg font-bold text-[#401903]">Watch Dog</h2>
        </div>

        <TypographyText class="mt-3 max-w-lg text-sm text-gray-500">
          LegalWatchDog helps us track cross-border regulation updates in hours, not weeks.
        </TypographyText>
      </div>

      <div class="mb-12 border-t border-gray-300"></div>

      <nav aria-label="Footer navigation">
        <div class="grid grid-cols-2 gap-y-10 md:grid-cols-3 lg:grid-cols-5 lg:gap-8">

          <!-- PRODUCT -->
          <div>
            <h3 class="mb-5 text-base font-bold text-[#401903]">Product</h3>
            <ul class="space-y-3 text-sm text-[#6B7280]">
              <li v-for="(item, i) in products" :key="i">
                <router-link :to="item.path" class="hover:text-gray-900">
                  {{ item.label }}
                </router-link>
              </li>
            </ul>
          </div>

          <!-- COMPANY -->
          <div>
            <h3 class="mb-5 text-base font-bold text-[#401903]">Company</h3>
            <ul class="space-y-3 text-sm text-[#6B7280]">
              <li v-for="(item, i) in companies" :key="i">
                <router-link :to="item.path" class="hover:text-gray-900">
                  {{ item.label }}
                </router-link>
              </li>
            </ul>
          </div>

          <!-- SUPPORT -->
          <div>
            <h3 class="mb-5 text-base font-bold text-[#401903]">Support</h3>
            <ul class="space-y-3 text-sm text-[#6B7280]">
              <li v-for="(item, i) in supports" :key="i">
                <router-link :to="item.path" class="hover:text-gray-900">
                  {{ item.label }}
                </router-link>
              </li>
            </ul>
          </div>

          <!-- PRIVACY (now comes BEFORE subscribe on mobile) -->
          <div class="order-4 md:order-4">
            <h3 class="mb-5 text-base font-bold text-[#401903]">Privacy Policy</h3>
            <ul class="space-y-3 text-sm text-[#6B7280]">
              <li v-for="(item, i) in privacys" :key="i">
                <router-link :to="item.path" class="hover:text-gray-900">
                  {{ item.label }}
                </router-link>
              </li>
            </ul>
          </div>

          <!-- SUBSCRIBE (now LAST on mobile) -->
          <div class="order-5 col-span-2 md:order-5 lg:col-span-1">
            <h3 class="mb-5 text-base font-bold text-[#401903]">Subscribe to our newsletter</h3>
            <TypographyText class="mb-4 text-sm text-gray-600">
              Join our newsletter to get early alerts on regulation updates, price fluctuations, and
              compliance insights that matter to your business.
            </TypographyText>

            <form class="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                class="w-full rounded border border-gray-300 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:border-[#401903] focus:ring-1 focus:ring-[#401903] focus:outline-none"
                required
              />
              <button
                type="submit"
                class="w-full rounded bg-[#401903] px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[#3F1A0F] lg:w-1/2"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>
      </nav>

      <div
        class="mt-12 flex flex-col items-center justify-between border-t border-gray-200 pt-6 text-sm md:flex-row"
      >
        <p class="mb-4 text-[#5D2D18] md:mb-0">
          Copyright &copy; 2025 LegalWatchDog | All Rights Reserved
        </p>

        <div class="flex space-x-4 text-lg text-[#5D2D18]">
          <a href="#" aria-label="Facebook" class="transition duration-150 hover:text-black">
            <img :src="Facebook" alt="facebook-icon" />
          </a>
          <a href="#" aria-label="Twitter" class="transition duration-150 hover:text-black">
            <img :src="Twitter" alt="Twitter-icon" />
          </a>
          <a href="#" aria-label="Instagram" class="transition duration-150 hover:text-black">
            <img :src="Instagram" alt="Instagram-icon" />
          </a>
          <a href="#" aria-label="LinkedIn" class="transition duration-150 hover:text-black">
            <img :src="LinkedIn" alt="LinkedIn-icon" />
          </a>
          <a href="#" aria-label="YouTube" class="transition duration-150 hover:text-black">
            <img :src="YouTube" alt="YouTube-icon" />
          </a>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
import { TypographyText } from '../ui/typography'
import Frame from '@/assets/images/Frame.png'
import Facebook from '@/assets/images/Facebook.png'
import Twitter from '@/assets/images/Twitter.png'
import Instagram from '@/assets/images/Instagram.png'
import LinkedIn from '@/assets/images/LinkedIn.png'
import YouTube from '@/assets/images/YouTube.png'
import { RouterLink } from 'vue-router'

const products = [
  { label: 'Features', path: '/features' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Case studies', path: '/case-studies' },
  { label: 'Reviews', path: '/reviews' },
  { label: 'Updates', path: '/updates' },
]

const companies = [
  { label: 'About', path: '/about-us' },
  { label: 'Contact us', path: '/contact-us' },
  { label: 'Careers', path: '/career' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Blog', path: '/blogs' },
]

const supports = [
  { label: 'Getting started', path: '/help/getting-started' },
  { label: 'Help center', path: '/help' },
  { label: 'Server status', path: '/status' },
  { label: 'Report a bug', path: '/report' },
  { label: 'Chat support', path: '/chat' },
]

const privacys = [
  { label: 'Copyright', path: '/copyright' },
  { label: 'Terms of Service', path: '/terms' },
]
</script>