import { defineStore } from 'pinia'
import { invitationService } from '@/api/invitation'
import type { Invitation, InvitationErrorResponse } from '@/types/invitation'

interface State {
  invitations: Invitation[]
  token: string | null
  loading: boolean
  error: string | null
}

const normalizeInvitations = (payload: unknown): Invitation[] => {
  if (Array.isArray(payload)) {
    return payload.map((item) => ({
      id: item.id,
      token: item.token,
      organization_id: item.organization_id,
      organization_name: item.organization_name,
      role: item.role || item.role_name,
      role_name: item.role_name,
      status: item.status,
    }))
  }

  if (!payload || typeof payload !== 'object') return []
  const data = payload as { invitations?: Invitation[]; data?: Invitation[] }
  const list = data.invitations || data.data || []
  return Array.isArray(list)
    ? list.map((item) => ({
        id: item.id,
        token: item.token,
        organization_id: item.organization_id,
        organization_name: item.organization_name,
        role: item.role || item.role_name,
        role_name: item.role_name,
        status: item.status,
      }))
    : []
}

export const useInvitationStore = defineStore('invitations', {
  state: (): State => ({
    invitations: [],
    token: null,
    loading: false,
    error: null,
  }),

  actions: {
    setToken(token: string | null) {
      this.token = token
    },

    setError(message: string | null) {
      this.error = message
    },

    async fetchMyInvitations() {
      this.loading = true
      this.error = null
      try {
        const { data } = await invitationService.listMyInvitations()
        this.invitations = normalizeInvitations(data.data ?? data)
      } catch (error) {
        const err = error as InvitationErrorResponse
        if (!err.response) {
          this.error = 'Network error: Unable to reach server'
        } else {
          this.error =
            err.response.data?.detail?.[0]?.msg || err.response.data?.message || 'Failed to load invitations'
        }
      } finally {
        this.loading = false
      }
    },

    async acceptInvitation(token: string) {
      this.error = null
      try {
        const { data } = await invitationService.acceptInvitation(token)
        this.invitations = this.invitations.filter((item) => item.token !== token)
        return data.message || 'Invitation accepted'
      } catch (error) {
        const err = error as InvitationErrorResponse
        if (!err.response) {
          this.error = 'Network error: Unable to reach server'
        } else {
          this.error =
            err.response.data?.detail?.[0]?.msg || err.response.data?.message || 'Failed to accept invitation'
        }
        throw error
      }
    },
  },
})
