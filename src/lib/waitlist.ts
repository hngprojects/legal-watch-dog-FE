export type WaitlistPayload = {
  organization_name: string
  organization_email: string
}


export async function submitWaitlist(payload: WaitlistPayload) {
  const response = await fetch('http://minamoto.emerj.net/api/api/v1/waitlist/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Submission failed with status ${response.status}`)
  }

  const data = await response.json()
  console.log(data)
  
  return {
    ok: true,
    message: data.message || 'You have been added to the waitlist',
    data: data.data,
  }
}