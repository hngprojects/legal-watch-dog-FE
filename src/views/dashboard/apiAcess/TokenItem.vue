<script setup lang="ts">
import { Button } from '@/components/ui/button'

interface Props {
  name: string
  lastUsed?: string
  expiresOn?: string
  isExpired?: boolean
}

defineProps<Props>()

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<template>
  <div
    class="flex flex-col gap-4 rounded-t-md border-b border-gray-200 p-6 last-of-type:rounded-b-md last-of-type:border-0 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
  >
    <div class="flex items-center gap-4">
      <div
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F5E6D3] text-sm font-semibold text-[#8B4513]"
      >
        {{ getInitials(name) }}
      </div>

      <div class="flex flex-col gap-1">
        <h3 class="text-base font-semibold text-[#0F172A]">{{ name }}</h3>
        <div class="flex items-center gap-2 text-sm text-[#6B7280]">
          <span v-if="lastUsed">Last used {{ lastUsed }}</span>
          <span v-else>Never used</span>
          <template v-if="expiresOn && !isExpired">
            <span>•</span>
            <span>Expires on {{ expiresOn }}</span>
          </template>

          <div v-if="isExpired" class="flex items-center gap-1.5 text-sm">
            <svg
              class="h-4 w-4 text-[#F59E0B]"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span class="text-[#BF6A02] underline">This token has expired</span>
          </div>
        </div>
      </div>
    </div>

    <Button
      variant="outline"
      class="border-[#FCA5A5] whitespace-nowrap text-[#DC2626] hover:bg-[#FEE2E2] hover:text-[#DC2626]"
    >
      Delete
    </Button>
  </div>
</template>
