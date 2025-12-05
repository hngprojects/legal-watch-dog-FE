<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { CircleHelp, MailPlus } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useTicketStore } from '@/stores/ticket-store'
import UserInviteModal from './UserInviteModal.vue'

const route = useRoute()
const router = useRouter()
const ticketStore = useTicketStore()

const ticketId = computed(() => route.params.ticketId as string)
const ticket = computed(() => ticketStore.sortedTickets.find((t) => t.id === ticketId.value))
const inviteModalOpen = ref(false)

const handleInviteSubmit = (emails: string[]) => {
  const currentTicket = ticket.value
  if (!currentTicket) return

  const existing = new Set(currentTicket.invites.map((invite) => invite.email.toLowerCase()))
  const newEmails = emails
    .map((email) => email.trim())
    .filter(Boolean)
    .filter((email) => {
      const normalized = email.toLowerCase()
      if (existing.has(normalized)) return false
      existing.add(normalized)
      return true
    })

  if (!newEmails.length) {
    toast.error('No new emails to invite')
    return
  }

  newEmails.forEach((email) => ticketStore.inviteCollaborator(currentTicket.id, email))
  toast.success(newEmails.length === 1 ? 'Invite sent' : 'Invites sent')
  inviteModalOpen.value = false
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

const goBackToTicket = () => router.push({ name: 'tickets' })
</script>

<template>
  <main class="min-h-screen bg-[#F8F7F5] px-4 py-6 sm:px-6 lg:px-10 lg:py-12">
    <div class="mx-auto max-w-5xl space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink as-child>
              <RouterLink :to="{ name: 'ticket-detail', params: { ticketId } }">Ticket</RouterLink>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Invited Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <h1 class="text-2xl font-bold text-[#1F1F1F]">Invited Users</h1>
          <p class="text-sm text-gray-600">Manage collaborators invited to this ticket.</p>
        </div>
        <button
          class="inline-flex items-center gap-2 rounded-lg bg-[#3E1C05] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2f1404]"
          @click="inviteModalOpen = true"
        >
          <MailPlus class="h-4 w-4" />
          Invite Users
        </button>
      </div>

      <div v-if="ticket" class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <div v-if="ticket.invites.length" class="space-y-4">
          <div
            v-for="invite in ticket.invites"
            :key="invite.id"
            class="flex items-center justify-between rounded-lg border border-[#F0ECE9] bg-[#FBFAF7] px-4 py-3 text-sm text-[#1F1F1F]"
          >
            <div class="space-y-1">
              <p class="font-semibold text-[#1F1F1F]">{{ invite.email }}</p>
              <p class="text-xs text-gray-500">Invited on {{ formatDate(invite.invited_at) }}</p>
            </div>
            <span
              class="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700"
            >
              {{ invite.status ? invite.status : 'Pending' }}
            </span>
          </div>
        </div>
        <div
          v-else
          class="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E6E1DB] bg-[#FDFBF7] px-6 py-12 text-center"
        >
          <div
            class="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[#E6E1DB] bg-white"
          >
            <CircleHelp class="h-6 w-6 text-[#8C8278]" />
          </div>
          <p class="text-base font-semibold text-[#1F1F1F]">No User invited</p>
          <p class="mt-1 text-sm text-gray-500">There has been no user invited</p>
        </div>
      </div>

      <div v-else class="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100">
        <p class="text-lg font-semibold text-gray-900">Ticket not found</p>
        <p class="mt-2 text-sm text-gray-600">Return to tickets to select another.</p>
        <button class="btn--default btn--lg mt-4" @click="goBackToTicket">Back to ticket</button>
      </div>
    </div>
    <UserInviteModal v-model:open="inviteModalOpen" @invite="handleInviteSubmit" />
  </main>
</template>
