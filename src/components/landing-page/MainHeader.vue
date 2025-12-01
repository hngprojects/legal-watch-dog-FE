<script setup lang="ts">
import { ref, onUnmounted, watch, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BrandLogo from '../reusable/BrandLogo.vue'
import { Button } from '../ui/button'
import { useAuthStore } from '@/stores/auth-store'

import UserDropdown from '@/views/dashboard/UserDropdown.vue'
import UserAvatar from '@/components/dashboard/UserAvatar.vue'

const router = useRouter()

type NavLink = {
  name: string
  to: string | { path: string; hash?: string }
}

const isMenuOpen = ref(false)

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const displayName = computed(() => {
  const user = authStore.user
  if (!user) return 'User'
  const fullName = user.name || `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()
  if (fullName) return fullName
  if (user.email) return user.email.split('@')[0] || 'User'
  return 'User'
})

onMounted(async () => {
  if (!authStore.user && authStore.accessToken) {
    await authStore.loadCurrentUser()
  }
})

const navLinks: NavLink[] = [
  { name: 'Home', to: '/' },
  { name: 'How it Works', to: { path: '/how-it-works' } },
  { name: 'Contact Us', to: { path: '/contact-us' } },
]

let bodyOverflow: string | null = null
const toggleBodyScroll = (lock: boolean) => {
  if (typeof document === 'undefined') return
  const body = document.body
  if (lock) {
    bodyOverflow = body.style.overflow
    body.style.overflow = 'hidden'
    return
  }
  body.style.overflow = bodyOverflow || ''
  bodyOverflow = null
}

watch(isMenuOpen, (newVal) => {
  toggleBodyScroll(newVal)
})

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleLogout = async () => {
  isMenuOpen.value = false
  await authStore.logout()
  router.replace({ name: 'login' })
}

onUnmounted(() => {
  toggleBodyScroll(false)
})
</script>

<template>
  <header
    class="text-text-main container--wide sticky top-0 z-50 w-full border-b border-white/80 bg-white/90 backdrop-blur-md"
  >
    <div
      class="app-container mx-auto flex w-full flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row sm:px-0 lg:py-5"
    >
      <RouterLink to="/" aria-label="Homepage" class="shrink-0">
        <BrandLogo />
      </RouterLink>

      <nav aria-label="Primary" class="hidden flex-1 lg:flex lg:items-center lg:justify-center">
        <ul class="flex items-center gap-8">
          <li v-for="link in navLinks" :key="link.name">
            <RouterLink
              :to="link.to"
              class="hover:text-accent-main text-base font-medium text-gray-500 transition-colors"
            >
              {{ link.name }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- RIGHT SIDE -->
      <div class="relative flex w-full items-center gap-3 sm:w-auto">
        <!-- NOT LOGGED IN -->
        <template v-if="!isAuthenticated">
          <div class="hidden flex-col gap-2 sm:flex sm:flex-row">
            <Button :as="RouterLink" :to="{ path: '/login' }" variant="default" size="lg">
              Sign In
            </Button>
            <Button :as="RouterLink" :to="{ path: '/signup' }" variant="default" size="lg">
              Sign Up
            </Button>
          </div>
        </template>

        <!-- LOGGED IN VIEW — U ICON + DROPDOWN -->
        <div v-else class="flex items-center gap-5">
          <div class="flex items-center space-x-4">
            <UserDropdown @logout="handleLogout">
              <button class="btn btn--with-icon">
                <UserAvatar :name="displayName" :size="38" />
                <span class="max-w-[140px] truncate text-sm font-semibold text-gray-800">
                  {{ displayName }}
                </span>
              </button>
            </UserDropdown>
          </div>
        </div>

        <!-- MOBILE MENU BUTTON -->
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="btn--icon-only btn--default btn--icon-sm ml-auto lg:hidden"
        >
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

    <!-- Mobile Menu — unchanged -->
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
        class="fixed top-0 left-0 z-50 h-screen w-full max-w-sm bg-white shadow-2xl lg:hidden"
      >
        <div class="flex items-center justify-between border-b p-6">
          <RouterLink to="/" @click="closeMenu">
            <BrandLogo />
          </RouterLink>
          <button @click="closeMenu" class="btn--icon-only btn--default btn--icon-sm">
            <svg class="h-6 w-6" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav class="flex flex-col gap-2 bg-white p-6">
          <RouterLink
            v-for="link in navLinks"
            :key="link.name"
            :to="link.to"
            @click="closeMenu"
            class="rounded-lg px-3 py-2 text-lg text-gray-600 hover:bg-gray-100"
          >
            {{ link.name }}
          </RouterLink>
        </nav>

        <div class="space-y-4 border-t p-6">
          <template v-if="isAuthenticated">
            <Button :as="RouterLink" :to="{ name: 'organizations' }" class="w-full text-white">
              Go to Dashboard
            </Button>
            <Button variant="outline" @click="handleLogout" class="w-full"> Logout </Button>
          </template>

          <template v-else>
            <div class="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" :as="RouterLink" :to="{ path: '/login' }" class="w-full">
                Sign in
              </Button>
              <Button variant="outline" :as="RouterLink" :to="{ path: '/signup' }" class="w-full">
                Sign up
              </Button>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>
