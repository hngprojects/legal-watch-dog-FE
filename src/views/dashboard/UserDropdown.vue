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
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem asChild>
        <RouterLink :to="{ name: 'profile' }" @click="handleNavigate"> Profile </RouterLink>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <RouterLink :to="{ name: 'organizations' }" @click="handleNavigate">
          Organizations
        </RouterLink>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <RouterLink :to="{ name: 'billing' }" @click="handleNavigate"> Billing </RouterLink>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <RouterLink :to="{ name: 'api-access' }" @click="handleNavigate"> API Access </RouterLink>
      </DropdownMenuItem>
      <DropdownMenuItem @click="emit('logout')">Logout</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
