<script setup lang="ts">
import { ref, onUnmounted, watch, computed, onMounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import BrandLogo from '../reusable/BrandLogo.vue'
import { Button } from '../ui/button'
import { useAuthStore } from '@/stores/auth-store'

import UserDropdown from '@/views/dashboard/UserDropdown.vue'
import UserAvatar from '@/components/dashboard/UserAvatar.vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { toast } from 'vue-sonner'
import OrganizationSwitcher from '@/components/dashboard/OrganizationSwitcher.vue'
import Notification from '@/components/dashboard/Notification.vue'
import { notificationService } from '@/api/notification'

const router = useRouter()
const { confirm: openConfirm } = useConfirmDialog()
const route = useRoute()

type NavLink = {
  name: string
  to?: string | { path: string; hash?: string }
  dropdown?: Array<{ name: string; to: string; description?: string }>
}

const isMenuOpen = ref(false)
const isMobileDropdownOpen = ref(false)
const activeDropdown = ref<string | null>(null)
const activeMobileDropdown = ref<string | null>(null)

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

const fetchUnreadCount = async () => {
  try {
    const stats = await notificationService.getStats()
    unreadCount.value = stats.unread_count
  } catch (err) {
    console.error('Failed to fetch notification stats', err)
    unreadCount.value = 0
  }
}
onMounted(() => {
  if (isAuthenticated.value) {
    fetchUnreadCount()
  }
})
const isDashboard = route.path.includes('/dashboard')
const navLinks: NavLink[] = isDashboard
  ? []
  : [
      {
        name: 'Company',
        dropdown: [
          { name: 'About Us', to: '/about-us', description: 'Get to know us' },
          { name: 'FAQ', to: '/faq', description: 'Frequently asked questions' },
          { name: 'Blog', to: '/blog', description: 'Latest articles and insights' },
          { name: 'Careers', to: '/careers', description: 'Want to join us?' },
        ],
      },
      { name: 'Pricing', to: '/pricing' },
      { name: 'Contact Us', to: '/contact-us' },
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
    activeMobileDropdown.value = null
  }
})

const closeMenu = () => {
  isMenuOpen.value = false
  isMobileDropdownOpen.value = false
  activeDropdown.value = null
  activeMobileDropdown.value = null
}

const toggleDropdown = (linkName: string) => {
  if (activeDropdown.value === linkName) {
    activeDropdown.value = null
  } else {
    activeDropdown.value = linkName
  }
}

const toggleMobileDropdown = (linkName: string) => {
  if (activeMobileDropdown.value === linkName) {
    activeMobileDropdown.value = null
  } else {
    activeMobileDropdown.value = linkName
  }
}

const closeDropdown = () => {
  activeDropdown.value = null
}

const handleLogout = () => {
  openConfirm({
    title: 'Log out?',
    description: 'You will need to sign in again to access your dashboard.',
    confirmText: 'Log out',
    cancelText: 'Cancel',
    async onConfirm() {
      isMenuOpen.value = false

      await authStore.logout()
      toast.success('You have been logged out')

      router.replace({ name: 'login' })
    },
  })
}

const isNotificationsOpen = ref(false)
const isMobileNotificationsOpen = ref(false)
const notificationsButtonRef = ref<HTMLElement | null>(null)
const notificationsPopupRef = ref<HTMLElement | null>(null)
const unreadCount = ref(0)

const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value
  if (isNotificationsOpen.value) {
    isMenuOpen.value = false
  }
}

const toggleMobileNotifications = () => {
  isMobileNotificationsOpen.value = !isMobileNotificationsOpen.value
}

const onDocumentClick = (e: MouseEvent) => {
  const target = e.target as Node
  const btn = notificationsButtonRef.value
  const popup = notificationsPopupRef.value

  if (!btn || !popup) return
  if (btn.contains(target)) return
  if (!popup.contains(target)) {
    isNotificationsOpen.value = false
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    isNotificationsOpen.value = false
    activeDropdown.value = null
    isMobileNotificationsOpen.value = false
    activeMobileDropdown.value = null
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
      <RouterLink to="/" aria-label="Homepage" class="shrink-0">
        <BrandLogo class="h-8 w-auto sm:h-10" />
      </RouterLink>

      <div class="hidden items-center lg:flex">
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
          <Button
            :as="RouterLink"
            :to="{ path: '/login' }"
            variant="outline"
            size="default"
            class="hidden text-sm sm:inline-flex sm:text-base"
          >
            Sign In
          </Button>

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
              aria-label="Open notifications"
              class="btn--icon-only btn--icon-sm btn--default flex items-center justify-center transition hover:opacity-80"
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
                @click.stop
              >
                <Notification v-model:unreadCount="unreadCount" />
              </div>
            </Transition>
          </div>

          <!-- User Dropdown -->
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

        <!-- MOBILE MENU TOGGLE -->
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

    <!-- MOBILE MENU -->
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

        <!-- AUTHENTICATED USER SECTION -->
        <template v-if="isAuthenticated">
          <div class="border-b p-4 sm:p-6">
            <UserDropdown @logout="handleLogout">
              <button class="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-gray-100">
                <UserAvatar :name="displayName" :image-url="avatarUrl" :size="48" />
                <div class="flex-1 overflow-hidden text-left">
                  <p class="truncate text-base font-semibold text-gray-900">
                    {{ displayName }}
                  </p>
                  <p class="truncate text-sm text-gray-500">
                    {{ authStore.user?.email }}
                  </p>
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

          <!-- Organization Switcher -->
          <div class="border-b p-4 sm:p-6">
            <OrganizationSwitcher />
          </div>

          <!-- Notifications Button -->
          <div class="border-b p-4 sm:p-6">
            <button
              @click="toggleMobileNotifications"
              class="flex w-full items-center justify-between rounded-lg px-4 py-3 transition hover:bg-gray-100"
            >
              <div class="flex items-center gap-3">
                <svg
                  class="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.8"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span class="text-sm font-medium text-gray-900">Notifications</span>
              </div>
              <div class="flex items-center gap-2">
                <span
                  v-if="unreadCount > 0"
                  class="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-semibold text-white"
                >
                  {{ unreadCount }}
                </span>
                <svg
                  class="h-4 w-4 text-gray-400 transition-transform"
                  :class="{ 'rotate-180': isMobileNotificationsOpen }"
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
              </div>
            </button>

            <Transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div v-if="isMobileNotificationsOpen" class="mt-3 overflow-hidden">
                <Notification v-model:unreadCount="unreadCount" />
              </div>
            </Transition>
          </div>
        </template>

        <!-- NAV LINKS -->
        <template v-if="!isDashboard">
          <nav class="flex flex-col gap-1 p-4 sm:gap-2 sm:p-6">
            <div v-for="link in navLinks" :key="link.name">
              <!-- Dropdown Link -->
              <template v-if="link.dropdown">
                <button
                  @click="toggleMobileDropdown(link.name)"
                  class="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-base font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  <span>{{ link.name }}</span>
                  <svg
                    class="h-5 w-5 transition-transform"
                    :class="{ 'rotate-180': activeMobileDropdown === link.name }"
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

                <Transition
                  enter-active-class="transition ease-out duration-200"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition ease-in duration-150"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-2"
                >
                  <div
                    v-if="activeMobileDropdown === link.name"
                    class="mt-1 ml-4 space-y-1 border-l-2 border-gray-200 pl-4"
                  >
                    <RouterLink
                      v-for="item in link.dropdown"
                      :key="item.name"
                      :to="item.to"
                      @click="closeMenu"
                      class="block rounded-md px-3 py-2 transition hover:bg-gray-50"
                    >
                      <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
                      <div v-if="item.description" class="mt-0.5 text-xs text-gray-500">
                        {{ item.description }}
                      </div>
                    </RouterLink>
                  </div>
                </Transition>
              </template>

              <!-- Regular Link -->
              <RouterLink
                v-else
                :to="link.to!"
                @click="closeMenu"
                class="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 transition hover:bg-gray-50"
              >
                {{ link.name }}
              </RouterLink>
            </div>
          </nav>
        </template>

        <!-- AUTH BUTTONS / LOGOUT -->
        <div class="border-t p-4 sm:p-6">
          <template v-if="!isAuthenticated">
            <div class="space-y-3">
              <Button
                :as="RouterLink"
                :to="{ path: '/login' }"
                @click="closeMenu"
                variant="outline"
                size="default"
                class="w-full text-base"
              >
                Sign In
              </Button>

              <Button
                :as="RouterLink"
                :to="{ path: '/signup' }"
                @click="closeMenu"
                variant="default"
                size="default"
                class="w-full text-base"
              >
                Sign Up
              </Button>
            </div>
          </template>

          <template v-else>
            <Button
              @click="handleLogout"
              class="mt-6 cursor-pointer self-center px-6 text-sm sm:mt-7 sm:px-8 sm:text-base lg:mt-8"
              size="lg"
              variant="default"
            >
              Log Out
            </Button>
          </template>
        </div>
      </div>
    </Transition>

    <!-- MOBILE OVERLAY -->
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
