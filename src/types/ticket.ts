export type TicketStatus = 'open' | 'in_progress' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'

export interface TicketChange {
  heading: string
  description?: string
  bullets?: string[]
}

export interface TicketComment {
  id: string
  author: string
  message: string
  created_at: string
}

export interface TicketInvite {
  id: string
  email: string
  invited_at: string
  status: 'pending' | 'accepted'
}

export interface TicketAttachment {
  id: string
  name: string
  size: string
  uploaded_at: string
  uploaded_by: string
}

export interface Ticket {
  id: string
  title: string
  description?: string | null
  summary?: string
  status: TicketStatus
  priority: TicketPriority
  jurisdiction_id?: string
  project_id?: string
  source_id?: string
  revision_id?: string
  data_revision_id?: string
  change_diff_id?: string | null
  change_summary?: string
  content?: Record<string, unknown> | null
  change_details: TicketChange[]
  auto_created?: boolean
  assigned_to_user_id?: string | null
  created_at: string
  updated_at: string
  comments: TicketComment[]
  invites: TicketInvite[]
  attachments: TicketAttachment[]
}

export interface CreateTicketPayload {
  title: string
  description?: string | null
  summary?: string
  priority?: TicketPriority
  jurisdiction_id?: string
  project_id?: string
  source_id?: string
  revision_id?: string
  data_revision_id?: string
  change_diff_id?: string | null
  change_summary?: string
  content?: Record<string, unknown> | null
  change_details?: TicketChange[]
  auto_created?: boolean
  assigned_to_user_id?: string | null
}
