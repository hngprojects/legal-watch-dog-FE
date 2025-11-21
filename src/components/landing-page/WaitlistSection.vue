<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { submitWaitlist, type WaitlistPayload } from '@/api/waitlist'
// import FormControl from '../composables/form-control.vue'
import Input from '../ui/input/Input.vue'
// import Button from '../ui/button/Button.vue'

const form = reactive<WaitlistPayload>({
  organization_name: '',
  organization_email: '',
})

const isSubmitting = ref(false)
const feedback = ref<{ type: 'success' | 'error'; message: string } | null>(null)

const handleSubmit = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  feedback.value = null
  try {
    const response = await submitWaitlist({ ...form })
    feedback.value = {
      type: 'success',
      message: response.message ?? 'You are on the waitlist. Check your email soon!',
    }
    form.organization_name = ''
    form.organization_email = ''
  } catch (error) {
    console.error('waitlist submission failed', error)
    feedback.value = {
      type: 'error',
      message:
        error instanceof Error
          ? error.message
          : 'Unable to submit right now. Please try again shortly.',
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section
    id="waitlist"
    class="relative flex w-full flex-1 items-center justify-center pt-4 pb-8 sm:pt-6 sm:pb-16"
  >
    <Card
      class="mx-auto flex w-full max-w-[900px] flex-col items-center gap-6 border-0 bg-transparent px-4 py-10 text-center shadow-none sm:px-10 sm:py-16"
    >
      <Badge
        variant="secondary"
        class="text-brand-brown border border-white/80 bg-white px-6 py-1.5 text-sm font-semibold shadow-[0_15px_35px_rgba(15,17,20,0.12)]"
      >
        Join the Waitlist
      </Badge>

      <CardHeader class="w-full max-w-[820px] gap-5 p-0 text-center">
        <CardTitle class="text-4xl leading-tight font-bold sm:text-5xl">
          Stay Ahead of Legal Changes<br />
          Without the Weekly Stress
        </CardTitle>
        <CardDescription class="text-muted-foreground mx-auto max-w-[780px] text-base sm:text-lg">
          LegalWatchDog tracks government updates, policy shifts, and regulatory changes for you.
          Get clear summaries, real-time alerts, and complete visibility across all your
          jurisdictions.
        </CardDescription>
      </CardHeader>

      <CardContent class="flex w-full flex-col items-center gap-6 p-0">
        <form class="flex w-full max-w-[760px] flex-col gap-3 items-center" @submit.prevent="handleSubmit">
          <div class="flex flex-col gap-3 md:flex-row md:items-center md:gap-5 mt-5 max-w-[600px]">
            <div class="w-full">
              <Input placeholder="Organization email" class="mb-3"/>
              <Button>Join the waitlist</Button>
            </div>
          </div>
          <p class="text-muted-foreground text-center text-xs">
            We respect your privacy. No spam, unsubscribe anytime.
          </p>
        </form>

        <p
          v-if="feedback"
          class="text-sm"
          :class="feedback.type === 'success' ? 'text-green-600' : 'text-red-600'"
          aria-live="polite"
        >
          {{ feedback.message }}
        </p>

        <div class="mt-4 w-full max-w-[800px]">
          <img
            src="/images/dashboard-preview.png"
            alt="Legal WatchDog Dashboard"
            class="border-border/70 h-auto w-full rounded-xl border shadow-2xl"
          />
        </div>
      </CardContent>
    </Card>
  </section>
</template>
