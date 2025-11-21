<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth-store'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = async () => {
  await authStore.logout()
  router.replace({ name: 'login' })
}
</script>

<template>
  <nav class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
    <div class="flex items-center space-x-4"></div>
    <div class="flex items-center space-x-4">
      <button
        class="text-gray-600 transition hover:text-gray-800"
        type="button"
        @click="handleLogout"
        aria-label="Log out"
        title="Log out"
      >
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H9m5 4v1a3 3 0 01-6 0v-1m6-8V5a3 3 0 00-6 0v1"
          />
        </svg>
      </button>
      <button class="text-gray-600 hover:text-gray-800">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>
      <div
        class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 font-semibold text-gray-600"
      >
        U
      </div>
    </div>
  </nav>
</template>
