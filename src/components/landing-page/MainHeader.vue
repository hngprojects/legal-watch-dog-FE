<script setup lang="ts">
import { ref, onUnmounted, watch, computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import BrandLogo from '../reusable/BrandLogo.vue'
import { Button } from '../ui/button'
import { useAuthStore } from '@/stores/auth-store'

import UserDropdown from '@/views/dashboard/UserDropdown.vue'
import UserAvatar from '@/components/dashboard/UserAvatar.vue'
import Swal from '@/lib/swal'
import OrganizationSwitcher from '@/components/dashboard/OrganizationSwitcher.vue'

const router = useRouter()

type NavLink = {
  name: string
  to: string | { path: string; hash?: string }
}

const isMenuOpen = ref(false)
const isMobileDropdownOpen = ref(false)

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const avatarUrl = computed(
  () =>
    authStore.user?.avatar_url ||
    (authStore.user as { profile_picture_url?: string })?.profile_picture_url ||
    '',
)
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
  if (!newVal) {
    isMobileDropdownOpen.value = false
  }
})

const closeMenu = () => {
  isMenuOpen.value = false
  isMobileDropdownOpen.value = false
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
      class="app-container mx-auto flex w-full items-center justify-between px-3 py-3 sm:px-4 sm:py-4 lg:py-5"
    >
      <!-- LOGO | Org Switch-->
      <RouterLink to="/" aria-label="Homepage" class="shrink-0">
        <BrandLogo class="h-8 w-auto sm:h-10" />
      </RouterLink>
      <div class="hidden lg:flex items-center">
        <!-- Horizaintal divider -->
        <div class="mx-4 w-0.5 bg-gray-300 h-10"></div>
        <div>
          <OrganizationSwitcher v-if="isAuthenticated" />
        </div>
      </div>

      <!-- DESKTOP NAV ICON-->
      <div class="hidden flex-1 items-center justify-center gap-6 lg:flex">
        <nav aria-label="Primary" class="flex items-center justify-`center">
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
      </div>

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
            class="hidden text-sm sm:block sm:text-base"
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
                <UserAvatar :name="displayName" :image-url="avatarUrl" :size="38" />
                <span
                  class="max-w-[100px] truncate text-sm font-semibold text-gray-800 xl:max-w-[140px]"
                >
                  {{ displayName }}
                </span>
              </button>
            </UserDropdown>
          </div>
          <div class="lg:hidden">
            <OrganizationSwitcher />
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
        <div class="space-y-5 border-t p-4 sm:space-y-4 sm:p-6">
          <template v-if="isAuthenticated">
            <!-- User Dropdown on Mobile/Tablet -->
            <div class="mb-4">
              <UserDropdown @logout="handleLogout" @navigate="closeMenu">
                <button
                  class="flex w-full items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors cursor-pointer hover:bg-accent-main/20"
                >
                  <UserAvatar :name="displayName" :image-url="avatarUrl" :size="40" />
                  <div class="min-w-0 flex-1 text-left">
                    <p class="truncate text-sm font-semibold text-gray-800">{{ displayName }}</p>
                    <p class="text-xs text-gray-500">View profile & settings</p>
                  </div>
                  <svg
                    class="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </UserDropdown>
            </div>

            <div class="mb-4">
              <OrganizationSwitcher />
            </div>

            <Button
              :as="RouterLink"
              :to="{ name: 'dashboard' }"
              @click="closeMenu"
              class="btn--default btn--sm sm:btn--lg w-full block"
            >
              Go to Dashboard
            </Button>
          </template>

          <template v-else>
            <Button
              :as="RouterLink"
              :to="{ path: '/login' }"
              @click="closeMenu"
              variant="outline"
              class="w-full mr-2"
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
