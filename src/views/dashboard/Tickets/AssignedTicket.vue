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
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
    },
    lastUpdated: '2h ago'
  },
  {
    id: '#1025',
    title: 'Mining Permit Documentation',
    status: 'In Progress',
    priority: 'High',
    assignee: {
      name: 'Duncan Tito',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
    },
    lastUpdated: '2h ago'
  }
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
  <div class="w-full bg-white min-h-screen p-8" @click="activeMenuId = null">
    <!-- Page Title -->
    <h1 class="text-[28px] font-bold text-[#1A1A1A] mb-8">All Tickets</h1>

    <!-- Controls Row (Tabs & Search) -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <!-- Tabs -->
      <div class="flex items-center gap-2">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click.stop="activeTab = tab"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="[
            activeTab === tab
              ? 'bg-[#3E1C05] text-white'
              : 'bg-transparent text-[#5C5956] hover:bg-gray-50'
          ]"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Right Actions (Filter & Search) -->
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <!-- Filter Button -->
        <button
          class="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-[#344054] text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 3.33333H14M4.66667 8H11.3333M7.33333 12.6667H8.66667" stroke="#344054" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Filter
        </button>

        <!-- Search Input -->
        <div class="relative w-full sm:w-[280px]">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z" stroke="#667085" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search"
            class="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm text-[#101828] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#3E1C05]/10 focus:border-[#3E1C05]"
          />
        </div>
      </div>
    </div>

    <!-- Tickets Table -->
    <div class="w-full border border-[#EAECF0] rounded-lg overflow-hidden">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-[#F7F7F7] border-b border-[#EAECF0]">
            <th class="py-3 px-6 text-left text-xs font-semibold text-[#5C5956] uppercase tracking-wider w-[120px]">
              Ticket ID
            </th>
            <th class="py-3 px-6 text-left text-xs font-semibold text-[#5C5956] uppercase tracking-wider">
              Title
            </th>
            <th class="py-3 px-6 text-left text-xs font-semibold text-[#5C5956] uppercase tracking-wider">
              Status
            </th>
            <th class="py-3 px-6 text-left text-xs font-semibold text-[#5C5956] uppercase tracking-wider">
              Priority
            </th>
            <th class="py-3 px-6 text-left text-xs font-semibold text-[#5C5956] uppercase tracking-wider">
              Assignee
            </th>
            <th class="py-3 px-6 text-left text-xs font-semibold text-[#5C5956] uppercase tracking-wider">
              Last Updated
            </th>
            <th class="py-3 px-6 text-center text-xs font-semibold text-[#5C5956] uppercase tracking-wider w-[80px]">
              Action
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-[#EAECF0]">
          <tr v-for="ticket in tickets" :key="ticket.id" class="hover:bg-gray-50 transition-colors">
            <!-- ID -->
            <td class="py-4 px-6 text-sm font-medium text-[#101828]">
              {{ ticket.id }}
            </td>
            
            <!-- Title -->
            <td class="py-4 px-6 text-sm font-medium text-[#101828]">
              {{ ticket.title }}
            </td>
            
            <!-- Status -->
            <td class="py-4 px-6">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                :class="[
                  ticket.status === 'Open' 
                    ? 'bg-[#F9DBAF]/30 text-[#B93815] border-[#F9DBAF]' 
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                ]"
              >
                {{ ticket.status }}
              </span>
            </td>
            
            <!-- Priority -->
            <td class="py-4 px-6">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFF6ED] text-[#C4320A] border border-[#FFDDC7]"
              >
                {{ ticket.priority }}
              </span>
            </td>
            
            <!-- Assignee -->
            <td class="py-4 px-6">
              <div class="flex items-center gap-3">
                <img 
                  :src="ticket.assignee.avatar" 
                  alt="" 
                  class="h-8 w-8 rounded-full object-cover border border-gray-200"
                />
                <span class="text-sm text-[#344054] font-medium">
                  {{ ticket.assignee.name }}
                </span>
              </div>
            </td>
            
            <!-- Last Updated -->
            <td class="py-4 px-6 text-sm text-[#667085]">
              {{ ticket.lastUpdated }}
            </td>
            
            <!-- Action -->
            <td class="py-4 px-6 text-center relative">
              <button 
                @click.stop="toggleMenu(ticket.id)"
                class="text-[#98A2B3] hover:text-[#344054] p-1 rounded-full hover:bg-gray-100 transition-colors relative z-10"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>

              <!-- Dropdown Menu – ONLY z-index changed -->
              <div 
                v-if="activeMenuId === ticket.id"
                class="absolute right-8 top-8 z-[9999] w-48 bg-white rounded-xl shadow-[0px_4px_24px_rgba(0,0,0,0.1)] border border-gray-100 py-2 text-left animate-in fade-in zoom-in duration-200"
                @click.stop
                
              >
                <button class="w-full px-5 py-3 text-[15px] font-medium text-[#344054] hover:bg-gray-50 text-left transition-colors">
                  Close ticket
                </button>
                <button class="w-full px-5 py-3 text-[15px] font-medium text-[#DC2626] hover:bg-gray-50 text-left transition-colors">
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
  background: #D0D5DD; 
  border-radius: 4px;
}
</style>