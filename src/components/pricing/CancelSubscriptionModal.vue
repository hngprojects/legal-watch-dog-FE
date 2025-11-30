<script setup lang="ts">
import { useBillingStore } from '@/stores/billing-store'
import Dialog from '../ui/dialog/Dialog.vue'
import DialogClose from '../ui/dialog/DialogClose.vue'
import DialogContent from '../ui/dialog/DialogContent.vue'
import DialogDescription from '../ui/dialog/DialogDescription.vue'
import DialogFooter from '../ui/dialog/DialogFooter.vue'
import DialogHeader from '../ui/dialog/DialogHeader.vue'
import DialogTitle from '../ui/dialog/DialogTitle.vue'
import DialogTrigger from '../ui/dialog/DialogTrigger.vue'
import XIcon from '@/assets/icons/checkmark-circle-2.svg'

const handleCancelSubscription = async () => {
  const { cancelSubscription } = useBillingStore()

  cancelSubscription()
}
</script>

<template>
  <Dialog>
    <DialogTrigger asChild>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader class="text-center">
        <img :src="XIcon" class="mx-auto size-[118px]" alt="" />

        <DialogTitle> Cancel your subscription? </DialogTitle>
        <DialogDescription class="py-4">
          You'll lose premium access at the end of your billing period on December 15, 2025.
        </DialogDescription>
      </DialogHeader>
      <section class="bg-peach-amber-100 border-peach-amber-200 rounded-md border px-10 py-4">
        <h3 class="mb-4">Current Plan</h3>
        <p class="text-xs">Professional Plan</p>
      </section>

      <section class="my-4">
        <h3>What You'll Lose:</h3>
        <ul class="space-y-2 px-4 py-2 *:list-disc">
          <li>Unlimited Projects</li>
          <li>Advanced Analytics</li>
          <li>Priority Support</li>
        </ul>
      </section>

      <DialogFooter class="flex w-full flex-row items-center justify-center! gap-4 text-center">
        <DialogClose>
          <button class="btn--secondary btn--lg">Keep My Plan</button>
        </DialogClose>
        <button class="btn--primary btn--lg" @click="handleCancelSubscription">
          Cancel Subscription
        </button>
      </DialogFooter>

      <p class="text-center text-xs">You can re-subscribe at any time</p>
    </DialogContent>
  </Dialog>
</template>
