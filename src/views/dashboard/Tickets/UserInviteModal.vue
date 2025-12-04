<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ref, nextTick } from 'vue'

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
      class="sm:max-w-[520px] p-0 border-0 shadow-2xl bg-white gap-0 rounded-xl overflow-hidden focus:outline-none"
    >
      <div class="p-8">
        <button
          type="button"
          class="mb-6 -ml-1 text-[#4B4B4B] hover:text-black transition-colors focus:outline-none"
          @click="emit('update:open', false); emit('close')"
          aria-label="Go back"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <div class="mb-8">
          <DialogTitle class="text-[32px] leading-tight font-bold text-[#1A1A1A] mb-2">
            Invite Users
          </DialogTitle>
          <DialogDescription class="text-[15px] text-[#5C5956] font-normal">
            Invite users into the workspace
          </DialogDescription>
        </div>

        <div class="mb-10">
          <label 
            class="block text-[15px] font-bold text-[#1A1A1A] mb-2.5" 
            @click="focusInput"
          >
            Email Addresses
          </label>

          <div 
            class="flex flex-wrap content-start gap-2 w-full min-h-[160px] border border-[#E5E7EB] rounded-lg p-3 bg-white cursor-text transition-colors hover:border-[#D1D5DB] focus-within:ring-2 focus-within:ring-[#3E1C05]/10 focus-within:border-[#3E1C05]"
            @click="focusInput"
          >
            <div 
              v-for="(email, index) in emails" 
              :key="email"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF9F5] border border-[#F5EFEA] group animate-in fade-in zoom-in duration-200"
            >
              <span class="text-[13px] font-medium text-[#3E1C05]">{{ email }}</span>
              <button 
                type="button"
                @click.stop="removeEmail(index)"
                class="text-[#3E1C05]/60 hover:text-[#3E1C05] focus:outline-none"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>

            <input
              ref="emailInput"
              v-model="inputValue"
              type="text"
              placeholder="Email"
              class="flex-1 bg-transparent outline-none text-[15px] text-[#1A1A1A] placeholder:text-[#A3A3A3] min-w-[120px] h-[32px]"
              @keydown="handleKeydown"
              @blur="handleBlur"
            />
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <button 
            type="button" 
            class="w-full py-3.5 px-4 bg-[#3E1C05] hover:bg-[#3E1C05]/90 text-white text-[15px] font-semibold rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="emails.length === 0 && !inputValue"
            @click="addEmail"
          >
            Invite User
          </button>
          
          <button
            type="button"
            class="w-full py-2 text-[14px] font-semibold text-[#1A1A1A] hover:bg-gray-50 rounded-lg transition-colors"
            @click="emit('update:open', false); emit('close')"
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
  color: #9CA3AF;
  opacity: 1; 
}
</style>