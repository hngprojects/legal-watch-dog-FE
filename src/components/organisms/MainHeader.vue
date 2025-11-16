<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
// import { Transition } from 'vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import BrandLogo from '@/components/molecules/BrandLogo.vue'

const isMenuOpen = ref(false)

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'How it Works', href: '#' },
  { name: 'Features', href: '#' },
]

// Handle body scroll lock for mobile menu
let bodyOverflow: string | null = null
const toggleBodyScroll = (lock: boolean) => {
  if (typeof window !== 'undefined' && window.document) {
    const body = document.body
    if (lock) {
      bodyOverflow = body.style.overflow
      body.style.overflow = 'hidden'
    } else {
      body.style.overflow = bodyOverflow || ''
      bodyOverflow = null
    }
  }
}

watch(isMenuOpen, (newVal) => {
  toggleBodyScroll(newVal)
})

onMounted(() => {
  // Initial setup if needed
})

onUnmounted(() => {
  toggleBodyScroll(false) 
})
</script>

<template>
  <header
    class="z-100 w-full font-sans text-text-main bg-white backdrop-blur-md shadow-[0_10px_25px_rgba(14,13,11,0.05),inset_0_1px_0_rgba(255,255,255,0.6)] border border-white/80 rounded-3xl lg:rounded-none lg:border-none lg:shadow-[0_10px_25px_rgba(14,13,11,0.05)]">
    <!-- Main nav container: full-width bg, centered content up to 1440px, counter body p-2 -->
    <div
      class="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-8 lg:h-[100px] lg:mx-0 lg:px-8 xl:px-16">
      <!-- Logo -->
      <a href="#" aria-label="Homepage" class="shrink-0">
        <BrandLogo />
      </a>
      <!-- Desktop nav and CTA: hidden on mobile -->
      <div class="hidden lg:flex items-center justify-center gap-10 flex-1">
        <nav aria-label="Main navigation" class="flex-1">
          <ul class="flex items-center justify-center gap-10">
            <li v-for="link in navLinks" :key="link.name">
              <a :href="link.href"
                class="text-base font-medium text-[#666666] transition-all duration-200 ease-out hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-brown">
                {{ link.name }}
              </a>
            </li>
          </ul>
        </nav>
        <!-- Desktop CTA -->
        <div>
          <BaseButton variant="ghost" size="md" class="ml-10">
            Join Waitlist
          </BaseButton>
          <BaseButton variant="primary" size="md" class="ml-5">
            Sign In
          </BaseButton>
        </div>

      </div>
      <!-- Mobile hamburger button -->
      <button @click="isMenuOpen = !isMenuOpen"
        class="lg:hidden ml-auto p-2 text-text-main transition-colors duration-200 ease-out hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-brown"
        aria-label="Toggle menu" :aria-expanded="isMenuOpen" aria-controls="mobile-menu">
        <span class="sr-only">Toggle main menu</span>
        <!-- Open hamburger icon -->
        <svg v-if="!isMenuOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <!-- Close X icon -->
        <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile menu sidebar (no backdrop for solid white appearance) -->
    <Transition enter-active-class="transition-transform ease-in-out duration-300" enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0" leave-active-class="transition-transform ease-in-out duration-300"
      leave-from-class="translate-x-0" leave-to-class="-translate-x-full">
      <div v-if="isMenuOpen" id="mobile-menu"
        class="fixed left-0 top-0 z-100 h-full w-full max-w-sm bg-white lg:hidden shadow-2xl" role="dialog"
        aria-modal="true" aria-labelledby="mobile-menu-title">
        <!-- Mobile header with logo and close -->
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <a href="#" aria-label="Homepage" class="shrink-0">
            <BrandLogo />
          </a>
          <button @click="isMenuOpen = false"
            class="p-2 text-text-main transition-colors duration-200 ease-out hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-brown"
            aria-label="Close menu">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <!-- Mobile nav links -->
        <nav class="flex flex-col p-6 space-y-4" aria-label="Mobile navigation">
          <a v-for="link in navLinks" :key="link.name" :href="link.href" @click="isMenuOpen = false"
            class="block py-2 px-3 text-lg font-medium text-[#666666] rounded-md transition-all duration-200 ease-out hover:bg-surface-soft hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-brown">
            {{ link.name }}
          </a>
        </nav>
        <!-- Mobile CTA -->
        <div class="p-6 border-t border-gray-100">
          <BaseButton variant="primary" size="md" class="w-full" @click="isMenuOpen = false">
            Join the Waitlist
          </BaseButton>
        </div>
      </div>
    </Transition>
  </header>
</template>
