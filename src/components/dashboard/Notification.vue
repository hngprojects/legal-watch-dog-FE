<script setup>
import { ref } from 'vue'

const notifications = ref([
  {
    icon: "⚠️",
    title: "Regulatory Update",
    message: "A new law is now live. Review the update.",
    time: "15 mins ago",
    severity: "normal",
    read: false,
  },
  {
    icon: "⚠️",
    title: "High-Severity Alert",
    message: "A major policy change was detected. Check details.",
    time: "15 mins ago",
    severity: "high",
    read: false,
  },
  {
    icon: "📋",
    title: "New Task Update",
    message: "Someone mentioned you in a task.",
    time: "10 hrs ago",
    severity: "normal",
    read: true,
  },
  {
    icon: "📋",
    title: "New Changes Alert",
    message: "UK Visa Rules – New salary threshold required.",
    time: "10 hrs ago",
    severity: "normal",
    read: true,
  },
])

const markAllAsRead = () => {
  notifications.value.forEach(notif => notif.read = true)
}
</script>

<template>
  <div class="w-80 bg-white rounded-lg shadow-xl overflow-hidden">
    <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200">
      <h3 class="text-base font-semibold text-gray-900">Notifications</h3>

      <button 
        v-if="notifications.length > 0"
        @click="markAllAsRead"
        class="text-xs font-medium text-gray-600 hover:text-gray-700 transition"
      >
        Mark all as read
      </button>
    </div>

    <div class="max-h-96 overflow-y-auto scrollbar-hide">
      <div v-if="notifications.length === 0" class="px-5 py-12 text-center">
        <div class="flex flex-col items-center gap-3">
          <div class="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
            <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">No notifications</p>
            <p class="text-xs text-gray-500 mt-1">You're all caught up!</p>
          </div>
        </div>
      </div>

      <div
        v-for="(item, i) in notifications"
        :key="i"
        :class="[
          'px-5 py-4 cursor-pointer transition border-b border-gray-100',
          item.severity === 'high' ? 'bg-yellow-50 hover:bg-yellow-100' : 'bg-white hover:bg-gray-50',
        ]"
      >
        <div class="flex items-start gap-3">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <span class="text-xl shrink-0">{{ item.icon }}</span>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <p class="text-sm font-semibold text-gray-900">
                  {{ item.title }}
                </p>
                <span v-if="!item.read" class="h-2 w-2 rounded-full bg-red-500 shrink-0"></span>
              </div>
              <p class="text-xs text-gray-600 mt-0.5 leading-relaxed">
                {{ item.message }}
              </p>

              <p class="text-[11px] text-gray-400 mt-1.5">
                {{ item.time }}
              </p>
            </div>
          </div>

          <button class="text-gray-400 hover:text-gray-600 shrink-0">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="4" r="1.5" />
              <circle cx="10" cy="10" r="1.5" />
              <circle cx="10" cy="16" r="1.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 px-5 py-3.5 text-center bg-gray-50">
      <button class="text-sm font-medium text-gray-600 hover:text-gray-700 hover:underline">
        View All
      </button>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>