<script setup lang="ts">
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import { RouterLink } from 'vue-router'

const emit = defineEmits<{
  (e: 'logout'): void
  (e: 'navigate'): void
}>()

const handleNavigate = () => {
  emit('navigate')
}

const dropdownLinks = [
  {
    to: 'profile',
    name: 'Profile',
  },
  {
    to: 'organizations',
    name: 'Organizations',
  },
  {
    to: 'billing',
    name: 'Billing',
  },
]
</script>

<template>
  <div class="hidden lg:block">
    <DropdownMenu>
      <DropdownMenuTrigger>
        <slot />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <template :key="link.name" v-for="link in dropdownLinks">
          <DropdownMenuItem asChild>
            <RouterLink :to="{ name: link.to }" @click="handleNavigate">
              {{ link.name }}
            </RouterLink>
          </DropdownMenuItem>
        </template>
        <DropdownMenuItem @click="emit('logout')">Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
  <div class="lg:hidden">
    <slot />
    <ul class="space-y-2 p-3 *:px-2 *:py-1.5 *:text-sm">
      <li :key="link.name" v-for="link in dropdownLinks">
        <RouterLink :to="{ name: link.to }" @click="handleNavigate">
          {{ link.name }}
        </RouterLink>
      </li>
      <button @click="emit('logout')">Logout</button>
    </ul>
  </div>
</template>
