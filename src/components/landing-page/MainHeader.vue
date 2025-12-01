<script setup lang="ts">
import { ref, onUnmounted, watch, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BrandLogo from '../reusable/BrandLogo.vue'
import { Button } from '../ui/button'
import { useAuthStore } from '@/stores/auth-store'

import UserDropdown from '@/views/dashboard/UserDropdown.vue'
import UserAvatar from '@/components/dashboard/UserAvatar.vue'
import Swal from '@/lib/swal'

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
  const result = await Swal.fire({
    icon: 'warning',
    title: 'Log out?',
    text: 'You will need to sign in again to access your dashboard.',
    showCancelButton: true,
    confirmButtonText: 'Yes, log me out',
    cancelButtonText: 'Stay logged in',
    confirmButtonColor: '#DC2626',
  })

  if (!result.isConfirmed) return

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
    class="text-text-main sticky top-0 z-50 w-full border-b border-white/80 bg-white/90 backdrop-blur-md"
  >
    <div
      class="app-container mx-auto flex flex-col items-center sm:flex-row w-full sm:items-center justify-between gap-8 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 lg:py-5"
    >
      <!-- LOGO -->
      <RouterLink to="/" aria-label="Homepage" class="shrink-0">
        <BrandLogo class="h-8 w-auto sm:h-10" />
      </RouterLink>

      <!-- DESKTOP NAV -->
      <nav aria-label="Primary" class="hidden flex-1 lg:flex lg:items-center lg:justify-center">
        <ul class="flex items-center gap-6 xl:gap-8">
          <li v-for="link in navLinks" :key="link.name">
            <RouterLink
              :to="link.to"
              class="hover:text-accent-main text-sm font-medium text-gray-500 transition-colors xl:text-base"
            >
              {{ link.name }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <!-- RIGHT SIDE -->
      <div class="relative flex items-center gap-2 sm:gap-3">
        <!-- NOT LOGGED IN -->
        <template v-if="!isAuthenticated">
          <!-- Hide Sign In on mobile, show on tablet+ -->
          <Button
            :as="RouterLink"
            :to="{ path: '/login' }"
            variant="outline"
            size="default"
            class="hidden text-sm sm:inline-flex sm:text-base"
          >
            Sign In
          </Button>

          <!-- Sign Up button - smaller on mobile -->
          <Button
            :as="RouterLink"
            :to="{ path: '/signup' }"
            variant="default"
            size="default"
            class="hidden sm:block text-sm sm:text-base"
          >
            Sign Up
          </Button>
        </template>

        <!-- LOGGED IN VIEW -->
        <div v-else class="hidden items-center gap-3 sm:gap-5 lg:flex">
          <div class="flex items-center space-x-4">
            <UserDropdown @logout="handleLogout">
              <button
                class="btn btn--with-icon flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100"
              >
                <UserAvatar :name="displayName" :size="38" />
                <span
                  class="max-w-[100px] truncate text-sm font-semibold text-gray-800 xl:max-w-[140px]"
                >
                  {{ displayName }}
                </span>
              </button>
            </UserDropdown>
          </div>
        </div>

        <!-- MOBILE/TABLET MENU BUTTON -->
        <button
          @click="isMenuOpen = !isMenuOpen"
          class="btn--icon-only btn--icon-sm btn--default lg:hidden"
          aria-label="Toggle menu"
        >
          <svg
            v-if="!isMenuOpen"
            class="h-5 w-5 sm:h-6 sm:w-6"
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
          <svg
            v-else
            class="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
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

    <!-- MOBILE/TABLET MENU -->
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
        class="fixed top-0 left-0 z-50 h-screen w-full max-w-xs bg-white shadow-2xl sm:max-w-sm lg:hidden"
      >
        <!-- Menu Header -->
        <div class="flex items-center justify-between border-b p-4 sm:p-6">
          <RouterLink to="/" @click="closeMenu">
            <BrandLogo class="h-8 w-auto sm:h-10" />
          </RouterLink>
          <button
            @click="closeMenu"
            class="btn--icon-only btn--icon-sm btn--default"
            aria-label="Close menu"
          >
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

        <!-- Navigation Links -->
        <nav class="flex flex-col gap-1 bg-white p-4 sm:gap-2 sm:p-6">
          <RouterLink
            v-for="link in navLinks"
            :key="link.name"
            :to="link.to"
            @click="closeMenu"
            class="rounded-lg px-3 py-2.5 text-base text-gray-600 transition-colors hover:bg-gray-100 sm:text-lg"
          >
            {{ link.name }}
          </RouterLink>
        </nav>

        <!-- Action Buttons -->
        <div class="space-y-3 border-t p-4 sm:space-y-4 sm:p-6">
          <template v-if="isAuthenticated">
            <!-- User info on mobile/tablet -->
            <div class="mb-4 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <UserAvatar :name="displayName" :size="40" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-gray-800">{{ displayName }}</p>
                <p class="text-xs text-gray-500">Logged in</p>
              </div>
            </div>

            <Button
              :as="RouterLink"
              :to="{ name: 'organizations' }"
              @click="closeMenu"
              class="btn--default btn--sm sm:btn--lg"
            >
              Go to Dashboard
            </Button>
            <Button variant="outline" @click="handleLogout" class="btn--secondary btn--sm sm:btn--lg mt-6">
              Logout
            </Button>
          </template>

          <template v-else>
            <Button
              :as="RouterLink"
              :to="{ path: '/login' }"
              @click="closeMenu"
              variant="outline"
              class="mr-2 w-full"
            >
              Sign In
            </Button>
            <Button
              :as="RouterLink"
              :to="{ path: '/signup' }"
              @click="closeMenu"
              class="w-full text-white"
            >
              Sign Up
            </Button>
          </template>
        </div>
      </div>
    </Transition>

    <!-- Backdrop overlay for mobile menu -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMenuOpen"
        @click="closeMenu"
        class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        aria-hidden="true"
      ></div>
    </Transition>
  </header>
</template>
