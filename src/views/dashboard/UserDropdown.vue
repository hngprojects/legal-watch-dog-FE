<script setup lang="ts">
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import { RouterLink } from 'vue-router'

const emit = defineEmits<{
  (e: 'logout'): void
}>()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem asChild>
        <RouterLink :to="{ name: 'profile' }"> Profile </RouterLink>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <RouterLink :to="{ name: 'organizations' }"> Organizations </RouterLink>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <RouterLink :to="{ name: 'billing' }"> Billing </RouterLink>
      </DropdownMenuItem>
      <DropdownMenuItem @click="emit('logout')">Logout</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
