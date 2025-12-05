<script setup lang="ts">
import { ref, onUnmounted, watch, computed, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import BrandLogo from '../reusable/BrandLogo.vue'
import { Button } from '../ui/button'
import { useAuthStore } from '@/stores/auth-store'

import UserDropdown from '@/views/dashboard/UserDropdown.vue'
import UserAvatar from '@/components/dashboard/UserAvatar.vue'
import Swal from '@/lib/swal'
import OrganizationSwitcher from '@/components/dashboard/OrganizationSwitcher.vue'
import Notification from '@/components/dashboard/Notification.vue'

const router = useRouter()
const route = useRoute()

type NavLink = {
  name: string
  to?: string | { path: string; hash?: string }
  dropdown?: Array<{ name: string; to: string; description?: string }>
}

const isMenuOpen = ref(false)
const isMobileDropdownOpen = ref(false)
const activeDropdown = ref<string | null>(null)

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

const isDashboard = route.path.includes('/dashboard')
const navLinks: NavLink[] = isDashboard
  ? []
  : [
      {
        name: 'Industries',
        dropdown: [
          {
            name: 'Healthcare',
            to: '/coming-soon',
            description: 'Solutions for healthcare providers',
          },
          { name: 'Finance', to: '/coming-soon', description: 'Financial services solutions' },
          { name: 'Retail', to: '/coming-soon', description: 'Retail and e-commerce' },
          { name: 'Manufacturing', to: '/coming-soon', description: 'Manufacturing solutions' },
          { name: 'Education', to: '/coming-soon', description: 'Educational institutions' },
        ],
      },
      { name: 'Pricing', to: '/pricing' },
      {
        name: 'Resources',
        dropdown: [
          { name: 'Blog', to: '/coming-soon', description: 'Latest articles and insights' },
          { name: 'Documentation', to: '/coming-soon', description: 'Technical documentation' },
          { name: 'Case Studies', to: '/coming-soon', description: 'Success stories' },
          { name: 'Guides', to: '/coming-soon', description: 'How-to guides and tutorials' },
          { name: 'Webinars', to: '/coming-soon', description: 'Live and recorded sessions' },
        ],
      },
      { name: 'Partners', to: '/coming-soon' },
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
  activeDropdown.value = null
}

const toggleDropdown = (linkName: string) => {
  if (activeDropdown.value === linkName) {
    activeDropdown.value = null
  } else {
    activeDropdown.value = linkName
  }
}

const closeDropdown = () => {
  activeDropdown.value = null
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

const isNotificationsOpen = ref(false)
const notificationsButtonRef = ref<HTMLElement | null>(null)
const notificationsPopupRef = ref<HTMLElement | null>(null)

const unreadCount = ref(0)

const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value
  if (isNotificationsOpen.value) {
    isMenuOpen.value = false
  }
}

// const closeNotifications = () => {
//   isNotificationsOpen.value = false
// }

const onDocumentClick = (e: MouseEvent) => {
  const target = e.target as Node
  const btn = notificationsButtonRef.value
  const popup = notificationsPopupRef.value

  if (!btn || !popup) return

  if (btn.contains(target)) {
    return
  }

  if (!popup.contains(target)) {
    isNotificationsOpen.value = false
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    isNotificationsOpen.value = false
    activeDropdown.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
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
      <!-- LOGO -->
      <RouterLink to="/" aria-label="Homepage" class="shrink-0">
        <BrandLogo class="h-8 w-auto sm:h-10" />
      </RouterLink>
      <div class="hidden items-center lg:flex">
        <!-- Horizaintal divider -->
        <div class="flex">
          <div class="mx-4 h-10 w-0.5 bg-gray-300"></div>
          <OrganizationSwitcher v-if="isAuthenticated" />
        </div>
      </div>

      <!-- DESKTOP NAV -->
      <nav aria-label="Primary" class="hidden flex-1 lg:flex lg:items-center lg:justify-center">
        <ul class="flex items-center gap-6 xl:gap-8">
          <li v-for="link in navLinks" :key="link.name" class="relative">
            <!-- Dropdown Link -->
            <template v-if="link.dropdown">
              <button
                @click="toggleDropdown(link.name)"
                @mouseenter="activeDropdown = link.name"
                class="hover:text-accent-main flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors xl:text-base"
              >
                {{ link.name }}
                <svg
                  class="h-4 w-4 transition-transform"
                  :class="{ 'rotate-180': activeDropdown === link.name }"
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

              <!-- Dropdown Menu -->
              <Transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-150"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div
                  v-if="activeDropdown === link.name"
                  @mouseleave="closeDropdown"
                  class="absolute top-full left-1/2 z-50 mt-2 w-72 -translate-x-1/2 rounded-lg border border-gray-200 bg-white shadow-lg"
                >
                  <div class="p-2">
                    <RouterLink
                      v-for="item in link.dropdown"
                      :key="item.name"
                      :to="item.to"
                      @click="closeDropdown"
                      class="block rounded-md px-4 py-3 transition-colors hover:bg-gray-50"
                    >
                      <div class="font-medium text-gray-900">{{ item.name }}</div>
                      <div v-if="item.description" class="mt-0.5 text-sm text-gray-500">
                        {{ item.description }}
                      </div>
                    </RouterLink>
                  </div>
                </div>
              </Transition>
            </template>

            <!-- Regular Link -->
            <RouterLink
              v-else
              :to="link.to!"
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
            class="hidden text-sm sm:block sm:text-base"
          >
            Sign Up
          </Button>
        </template>

        <div v-else class="hidden items-center gap-3 sm:gap-5 lg:flex">
          <div class="relative flex items-center">
            <button
              ref="notificationsButtonRef"
              @click="toggleNotifications"
              aria-expanded="false"
              aria-label="Open notifications"
              class="btn--icon-only btn--icon-sm btn--default flex items-center justify-center transition"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>

              <span
                v-if="unreadCount > 0"
                class="pointer-events-none absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-red-600 px-1 text-xs leading-none text-white"
              >
                {{ unreadCount }}
              </span>
            </button>

            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div
                v-if="isNotificationsOpen"
                ref="notificationsPopupRef"
                class="absolute top-full left-0 z-50 mt-3"
              >
                <Notification />
              </div>
            </Transition>
          </div>

          <!-- User dropdown -->
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
        class="fixed top-0 left-0 z-50 h-screen w-full max-w-xs overflow-y-auto bg-white shadow-2xl sm:max-w-sm lg:hidden"
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
        <template v-if="!isDashboard">
          <nav class="flex flex-col gap-1 bg-white p-4 sm:gap-2 sm:p-6">
            <template v-for="link in navLinks" :key="link.name">
              <!-- Dropdown in Mobile -->
              <div v-if="link.dropdown" class="space-y-1">
                <button
                  @click="toggleDropdown(link.name)"
                  class="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-base text-gray-600 transition-colors hover:bg-gray-100 sm:text-lg"
                >
                  {{ link.name }}
                  <svg
                    class="h-5 w-5 transition-transform"
                    :class="{ 'rotate-180': activeDropdown === link.name }"
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

                <!-- Mobile Dropdown Items -->
                <Transition
                  enter-active-class="transition-all duration-200"
                  enter-from-class="opacity-0 max-h-0"
                  enter-to-class="opacity-100 max-h-96"
                  leave-active-class="transition-all duration-200"
                  leave-from-class="opacity-100 max-h-96"
                  leave-to-class="opacity-0 max-h-0"
                >
                  <div v-if="activeDropdown === link.name" class="ml-4 space-y-1 overflow-hidden">
                    <RouterLink
                      v-for="item in link.dropdown"
                      :key="item.name"
                      :to="item.to"
                      @click="closeMenu"
                      class="block rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      {{ item.name }}
                    </RouterLink>
                  </div>
                </Transition>
              </div>

              <!-- Regular Link in Mobile -->
              <RouterLink
                v-else
                :to="link.to!"
                @click="closeMenu"
                class="rounded-lg px-3 py-2.5 text-base text-gray-600 transition-colors hover:bg-gray-100 sm:text-lg"
              >
                {{ link.name }}
              </RouterLink>
            </template>
          </nav>
        </template>

        <!-- Action Buttons -->
        <div class="space-y-5 border-t p-4 sm:space-y-4 sm:p-6">
          <template v-if="isAuthenticated">
            <!-- User Dropdown on Mobile/Tablet -->
            <div class="mb-4">
              <UserDropdown @logout="handleLogout" @navigate="closeMenu">
                <div
                  class="flex w-full cursor-pointer items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors"
                >
                  <UserAvatar :name="displayName" :image-url="avatarUrl" :size="40" />
                  <div class="min-w-0 flex-1 text-left">
                    <p class="truncate text-sm font-semibold text-gray-800">{{ displayName }}</p>
                  </div>
                </div>
              </UserDropdown>
            </div>

            <div class="mb-4">
              <OrganizationSwitcher />
            </div>

            <Button
              :as="RouterLink"
              :to="{ name: 'dashboard' }"
              @click="closeMenu"
              class="btn--default btn--sm sm:btn--lg block w-full"
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
