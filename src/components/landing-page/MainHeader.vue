<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import BrandLogo from '../BrandLogo.vue'
import { Button } from '../ui/button'

type NavLink = {
  name: string
  to: string | { path: string; hash?: string }
}

const isMenuOpen = ref(false)

const navLinks: NavLink[] = [
  { name: 'Home', to: '/' },
  { name: 'How it Works', to: { path: '/', hash: '#how-it-works' } },
  { name: 'Features', to: { path: '/', hash: '#features' } },
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
  <header
    class="sticky top-0 z-50 w-full border-b border-white/80 bg-white/90 text-text-main backdrop-blur-md shadow-[0_10px_25px_rgba(14,13,11,0.05)]"
  >
    <div
      class="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:py-5"
    >
      <RouterLink to="/" aria-label="Homepage" class="shrink-0">
        <BrandLogo />
      </RouterLink>

      <nav aria-label="Primary" class="hidden flex-1 lg:flex lg:items-center lg:justify-center">
        <ul class="flex items-center gap-8">
          <li v-for="link in navLinks" :key="link.name">
            <RouterLink
              :to="link.to"
              class="text-base font-medium text-gray-500 transition-colors duration-200 hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-brown focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {{ link.name }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-3">
        <Button
          :as="RouterLink"
          :to="{ path: '/waitlist' }"
          variant="ghost"
          size="lg"
          class="hidden lg:inline-flex"
        >
          Join Waitlist
        </Button>
        <Button :as="RouterLink" :to="{ path: '/login' }" size="lg" class="hidden lg:inline-flex">
          Sign In
        </Button>

        <button
          @click="isMenuOpen = !isMenuOpen"
          class="ml-auto inline-flex items-center justify-center rounded-full border border-gray-200 p-2 text-text-main transition-colors duration-200 hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-brown focus-visible:ring-offset-2 focus-visible:ring-offset-white lg:hidden"
          aria-label="Toggle navigation"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
        >
          <span class="sr-only">Toggle main menu</span>
          <svg
            v-if="!isMenuOpen"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition-transform duration-300 ease-in-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in-out"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="isMenuOpen"
        id="mobile-menu"
        class="fixed left-0 top-0 z-50 h-screen w-full max-w-sm bg-white shadow-2xl lg:hidden"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-center justify-between border-b border-gray-100 p-6">
          <RouterLink to="/" aria-label="Homepage" class="shrink-0" @click="closeMenu">
            <BrandLogo />
          </RouterLink>
          <button
            @click="closeMenu"
            class="rounded-full p-2 text-text-main transition-colors duration-200 hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-brown focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Close menu"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav class="flex flex-col gap-2 p-6 bg-white" aria-label="Mobile navigation">
          <RouterLink
            v-for="link in navLinks"
            :key="link.name"
            :to="link.to"
            @click="closeMenu"
            class="rounded-lg px-3 py-2 text-lg font-medium text-gray-600 transition-colors duration-200 hover:bg-surface-soft hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-brown focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            {{ link.name }}
          </RouterLink>
        </nav>

        <div class="border-t border-gray-100 p-6 space-y-4">
          <Button :as="RouterLink" :to="{ path: '/waitlist' }" class="w-full" @click="closeMenu">
            Request Access
          </Button>
          <Button variant="outline" :as="RouterLink" to="/signup" class="w-full">Sign up</Button>
        </div>
      </div>
    </Transition>
  </header>
</template>
