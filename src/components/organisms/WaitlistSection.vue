<script setup lang="ts">
import { reactive, ref } from 'vue'
import PillTag from '@/components/atoms/PillTag.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { submitWaitlist, type WaitlistPayload } from '@/lib/waitlist'
import previewImage from '../../assets/img/dashboard-preview.png'

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
      message: 'Unable to submit right now. Please try again shortly.',
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
      <PillTag>Join the Waitlist</PillTag>

      <CardHeader class="w-full max-w-[820px] gap-5 p-0 text-center">
        <CardTitle class="text-4xl font-bold leading-tight sm:text-5xl">
          Never Miss a Policy<br />
          Update Again
        </CardTitle>
        <CardDescription class="mx-auto max-w-[780px] text-base text-muted-foreground sm:text-lg">
          Legal WatchDog tracks visa rules, employment laws,
          and compliance updates, automatically delivering clear,
          easy-to-read summaries. Join the waitlist to try it first.
        </CardDescription>
      </CardHeader>

      <CardContent class="flex w-full flex-col items-center gap-6 p-0">
        <form class="flex w-full max-w-[760px] flex-col gap-3" @submit.prevent="handleSubmit">
          <div class="flex md:gap-5">
            <Input
              v-model="form.organization_email"
              type="email"
              name="organization_email"
              placeholder="Enter Email"
              required
              class="flex-1 border-border bg-card/90 text-base w-[70%] rounded-lg"
            />
            <Button
              size="lg"
              type="submit"
              class="w-[30%] whitespace-nowrap md:w-auto"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Submitting...' : 'Join the Waitlist' }}
            </Button>
          </div>
          <p class="text-center text-xs text-muted-foreground">
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

        
        <!-- <div class="mt-4 w-full max-w-[800px]">
          <img
          src="/images/dashboard.png"
          alt="Legal WatchDog Dashboard"
          class="h-auto w-full rounded-xl border border-border/70 shadow-2xl"
          />
        </div> -->
        <section id="features" class="relative flex w-full flex-1 items-center justify-center">
          <div
            class="mx-auto flex w-full items-center max-w-[900px] flex-col pt-8 text-center"
          >
            <img :src="previewImage" alt="Dashboard preview" class="w-full h-auto" />
          </div>
        </section>
      </CardContent>
    </Card>
    
  </section>
</template>
