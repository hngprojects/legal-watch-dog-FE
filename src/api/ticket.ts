import api from '@/lib/api'
import type { CreateTicketPayload, Ticket, TicketPriority } from '@/types/ticket'

type ApiEnvelope<T> = {
  status?: string
  status_code?: number
  message?: string
  data: T
}

type CreateTicketRequest = {
  title: string
  description?: string | null
  content?: Record<string, unknown> | null
  priority: TicketPriority
  source_id?: string | null
  data_revision_id?: string | null
  change_diff_id?: string | null
  assigned_to_user_id?: string | null
  project_id: string
}

type TicketResponse = ApiEnvelope<{ ticket: Ticket } | Ticket>

export const ticketApi = {
  createManualTicket: (organizationId: string, projectId: string, payload: CreateTicketPayload) => {
    const body: CreateTicketRequest = {
      title: payload.title,
      description: payload.description ?? payload.summary ?? null,
      content: payload.content ?? null,
      priority: payload.priority || 'medium',
      source_id: payload.source_id ?? null,
      data_revision_id: payload.data_revision_id ?? payload.revision_id ?? null,
      change_diff_id: payload.change_diff_id ?? null,
      assigned_to_user_id: payload.assigned_to_user_id ?? null,
      project_id: projectId,
    }

    return api.post<TicketResponse>(
      `/organizations/${organizationId}/projects/${projectId}/tickets/`,
      body,
    )
  },
}

export default ticketApi
