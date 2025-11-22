<script setup lang="ts">
import { ref } from 'vue'
import Frame from '@/assets/images/Frame.png'
import Facebook from '@/assets/images/Facebook.png'
import LinkedIn from '@/assets/images/LinkedIn.png'
import Instagram from '@/assets/images/Instagram.png'
import Twitter from '@/assets/images/Twitter.png'
import YouTube from '@/assets/images/YouTube.png'

const email = ref('')

const Products = ['Features', 'Pricing', 'Case studies', 'Reviews', 'Updates']
const Companys = ['About', 'Contact us', 'Careers', 'FAQ', 'Blog']
const Supports = ['Getting started', 'Help center', 'Server status', 'Report a bug', 'Chat support']
const Privacys = ['Copyright', 'Terms of Service']
</script>

<template>
  <footer class="bg-white text-gray-800">
    <div class="mx-auto max-w-7xl px-6 pt-12 pb-8 sm:px-16">
      <!-- Logo & Tagline -->
      <div class="mb-8">
        <div class="flex items-center gap-3">
          <img :src="Frame" alt="WatchDog logo" class="h-10 w-auto" />
          <span class="text-xl font-bold text-[#3C2610]">WatchDog</span>
        </div>
        <p class="mt-3 text-sm text-gray-600">
          LegalWatchDog helps us track cross-border regulation updates in hours, not weeks
        </p>
      </div>

      <!-- Divider -->
      <div class="mb-10 border-t border-gray-200"></div>

      <!-- Links Grid -->
      <div class="mb-12 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
        <!-- Product -->
        <div>
          <h3 class="mb-5 font-semibold text-gray-900">Product</h3>
          <ul class="space-y-3">
            <li v-for="item in Products" :key="item">
              <a href="#" class="text-sm text-gray-600 hover:text-gray-900">{{ item }}</a>
            </li>
          </ul>
        </div>

        <!-- Company -->
        <div>
          <h3 class="mb-5 font-semibold text-gray-900">Company</h3>
          <ul class="space-y-3">
            <li v-for="item in Companys" :key="item">
              <a href="#" class="text-sm text-gray-600 hover:text-gray-900">{{ item }}</a>
            </li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="mb-5 font-semibold text-gray-900">Support</h3>
          <ul class="space-y-3">
            <li v-for="item in Supports" :key="item">
              <a href="#" class="text-sm text-gray-600 hover:text-gray-900">{{ item }}</a>
            </li>
          </ul>
        </div>

        <!-- Privacy Policy -->
        <div>
          <h3 class="mb-5 font-semibold text-gray-900">Privacy Policy</h3>
          <ul class="space-y-3">
            <li v-for="item in Privacys" :key="item">
              <a href="#" class="text-sm text-gray-600 hover:text-gray-900">{{ item }}</a>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div class="col-span-2 md:col-span-3 lg:col-span-1">
          <h3 class="mb-5 font-semibold whitespace-nowrap text-gray-900">
            Subscribe to our newsletter
          </h3>
          <p class="mb-5 text-sm leading-relaxed text-gray-600 ">
            Join our newsletter to get early alerts on regulation updates, price fluctuations, and
            compliance insights that matter to your business.
          </p>
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="mb-4 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#3C2610]"
          />
          <button
            class="rounded-lg bg-[#3C2610] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#2d1c0c]"
          >
            Subscribe
          </button>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div
        class="flex flex-col gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-sm text-gray-600">Copyright © 2025 LegalWatchDog | All Rights Reserved</p>
        <div class="flex items-center gap-5">
          <a href="https://www.facebook.com" target="_blank" class="opacity-70 hover:opacity-100">
            <img :src="Facebook" alt="Facebook" class="h-4 w-auto" />
          </a>
          <a href="https://twitter.com" target="_blank" class="opacity-70 hover:opacity-100">
            <img :src="Twitter" alt="Twitter" class="h-4 w-auto" />
          </a>
          <a href="https://www.instagram.com" target="_blank" class="opacity-70 hover:opacity-100">
            <img :src="Instagram" alt="Instagram" class="h-4 w-auto" />
          </a>
          <a href="https://www.linkedin.com" target="_blank" class="opacity-70 hover:opacity-100">
            <img :src="LinkedIn" alt="LinkedIn" class="h-4 w-auto" />
          </a>
          <a href="https://www.youtube.com" target="_blank" class="opacity-70 hover:opacity-100">
            <img :src="YouTube" alt="YouTube" class="h-4 w-auto" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
