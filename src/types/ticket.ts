export type TicketStatus = 'open' | 'in_progress' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high'

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
  summary?: string
  status: TicketStatus
  priority: TicketPriority
  jurisdiction_id?: string
  project_id?: string
  source_id?: string
  revision_id?: string
  change_summary?: string
  change_details: TicketChange[]
  auto_created?: boolean
  created_at: string
  updated_at: string
  comments: TicketComment[]
  invites: TicketInvite[]
  attachments: TicketAttachment[]
}

export interface CreateTicketPayload {
  title: string
  summary?: string
  priority?: TicketPriority
  jurisdiction_id?: string
  project_id?: string
  source_id?: string
  revision_id?: string
  change_summary?: string
  change_details?: TicketChange[]
  auto_created?: boolean
}
