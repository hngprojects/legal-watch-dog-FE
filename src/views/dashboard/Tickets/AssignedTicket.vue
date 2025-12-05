<script setup lang="ts">
import { ref } from 'vue'

// Mock Data (2 items as requested)
const tickets = [
  {
    id: '#1024',
    title: 'Visa Fee Structure Changes',
    status: 'Open',
    priority: 'High',
    assignee: {
      name: 'Duncan Tito',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    },
    lastUpdated: '2h ago',
  },
  {
    id: '#1025',
    title: 'Mining Permit Documentation',
    status: 'In Progress',
    priority: 'High',
    assignee: {
      name: 'Duncan Tito',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    },
    lastUpdated: '2h ago',
  },
]

const activeTab = ref('All Tickets')
const tabs = ['All Tickets', 'Open', 'Closed']

const activeMenuId = ref<string | null>(null)

const toggleMenu = (id: string) => {
  if (activeMenuId.value === id) {
    activeMenuId.value = null
  } else {
    activeMenuId.value = id
  }
}
</script>

<template>
  <div class="min-h-screen w-full bg-white p-8" @click="activeMenuId = null">
    <!-- Page Title -->
    <h1 class="mb-8 text-[28px] font-bold text-[#1A1A1A]">All Tickets</h1>

    <!-- Controls Row (Tabs & Search) -->
    <div class="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <!-- Tabs -->
      <div class="flex items-center gap-2">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click.stop="activeTab = tab"
          class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          :class="[
            activeTab === tab
              ? 'bg-[#3E1C05] text-white'
              : 'bg-transparent text-[#5C5956] hover:bg-gray-50',
          ]"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Right Actions (Filter & Search) -->
      <div class="flex w-full items-center gap-3 sm:w-auto">
        <!-- Filter Button -->
        <button
          class="flex items-center gap-2 rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm font-medium text-[#344054] transition-colors hover:bg-gray-50"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 3.33333H14M4.66667 8H11.3333M7.33333 12.6667H8.66667"
              stroke="#344054"
              stroke-width="1.33333"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Filter
        </button>

        <!-- Search Input -->
        <div class="relative w-full sm:w-[280px]">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
                stroke="#667085"
                stroke-width="1.66667"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search"
            class="w-full rounded-lg border border-[#E5E7EB] py-2.5 pr-4 pl-10 text-sm text-[#101828] placeholder-[#667085] focus:border-[#3E1C05] focus:ring-2 focus:ring-[#3E1C05]/10 focus:outline-none"
          />
        </div>
      </div>
    </div>

    <!-- Tickets Table -->
    <div class="w-full overflow-hidden rounded-lg border border-[#EAECF0]">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-[#EAECF0] bg-[#F7F7F7]">
            <th
              class="w-[120px] px-6 py-3 text-left text-xs font-semibold tracking-wider text-[#5C5956] uppercase"
            >
              Ticket ID
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold tracking-wider text-[#5C5956] uppercase"
            >
              Title
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold tracking-wider text-[#5C5956] uppercase"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold tracking-wider text-[#5C5956] uppercase"
            >
              Priority
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold tracking-wider text-[#5C5956] uppercase"
            >
              Assignee
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-semibold tracking-wider text-[#5C5956] uppercase"
            >
              Last Updated
            </th>
            <th
              class="w-[80px] px-6 py-3 text-center text-xs font-semibold tracking-wider text-[#5C5956] uppercase"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#EAECF0] bg-white">
          <tr v-for="ticket in tickets" :key="ticket.id" class="transition-colors hover:bg-gray-50">
            <!-- ID -->
            <td class="px-6 py-4 text-sm font-medium text-[#101828]">
              {{ ticket.id }}
            </td>

            <!-- Title -->
            <td class="px-6 py-4 text-sm font-medium text-[#101828]">
              {{ ticket.title }}
            </td>

            <!-- Status -->
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
                :class="[
                  ticket.status === 'Open'
                    ? 'border-[#F9DBAF] bg-[#F9DBAF]/30 text-[#B93815]'
                    : 'border-gray-200 bg-gray-100 text-gray-700',
                ]"
              >
                {{ ticket.status }}
              </span>
            </td>

            <!-- Priority -->
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center rounded-full border border-[#FFDDC7] bg-[#FFF6ED] px-2.5 py-0.5 text-xs font-medium text-[#C4320A]"
              >
                {{ ticket.priority }}
              </span>
            </td>

            <!-- Assignee -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <img
                  :src="ticket.assignee.avatar"
                  alt=""
                  class="h-8 w-8 rounded-full border border-gray-200 object-cover"
                />
                <span class="text-sm font-medium text-[#344054]">
                  {{ ticket.assignee.name }}
                </span>
              </div>
            </td>

            <!-- Last Updated -->
            <td class="px-6 py-4 text-sm text-[#667085]">
              {{ ticket.lastUpdated }}
            </td>

            <!-- Action -->
            <td class="relative px-6 py-4 text-center">
              <button
                @click.stop="toggleMenu(ticket.id)"
                class="relative z-10 rounded-full p-1 text-[#98A2B3] transition-colors hover:bg-gray-100 hover:text-[#344054]"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

              <!-- Dropdown Menu – ONLY z-index changed -->
              <div
                v-if="activeMenuId === ticket.id"
                class="animate-in fade-in zoom-in absolute top-8 right-8 z-[9999] w-48 rounded-xl border border-gray-100 bg-white py-2 text-left shadow-[0px_4px_24px_rgba(0,0,0,0.1)] duration-200"
                @click.stop
              >
                <button
                  class="w-full px-5 py-3 text-left text-[15px] font-medium text-[#344054] transition-colors hover:bg-gray-50"
                >
                  Close ticket
                </button>
                <button
                  class="w-full px-5 py-3 text-left text-[15px] font-medium text-[#DC2626] transition-colors hover:bg-gray-50"
                >
                  Remove Account
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Custom Scrollbar for table if needed */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}
.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #d0d5dd;
  border-radius: 4px;
}
</style>
