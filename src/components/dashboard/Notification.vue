<script setup lang="ts">
import { ref } from 'vue'

interface Notification {
  iconType: 'regulatory' | 'alert'
  title: string
  message: string
  time: string
  severity: 'normal' | 'high'
  read: boolean
}

const notifications = ref<Notification[]>([
  {
    iconType: "regulatory",
    title: "Regulatory Update",
    message: "A new law is now live. Review the update.",
    time: "15 mins ago",
    severity: "normal",
    read: false,
  },
  {
    iconType: "alert",
    title: "High-Severity Alert",
    message: "A major policy change was detected. Check details.",
    time: "15 mins ago",
    severity: "high",
    read: false,
  },
  {
    iconType: "alert",
    title: "New Task Update",
    message: "Someone mentioned you in a task.",
    time: "10 hrs ago",
    severity: "normal",
    read: true,
  },
  {
    iconType: "regulatory",
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

      <button v-if="notifications.length > 0" @click="markAllAsRead"
        class="text-xs font-medium text-gray-600 hover:text-gray-700 transition">
        Mark all as read
      </button>
    </div>

    <div class="max-h-96 overflow-y-auto scrollbar-hide">
      <!-- Empty State -->
      <div v-if="notifications.length === 0" class="px-5 py-12 text-center">
        <div class="flex flex-col items-center gap-3">
          <div class="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
            <svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">No notifications</p>
            <p class="text-xs text-gray-500 mt-1">You're all caught up!</p>
          </div>
        </div>
      </div>

      <!-- Notification List -->
      <div v-for="(item, i) in notifications" :key="i" :class="[
        'px-5 py-4 cursor-pointer transition border-b border-gray-100',
        item.severity === 'high' ? 'bg-yellow-50 hover:bg-yellow-100' : 'bg-white hover:bg-gray-50',
      ]">
        <div class="flex items-start gap-3">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <!-- Icon -->
            <span class="shrink-0">
              <!-- Regulatory Icon -->
              <svg v-if="item.iconType === 'regulatory'" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.66675 2.66797L2.00008 2.66797" stroke="#522504" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M7.3335 12.668L2.00016 12.668" stroke="#522504" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M14 12.668L11.3333 12.668" stroke="#522504" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M14 7.66797L7.33333 7.66797" stroke="#522504" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M14 2.66797L12.6667 2.66797" stroke="#522504" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M3.3335 7.66797L2.00016 7.66797" stroke="#522504" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M9.66675 1.33203C9.97738 1.33203 10.1327 1.33203 10.2552 1.38278C10.4186 1.45044 10.5483 1.58022 10.616 1.74358C10.6667 1.86609 10.6667 2.0214 10.6667 2.33203L10.6667 2.9987C10.6667 3.30933 10.6667 3.46464 10.616 3.58715C10.5483 3.75051 10.4186 3.88029 10.2552 3.94795C10.1327 3.9987 9.97738 3.9987 9.66675 3.9987C9.35612 3.9987 9.20081 3.9987 9.07829 3.94795C8.91494 3.88029 8.78516 3.75051 8.71749 3.58715C8.66675 3.46464 8.66675 3.30933 8.66675 2.9987L8.66675 2.33203C8.66675 2.0214 8.66675 1.86609 8.71749 1.74358C8.78516 1.58022 8.91494 1.45044 9.07829 1.38278C9.20081 1.33203 9.35612 1.33203 9.66675 1.33203Z" stroke="#522504" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8.3335 11.332C8.64412 11.332 8.79944 11.332 8.92195 11.3828C9.0853 11.4504 9.21509 11.5802 9.28275 11.7436C9.3335 11.8661 9.3335 12.0214 9.3335 12.332L9.3335 12.9987C9.3335 13.3093 9.3335 13.4646 9.28275 13.5872C9.21509 13.7505 9.0853 13.8803 8.92195 13.948C8.79944 13.9987 8.64412 13.9987 8.3335 13.9987C8.02287 13.9987 7.86755 13.9987 7.74504 13.948C7.58169 13.8803 7.45191 13.7505 7.38424 13.5872C7.3335 13.4646 7.3335 13.3093 7.3335 12.9987L7.3335 12.332C7.3335 12.0214 7.3335 11.8661 7.38424 11.7436C7.45191 11.5802 7.58169 11.4504 7.74504 11.3828C7.86755 11.332 8.02287 11.332 8.3335 11.332Z" stroke="#522504" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M6.3335 6.33203C6.64412 6.33203 6.79944 6.33203 6.92195 6.38278C7.0853 6.45044 7.21509 6.58022 7.28275 6.74358C7.3335 6.86609 7.3335 7.0214 7.3335 7.33203L7.3335 7.9987C7.3335 8.30933 7.3335 8.46464 7.28275 8.58715C7.21509 8.75051 7.0853 8.88029 6.92195 8.94795C6.79944 8.9987 6.64412 8.9987 6.3335 8.9987C6.02287 8.9987 5.86755 8.9987 5.74504 8.94795C5.58169 8.88029 5.45191 8.75051 5.38424 8.58715C5.3335 8.46464 5.3335 8.30933 5.3335 7.9987L5.3335 7.33203C5.3335 7.0214 5.3335 6.86609 5.38424 6.74358C5.45191 6.58022 5.58169 6.45044 5.74504 6.38278C5.86755 6.33203 6.02287 6.33203 6.3335 6.33203Z" stroke="#522504" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <!-- Alert Icon -->
              <svg v-else-if="item.iconType === 'alert'" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 11.3346L12 6.66797L10 11.3346" stroke="#401903" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M6 11.3346L4 6.66797L2 11.3346" stroke="#401903" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M2.66675 6.66667H3.36555C4.20786 6.66667 5.02508 6.19644 5.68281 5.33333C7.03757 3.55556 8.96259 3.55556 10.3173 5.33333C10.9751 6.19644 11.7923 6.66667 12.6346 6.66667H13.3334" stroke="#401903" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M11.9999 14.6654C13.0401 14.6654 13.9454 13.9642 14.412 12.9303C14.647 12.4094 14.7646 12.149 14.565 11.7405C14.3654 11.332 14.0349 11.332 13.3739 11.332H10.6259C9.96491 11.332 9.63439 11.332 9.43483 11.7405C9.23527 12.149 9.3528 12.4094 9.58786 12.9303C10.0545 13.9642 10.9597 14.6654 11.9999 14.6654Z" stroke="#401903" stroke-width="1.5" />
                <path d="M3.99992 14.6654C5.04015 14.6654 5.94538 13.9642 6.41198 12.9303C6.64704 12.4094 6.76457 12.149 6.56501 11.7405C6.36544 11.332 6.03493 11.332 5.3739 11.332H2.62594C1.96491 11.332 1.63439 11.332 1.43483 11.7405C1.23527 12.149 1.3528 12.4094 1.58786 12.9303C2.05445 13.9642 2.95969 14.6654 3.99992 14.6654Z" stroke="#401903" stroke-width="1.5" />
                <path d="M9.33341 2.66536C9.33341 3.40174 8.73646 3.9987 8.00008 3.9987C7.2637 3.9987 6.66675 3.40174 6.66675 2.66536C6.66675 1.92898 7.2637 1.33203 8.00008 1.33203C8.73646 1.33203 9.33341 1.92898 9.33341 2.66536Z" stroke="#401903" stroke-width="1.5" />
              </svg>
            </span>

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