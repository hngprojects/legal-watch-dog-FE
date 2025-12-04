import { useRouter } from 'vue-router'
import Swal from '@/lib/swal'
import { useInvitationStore } from '@/stores/invitation-store'

export const useInvitationPrompt = () => {
  const invitationStore = useInvitationStore()
  const router = useRouter()

  const promptToAcceptInvite = async (
    token?: string | null,
    options?: { onProcessingChange?: (isProcessing: boolean) => void },
  ) => {
    const onProcessingChange = options?.onProcessingChange
    const inviteToken = token ?? invitationStore.token
    if (!inviteToken) return false

    const decision = await Swal.fire({
      title: 'Accept this invitation?',
      text: 'Join this organization now or come back later.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Accept invite',
      cancelButtonText: 'Later',
      reverseButtons: true,
    })

    if (!decision.isConfirmed) {
      return false
    }

    onProcessingChange?.(true)
    try {
      const message = await invitationStore.acceptInvitation(inviteToken)
      await Swal.fire('Invitation Accepted', message, 'success')
      router.replace({ name: 'organizations' })
      return true
    } catch (error) {
      void error
      await Swal.fire(
        'Could not accept invitation',
        invitationStore.error || 'Something went wrong',
        'error',
      )
      return false
    } finally {
      onProcessingChange?.(false)
    }
  }

  return { promptToAcceptInvite }
}
