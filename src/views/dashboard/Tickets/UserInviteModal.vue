<script setup lang="ts">
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ref } from 'vue'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'close'): void
}>()

const emailInput = ref<HTMLInputElement | null>(null)
const inputValue = ref('')
const emails = ref<string[]>([])

const focusInput = () => {
  emailInput.value?.focus()
}

const addEmail = () => {
  const value = inputValue.value.trim()
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (value && emailRegex.test(value) && !emails.value.includes(value)) {
    emails.value.push(value)
    inputValue.value = ''
  } else if (value && !emailRegex.test(value)) {
  }
}

const removeEmail = (index: number) => {
  emails.value.splice(index, 1)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (['Enter', ',', ' '].includes(e.key)) {
    e.preventDefault()
    addEmail()
  } else if (e.key === 'Backspace' && !inputValue.value && emails.value.length > 0) {
    removeEmail(emails.value.length - 1)
  }
}

const handleBlur = () => {
  addEmail()
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent
      class="gap-0 overflow-hidden rounded-xl border-0 bg-white p-0 shadow-2xl focus:outline-none sm:max-w-[520px]"
    >
      <div class="p-8">
        <button
          type="button"
          class="mb-6 -ml-1 text-[#4B4B4B] transition-colors hover:text-black focus:outline-none"
          @click="
            emit('update:open', false)
            emit('close')
          "
          aria-label="Go back"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <div class="mb-8">
          <DialogTitle class="mb-2 text-[32px] leading-tight font-bold text-[#1A1A1A]">
            Invite Users
          </DialogTitle>
          <DialogDescription class="text-[15px] font-normal text-[#5C5956]">
            Invite users into the workspace
          </DialogDescription>
        </div>

        <div class="mb-10">
          <label class="mb-2.5 block text-[15px] font-bold text-[#1A1A1A]" @click="focusInput">
            Email Addresses
          </label>

          <div
            class="flex min-h-40 w-full cursor-text flex-wrap content-start gap-2 rounded-lg border border-[#E5E7EB] bg-white p-3 transition-colors focus-within:border-[#3E1C05] focus-within:ring-2 focus-within:ring-[#3E1C05]/10 hover:border-[#D1D5DB]"
            @click="focusInput"
          >
            <div
              v-for="(email, index) in emails"
              :key="email"
              class="group animate-in fade-in zoom-in inline-flex items-center gap-1.5 rounded-full border border-[#F5EFEA] bg-[#FFF9F5] px-3 py-1.5 duration-200"
            >
              <span class="text-[13px] font-medium text-[#3E1C05]">{{ email }}</span>
              <button
                type="button"
                @click.stop="removeEmail(index)"
                class="text-[#3E1C05]/60 hover:text-[#3E1C05] focus:outline-none"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>

            <input
              ref="emailInput"
              v-model="inputValue"
              type="text"
              placeholder="Email"
              class="h-8 min-w-[120px] flex-1 bg-transparent text-[15px] text-[#1A1A1A] outline-none placeholder:text-[#A3A3A3]"
              @keydown="handleKeydown"
              @blur="handleBlur"
            />
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <button
            type="button"
            class="w-full rounded-lg bg-[#3E1C05] px-4 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-[#3E1C05]/90 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="emails.length === 0 && !inputValue"
            @click="addEmail"
          >
            Invite User
          </button>

          <button
            type="button"
            class="w-full rounded-lg py-2 text-[14px] font-semibold text-[#1A1A1A] transition-colors hover:bg-gray-50"
            @click="
              emit('update:open', false)
              emit('close')
            "
          >
            Maybe Later
          </button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
input::placeholder {
  color: #9ca3af;
  opacity: 1;
}
</style>
