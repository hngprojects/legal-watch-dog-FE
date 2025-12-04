<script setup>
const notifications = [
  {
    title: "Regulatory Update",
    message: "A new law is now live. Review the update.",
    time: "15 mins ago",
    severity: "normal",
    read: false,
  },
  {
    title: "High-Severity Alert",
    message: "A major policy change was detected. Check details.",
    time: "15 mins ago",
    severity: "high",
    read: false,
  },
  {
    title: "New Task Update",
    message: "Someone mentioned you in a task.",
    time: "10 hrs ago",
    severity: "normal",
    read: true,
  },
  {
    title: "New Changes Alert",
    message: "UK Visa Rules – New salary threshold required.",
    time: "10 hrs ago",
    severity: "normal",
    read: true,
  },
]
</script>

<template>
  <div
    class="w-80 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden"
  >
    <div class="flex items-center justify-between px-4 py-3 border-b">
      <h3 class="text-sm font-semibold text-gray-800">Notifications</h3>

      <button
        class="text-xs font-medium text-gray-500 hover:text-gray-700 transition"
      >
        Mark all as read
      </button>
    </div>

    <div class="max-h-80 overflow-y-auto divide-y">
      <div
        v-for="(item, i) in notifications"
        :key="i"
        :class="[
          'px-4 py-3 cursor-pointer transition',
          item.severity === 'high' ? 'bg-yellow-50' : 'bg-white',
          'hover:bg-gray-50',
        ]"
      >
        <div class="flex items-start gap-3">
          <span
            v-if="!item.read"
            class="mt-1 h-2 w-2 rounded-full bg-red-500 shrink-0"
          ></span>

          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-800 truncate">
              {{ item.title }}
            </p>
            <p class="text-xs text-gray-600 leading-snug">
              {{ item.message }}
            </p>

            <p class="text-[11px] text-gray-400 mt-1">
              {{ item.time }}
            </p>
          </div>

          <button class="text-gray-400 hover:text-gray-600 mt-1 shrink-0">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <circle cx="10" cy="4" r="1" />
              <circle cx="10" cy="10" r="1" />
              <circle cx="10" cy="16" r="1" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="border-t px-4 py-3 text-center">
      <button
        class="text-sm font-medium text-accent-main hover:underline"
      >
        View All
      </button>
    </div>
  </div>
</template>