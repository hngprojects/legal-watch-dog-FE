<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'
import BrandLogo from '@/components/molecules/BrandLogo.vue'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet'

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
        <NavigationMenu :viewport="false" class="w-full justify-center bg-transparent shadow-none">
          <NavigationMenuList class="flex items-center gap-8 bg-transparent p-0 shadow-none">
            <NavigationMenuItem v-for="link in navLinks" :key="link.name">
              <NavigationMenuLink as-child>
                <RouterLink
                  :to="link.to"
                  class="rounded-md px-3 py-2 text-base font-medium text-gray-500 transition-colors duration-200 hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-brown focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  {{ link.name }}
                </RouterLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
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
        <Button
          :as="RouterLink"
          :to="{ path: '/waitlist' }"
          size="lg"
          class="hidden lg:inline-flex"
        >
          Request Access
        </Button>

        <Sheet v-model:open="isMenuOpen">
          <SheetTrigger as-child>
            <Button
              variant="outline"
              size="icon"
              class="ml-auto border-gray-200 text-text-main hover:text-brand-deep lg:hidden"
              aria-label="Toggle navigation"
            >
              <Menu v-if="!isMenuOpen" class="size-5" />
              <X v-else class="size-5" />
              <span class="sr-only">Toggle main menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" class="w-full max-w-sm gap-0 p-0">
            <SheetHeader
              class="flex flex-row items-center justify-between border-b border-gray-100 px-6 py-5 text-left"
            >
              <SheetClose as-child>
                <RouterLink to="/" aria-label="Homepage" class="shrink-0">
                  <BrandLogo />
                </RouterLink>
              </SheetClose>
              <SheetClose as-child>
                <Button variant="ghost" size="icon" class="text-text-main hover:text-brand-deep">
                  <X class="size-5" />
                  <span class="sr-only">Close menu</span>
                </Button>
              </SheetClose>
            </SheetHeader>

            <nav class="flex flex-col gap-2 px-6 py-6" aria-label="Mobile navigation">
              <SheetClose
                v-for="link in navLinks"
                :key="link.name"
                as-child
              >
                <RouterLink
                  :to="link.to"
                  class="rounded-lg px-3 py-2 text-lg font-medium text-gray-600 transition-colors duration-200 hover:bg-surface-soft hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-brown focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                >
                  {{ link.name }}
                </RouterLink>
              </SheetClose>
            </nav>

            <SheetFooter class="px-6 pb-6 pt-0">
              <SheetClose as-child>
                <Button :as="RouterLink" :to="{ path: '/waitlist' }" class="w-full">
                  Request Access
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
</template>
