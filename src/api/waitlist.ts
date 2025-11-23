export type WaitlistPayload = {
  organization_name: string
  organization_email: string
}

const WAITLIST_ENDPOINT = 'https://api.staging.minamoto.emerj.net/api/v1/waitlist/signup'

type WaitlistSuccessResponse = {
  status: string
  message: string
  data?: WaitlistPayload
}

type WaitlistErrorDetail = {
  type?: string
  loc?: string[]
  msg?: string
}

type WaitlistErrorResponse = {
  message?: string
  detail?: WaitlistErrorDetail[]
}

const FALLBACK_SUCCESS_MESSAGE = 'You have been added to the waitlist'
const FALLBACK_ERROR_MESSAGE =
  'Unable to submit right now. Please check your details and try again shortly.'

export async function submitWaitlist(payload: WaitlistPayload) {
  const response = await fetch(WAITLIST_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })
  const contentType = response.headers.get('content-type') ?? ''
  const isJsonResponse = contentType.includes('application/json')

  let responseBody: unknown = null
  try {
    responseBody = isJsonResponse ? await response.json() : await response.text()
  } catch (error) {
    console.warn('[waitlist] failed to parse response', error)
  }

  if (!response.ok) {
    const message = extractErrorMessage(responseBody) ?? FALLBACK_ERROR_MESSAGE
    throw new Error(message)
  }

  const successBody =
    typeof responseBody === 'object' && responseBody !== null
      ? (responseBody as WaitlistSuccessResponse)
      : null

  return {
    ok: true,
    ...successBody,
    message: successBody?.message ?? FALLBACK_SUCCESS_MESSAGE,
  }
}

function extractErrorMessage(body: unknown): string | null {
  if (!body) return null
  if (typeof body === 'string') {
    return body.trim() || null
  }

  const typedBody = body as WaitlistErrorResponse

  if (typedBody.message) return typedBody.message

  if (Array.isArray(typedBody.detail)) {
    const messages = typedBody.detail.map((detail) => detail?.msg).filter(Boolean)
    if (messages.length > 0) {
      return messages.join(', ')
    }
  }

  return null
}
