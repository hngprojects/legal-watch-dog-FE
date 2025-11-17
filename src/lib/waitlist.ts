export type WaitlistPayload = {
  organization_name: string
  organization_email: string
}

/**
 * Temporary waitlist submission helper.
 * Replace this with a real API request when the backend is available.
 */
export async function submitWaitlist(payload: WaitlistPayload) {
  // Placeholder network request
  await new Promise((resolve) => setTimeout(resolve, 800))

  console.info('[waitlist] submission payload (stub)', payload)
  // Simulate API response
  return {
    ok: true,
    message: 'Submission received. Confirmation email will be sent when the service is live.',
  }
}
