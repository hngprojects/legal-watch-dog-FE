<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import BrandLogo from '../reusable/BrandLogo.vue'
import { Button } from '../ui/button'

type NavLink = {
  name: string
  to: string | { path: string; hash?: string }
}

const isMenuOpen = ref(false)

const navLinks: NavLink[] = [
  { name: 'Home', to: '/' },
  { name: 'How it Works', to: { path: '/how-it-works' } },
  { name: 'Features', to: { path: '/coming-soon' } },
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

const closeMenu = () => {
  isMenuOpen.value = false
}

onUnmounted(() => {
  toggleBodyScroll(false)
})
</script>

<template>
  <header class="text-text-main sticky top-0 z-50 w-full border-b border-white/80 bg-white/90 backdrop-blur-md">
    <div class="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:py-5">
      <RouterLink to="/" aria-label="Homepage" class="shrink-0">
        <BrandLogo />
      </RouterLink>

      <nav aria-label="Primary" class="hidden flex-1 lg:flex lg:items-center lg:justify-center">
        <ul class="flex items-center gap-8">
          <li v-for="link in navLinks" :key="link.name">
            <RouterLink :to="link.to"
              class="hover:text-brand-deep focus-visible:ring-brand-brown text-base font-medium text-gray-500 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none">
              {{ link.name }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-3">
        <Button :as="RouterLink" :to="{ path: '/waitlist' }" variant="ghost" size="lg"
          class="hidden lg:inline-flex px-7">
          Join Waitlist
        </Button>
        <Button :as="RouterLink" :to="{ path: '/login' }" variant="secondary" size="lg"
          class="hidden lg:inline-flex px-7">
          Sign In
        </Button>

        <button @click="isMenuOpen = !isMenuOpen"
          class="text-text-main hover:text-brand-deep focus-visible:ring-brand-brown ml-auto inline-flex items-center justify-center rounded-full border border-gray-200 p-2 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none lg:hidden"
          aria-label="Toggle navigation" :aria-expanded="isMenuOpen" aria-controls="mobile-menu">
          <span class="sr-only">Toggle main menu</span>
          <svg v-if="!isMenuOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <Transition enter-active-class="transition-transform duration-300 ease-in-out" enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0" leave-active-class="transition-transform duration-300 ease-in-out"
      leave-from-class="translate-x-0" leave-to-class="-translate-x-full">
      <div v-if="isMenuOpen" id="mobile-menu"
        class="fixed top-0 left-0 z-50 h-screen w-full max-w-sm bg-white shadow-2xl lg:hidden" role="dialog"
        aria-modal="true">
        <div class="flex items-center justify-between border-b border-gray-100 p-6">
          <RouterLink to="/" aria-label="Homepage" class="shrink-0" @click="closeMenu">
            <BrandLogo />
          </RouterLink>
          <button @click="closeMenu"
            class="text-text-main hover:text-brand-deep focus-visible:ring-brand-brown rounded-full p-2 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
            aria-label="Close menu">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav class="flex flex-col gap-2 bg-white p-6" aria-label="Mobile navigation">
          <RouterLink v-for="link in navLinks" :key="link.name" :to="link.to" @click="closeMenu"
            class="hover:bg-surface-soft hover:text-brand-deep focus-visible:ring-brand-brown rounded-lg px-3 py-2 text-lg font-normal text-gray-600 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none">
            {{ link.name }}
          </RouterLink>
        </nav>

        <div class="space-y-4 border-t border-gray-100 p-6">
          <Button :as="RouterLink" :to="{ path: '/waitlist' }" class="w-full" @click="closeMenu">
            Join Waitlist
          </Button>
          <Button variant="outline" :as="RouterLink" to="/signup" class="w-full">Sign up</Button>
        </div>
      </div>
    </Transition>
  </header>
</template>
