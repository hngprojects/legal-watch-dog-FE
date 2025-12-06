import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ticketApi } from '@/api/ticket'
import type {
  CreateTicketPayload,
  Ticket,
  TicketAttachment,
  TicketComment,
  TicketInvite,
  TicketStatus,
} from '@/types/ticket'

const storageKey = 'legal-watchdog:tickets'
const ticketModeKey = 'legal-watchdog:ticket-modes'

type TicketMode = 'auto' | 'manual'

const seedTickets: Ticket[] = [
  {
    id: '#1024',
    title: 'Visa Fee Structure Changes',
    summary:
      'Embassy updated fee schedule for B-1/B-2 visas. Assess impact on dependents and pricing.',
    status: 'open',
    priority: 'high',
    jurisdiction_id: 'demo-juris',
    change_summary: 'Detected pricing update and new dependent restriction for visitors.',
    change_details: [
      {
        heading: 'Fee schedule update',
        description: 'Detected increase from $160 to $185 for B-1/B-2 visa applications.',
        bullets: ['Update client-facing materials', 'Notify finance team of new rates'],
      },
    ],
    auto_created: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    comments: [],
    invites: [],
    attachments: [],
  },
  {
    id: '#1025',
    title: 'Mining Permit Documentation',
    summary: 'Permit guidance updated. Review document retention rules.',
    status: 'in_progress',
    priority: 'high',
    jurisdiction_id: 'demo-juris',
    change_details: [
      {
        heading: 'Documentation rules',
        description: 'New documentation retention requirement for quarterly audits.',
        bullets: ['Coordinate with compliance', 'Add reminder in calendar'],
      },
    ],
    auto_created: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    comments: [],
    invites: [],
    attachments: [],
  },
]

const loadFromStorage = () => {
  if (typeof window === 'undefined')
    return { tickets: [...seedTickets], modes: {} as Record<string, TicketMode> }

  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]') as Ticket[]
    const modes = JSON.parse(localStorage.getItem(ticketModeKey) || '{}') as Record<
      string,
      TicketMode
    >
    if (Array.isArray(parsed) && parsed.length) {
      return { tickets: parsed, modes }
    }
    return { tickets: [...seedTickets], modes }
  } catch (err) {
    console.error('Failed to read ticket store', err)
    return { tickets: [...seedTickets], modes: {} as Record<string, TicketMode> }
  }
}

const persistTickets = (tickets: Ticket[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(storageKey, JSON.stringify(tickets))
}

const persistModes = (modes: Record<string, TicketMode>) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(ticketModeKey, JSON.stringify(modes))
}

export const useTicketStore = defineStore('ticket', () => {
  const { tickets: initialTickets, modes: initialModes } = loadFromStorage()

  const tickets = ref<Ticket[]>(initialTickets)
  const ticketModes = ref<Record<string, TicketMode>>(initialModes)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const parseError = (err: unknown, fallback: string) => {
    const apiErr = err as {
      response?: { data?: { message?: string; detail?: string | Array<{ msg?: string }> } }
      message?: string
    }
    const detail = apiErr.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg
    return apiErr.response?.data?.message || apiErr.message || fallback
  }

  const sortedTickets = computed(() =>
    [...tickets.value].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    ),
  )

  const upsertTicket = (ticket: Ticket) => {
    tickets.value = [ticket, ...tickets.value.filter((t) => t.id !== ticket.id)]
    persistTickets(tickets.value)
  }

  const resolveTicket = (payload: unknown): Ticket | null => {
    if (!payload || typeof payload !== 'object') return null
    const dataObj = payload as { ticket?: unknown }
    if (dataObj.ticket && typeof dataObj.ticket === 'object') {
      return dataObj.ticket as Ticket
    }
    if ((payload as Ticket).id) {
      return payload as Ticket
    }
    return null
  }

  const createTicket = async (organizationId: string, payload: CreateTicketPayload) => {
    loading.value = true
    error.value = null

    if (!organizationId) {
      error.value = 'Select an organization before creating a ticket'
      loading.value = false
      return null
    }

    if (!payload.project_id) {
      error.value = 'Project information missing for ticket creation'
      loading.value = false
      return null
    }

    try {
      const response = await ticketApi.createManualTicket(
        organizationId,
        payload.project_id,
        payload,
      )
      const rawTicket = resolveTicket(response?.data?.data) ?? resolveTicket(response?.data)
      const now = new Date().toISOString()
      const ticket: Ticket = {
        id: rawTicket?.id || `T-${Date.now()}`,
        title: rawTicket?.title || payload.title,
        description: rawTicket?.description ?? payload.description ?? payload.summary ?? null,
        summary: rawTicket?.summary ?? payload.summary,
        status: rawTicket?.status || 'open',
        priority: rawTicket?.priority || payload.priority || 'high',
        jurisdiction_id: rawTicket?.jurisdiction_id ?? payload.jurisdiction_id,
        project_id: rawTicket?.project_id ?? payload.project_id,
        source_id: rawTicket?.source_id ?? payload.source_id,
        revision_id: rawTicket?.revision_id ?? payload.revision_id,
        data_revision_id:
          rawTicket?.data_revision_id ?? payload.data_revision_id ?? payload.revision_id,
        change_diff_id: rawTicket?.change_diff_id ?? payload.change_diff_id ?? null,
        change_summary: rawTicket?.change_summary ?? payload.change_summary,
        content: rawTicket?.content ?? payload.content ?? null,
        change_details:
          (rawTicket?.change_details && rawTicket.change_details.length > 0
            ? rawTicket.change_details
            : payload.change_details) || [],
        auto_created: rawTicket?.auto_created ?? payload.auto_created,
        assigned_to_user_id: rawTicket?.assigned_to_user_id ?? payload.assigned_to_user_id ?? null,
        created_at: rawTicket?.created_at || now,
        updated_at: rawTicket?.updated_at || now,
        comments: rawTicket?.comments || [],
        invites: rawTicket?.invites || [],
        attachments: rawTicket?.attachments || [],
      }

      upsertTicket(ticket)
      return ticket
    } catch (err) {
      console.error('Failed to create ticket', err)
      error.value = parseError(err, 'Failed to create ticket')
      return null
    } finally {
      loading.value = false
    }
  }

  const addComment = (ticketId: string, author: string, message: string) => {
    const target = tickets.value.find((t) => t.id === ticketId)
    if (!target) return null

    const comment: TicketComment = {
      id: `${ticketId}-c-${Date.now()}`,
      author,
      message,
      created_at: new Date().toISOString(),
    }

    target.comments.unshift(comment)
    target.updated_at = new Date().toISOString()
    upsertTicket(target)
    return comment
  }

  const inviteCollaborator = (ticketId: string, email: string) => {
    const target = tickets.value.find((t) => t.id === ticketId)
    if (!target) return null

    const invite: TicketInvite = {
      id: `${ticketId}-i-${Date.now()}`,
      email,
      invited_at: new Date().toISOString(),
      status: 'pending',
    }

    target.invites.push(invite)
    target.updated_at = new Date().toISOString()
    upsertTicket(target)
    return invite
  }

  const attachDocument = (
    ticketId: string,
    file: { name: string; size?: number },
    uploadedBy: string,
  ) => {
    const target = tickets.value.find((t) => t.id === ticketId)
    if (!target) return null

    const attachment: TicketAttachment = {
      id: `${ticketId}-a-${Date.now()}`,
      name: file.name,
      size: file.size ? `${Math.round(file.size / 1024)} KB` : 'N/A',
      uploaded_at: new Date().toISOString(),
      uploaded_by: uploadedBy,
    }

    target.attachments.push(attachment)
    target.updated_at = new Date().toISOString()
    upsertTicket(target)
    return attachment
  }

  const updateStatus = (ticketId: string, status: TicketStatus) => {
    const target = tickets.value.find((t) => t.id === ticketId)
    if (!target) return null
    target.status = status
    target.updated_at = new Date().toISOString()
    upsertTicket(target)
    return target
  }

  const hasTicketForRevision = (revisionId?: string) => {
    if (!revisionId) return false
    return tickets.value.some(
      (t) => t.revision_id === revisionId || t.data_revision_id === revisionId,
    )
  }

  const getModeForJurisdiction = (jurisdictionId?: string) => {
    if (!jurisdictionId) return 'manual' as TicketMode
    return ticketModes.value[jurisdictionId] || 'manual'
  }

  const ticketForRevision = (revisionId?: string) => {
    if (!revisionId) return undefined
    return tickets.value.find(
      (t) => t.revision_id === revisionId || t.data_revision_id === revisionId,
    )
  }

  const setModeForJurisdiction = (jurisdictionId: string, mode: TicketMode) => {
    ticketModes.value = { ...ticketModes.value, [jurisdictionId]: mode }
    persistModes(ticketModes.value)
  }

  return {
    tickets,
    sortedTickets,
    loading,
    error,

    createTicket,
    addComment,
    inviteCollaborator,
    attachDocument,
    updateStatus,
    hasTicketForRevision,
    ticketForRevision,
    getModeForJurisdiction,
    setModeForJurisdiction,
  }
})
