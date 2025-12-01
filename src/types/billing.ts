export interface BillingErrorResponse {
  error: string
  message: string
}

export interface BillingPlan {
  id: string
  code: string
  tier: string
  label: string
  interval: 'month' | 'year'
  currency: string
  amount: number
  description: string
  features: string[]
  is_most_popular: boolean
  is_active: boolean
}
