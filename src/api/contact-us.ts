import api from '@/lib/api'
import type { ContactUsApiPayload } from '@/types/contact-us'

type ApiResponse<T> = {
  status?: string
  status_code?: number
  message?: string
  data?: T
}


export async function submitContactForm(payload: ContactUsApiPayload) {
  return api.post<ApiResponse<{ message?: string }>>(`/contact-us`, payload)
}