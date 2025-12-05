<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, FilePlus, Paperclip, Send, UserPlus2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/stores/auth-store'
import { useTicketStore } from '@/stores/ticket-store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const ticketStore = useTicketStore()

const ticketId = computed(() => route.params.ticketId as string)
const ticket = computed(() => ticketStore.sortedTickets.find((t) => t.id === ticketId.value))

const commentLimit = 500
const comment = ref('')

const authorName = computed(() => {
  const user = authStore.user
  if (!user) return 'You'
  return (
    user.name || `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || user.email || 'You'
  )
})

// const statusLabel = computed(() => {
//   if (!ticket.value) return ''
//   if (ticket.value.status === 'in_progress') return 'In Progress'
//   if (ticket.value.status === 'closed') return 'Closed'
//   return 'Open'
// })

// const priorityLabel = computed(() => {
//   if (!ticket.value) return ''
//   if (ticket.value.priority === 'medium') return 'Medium'
//   if (ticket.value.priority === 'low') return 'Low'
//   return 'High'
// })

const handleBack = () => {
  router.push({ name: 'tickets' })
}

const submitComment = () => {
  if (!ticket.value) return
  if (!comment.value.trim()) {
    toast.error('Add a comment before submitting')
    return
  }

  ticketStore.addComment(ticket.value.id, authorName.value, comment.value.trim())
  toast.success('Comment added')
  comment.value = ''
}

const attachDocument = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !ticket.value) return
  ticketStore.attachDocument(ticket.value.id, file, authorName.value)
  toast.success('Document attached')
  target.value = ''
}

const closeTicket = () => {
  if (!ticket.value) return
  ticketStore.updateStatus(ticket.value.id, 'closed')
  toast.success('Ticket closed')
}

const goToInvites = () =>
  router.push({ name: 'ticket-invited-users', params: { ticketId: ticketId.value } })

const formatDate = (date: string) => new Date(date).toLocaleString()
</script>

<template>
  <main class="min-h-screen flex-1 bg-[#F8F7F5] px-4 py-6 sm:px-6 lg:px-10 lg:py-12">
    <div class="mx-auto max-w-4xl">
      <button
        class="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#401903] hover:underline"
        @click="handleBack"
      >
        <ArrowLeft :size="16" />
        Back to tickets
      </button>

      <div
        v-if="ticket"
        class="overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8"
      >
        <header class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="w-full space-y-2">
            <p class="text-[11px] font-semibold tracking-[0.15em] text-[#C17A3F] uppercase">
              Ticket
            </p>
            <div class="flex w-full flex-col items-center justify-between gap-5 sm:flex-row">
              <div class="w-3/4">
                <h1 class="text-2xl font-bold text-[#1F1F1F] sm:text-3xl">
                  {{ ticket.title }}
                </h1>
              </div>
              <div class="flex items-center gap-2 sm:gap-3">
                <button
                  class="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-[#401903] transition-colors hover:bg-gray-50"
                  @click="closeTicket"
                >
                  <FilePlus :size="16" />
                  Close ticket
                </button>
                <button
                  class="group flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#401903] shadow-sm transition hover:bg-[#401903] hover:text-white"
                  @click="goToInvites"
                >
                  <UserPlus2 :size="18" />
                </button>
              </div>
            </div>
            <p v-if="ticket.summary" class="text-sm text-gray-600">
              {{ ticket.summary }}
            </p>
          </div>
        </header>

        <section class="mt-6 space-y-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-semibold text-[#1F1F1F]">Changes detected</h2>
            <span class="text-xs text-gray-400"
              >Revision ID: {{ ticket.revision_id || 'N/A' }}</span
            >
          </div>

          <div
            v-for="(change, idx) in ticket.change_details"
            :key="idx"
            class="rounded-lg border border-gray-100 bg-[#FBFBFB] p-4"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-1">
                <p class="text-sm font-semibold text-gray-900">{{ change.heading }}</p>
                <p v-if="change.description" class="text-sm text-gray-600">
                  {{ change.description }}
                </p>
              </div>
              <div class="flex items-center gap-2 text-xs text-green-700">
                <span class="flex h-6 w-6 items-center justify-center rounded-full bg-green-100"
                  >✓</span
                >
                <span class="font-semibold">Change</span>
              </div>
            </div>
            <ul
              v-if="change.bullets?.length"
              class="mt-3 list-disc space-y-1 pl-4 text-sm text-gray-700"
            >
              <li v-for="(item, bIdx) in change.bullets" :key="bIdx">{{ item }}</li>
            </ul>
          </div>
        </section>

        <section class="mt-6">
          <div class="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
            <div class="mb-2 flex items-center justify-between">
              <h3 class="text-base font-semibold text-[#1F1F1F]">Post Comment</h3>
              <span class="text-xs text-gray-500">{{ comment.length }}/{{ commentLimit }}</span>
            </div>
            <textarea
              v-model="comment"
              :maxlength="commentLimit"
              rows="4"
              placeholder="Type comment"
              class="w-full rounded-lg border border-gray-200 px-3 py-3 text-sm text-gray-800 focus:border-[#401903] focus:ring-2 focus:ring-[#401903]/15 focus:outline-none"
            ></textarea>
            <div class="mt-3 flex items-center justify-between">
              <label class="btn--link btn--with-icon">
                <input type="file" class="hidden" @change="attachDocument" />
                <Paperclip :size="16" />
                Attach document
              </label>
              <button class="btn--default btn--lg btn--with-icon" @click="submitComment">
                <Send :size="16" />
                Submit
              </button>
            </div>

            <div v-if="ticket.comments.length" class="mt-4 space-y-3">
              <div
                v-for="item in ticket.comments"
                :key="item.id"
                class="rounded-lg bg-[#F9F7F4] p-3"
              >
                <div class="mb-1 flex items-center justify-between text-xs text-gray-500">
                  <span class="font-semibold text-gray-700">{{ item.author }}</span>
                  <span>{{ formatDate(item.created_at) }}</span>
                </div>
                <p class="text-sm text-gray-800">{{ item.message }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div v-else class="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
        <p class="text-lg font-semibold text-gray-900">Ticket not found</p>
        <p class="mt-2 text-sm text-gray-600">Create or open a ticket from a detected change.</p>
        <button class="btn--default btn--lg mt-4" @click="handleBack">Go to tickets</button>
      </div>
    </div>
  </main>
</template>
