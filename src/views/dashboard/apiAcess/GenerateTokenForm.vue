<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ResourceOwnerIcon from '@/assets/icons/resource-owner.svg'
import CalendarIcon from '@/assets/icons/calendar.svg'

interface Props {
  username?: string
}

interface Emits {
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  username: 'user',
})

const emit = defineEmits<Emits>()

const tokenName = ref('')
const description = ref('')
const resourceOwner = ref(props.username)
const expiration = ref('7')

const getExpirationDate = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const expirationOptions = computed(() => [
  { value: '7', label: `7 days (${getExpirationDate(7)})` },
  { value: '30', label: `30 days (${getExpirationDate(30)})` },
  { value: '60', label: `60 days (${getExpirationDate(60)})` },
  { value: '90', label: `90 days (${getExpirationDate(90)})` },
  { value: 'never', label: 'No expiration' },
])

const selectedExpirationLabel = computed(() => {
  const option = expirationOptions.value.find((opt) => opt.value === expiration.value)
  return option?.label || ''
})

const closeForm = () => {
  emit('close')
}

const generateToken = () => {
  console.log('Generating token...', {
    tokenName: tokenName.value,
    description: description.value,
    resourceOwner: resourceOwner.value,
    expiration: expiration.value,
  })
  closeForm()
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-6">
      <h1 class="border-b border-b-[#E5E7EB] pb-6 text-3xl font-bold text-[#1F1F1F]">
        New fine-grained personal access token
      </h1>
      <p class="text-2xl text-[#1F1F1F]">
        Create a fine-grained, organization-scoped token suitable for personal API use and for using
        LegalWatchDog over HTTPS.
      </p>
    </div>

    <form class="flex flex-col gap-14" @submit.prevent="generateToken">
      <div class="flex flex-col gap-1 space-y-2">
        <label class="text-sm font-semibold text-[#0F172A]" for="token-name"> Token Name </label>
        <Input
          id="token-name"
          v-model="tokenName"
          placeholder="Enter token name"
          class="h-11 rounded-md border-[#E5E7EB]! bg-white text-sm shadow-none"
        />
        <p class="text-xs text-[#6B7280]">
          A unique name for this token, may be visible to resource owners or users with possession
          of the token.
        </p>
      </div>

      <div class="flex flex-col gap-1 space-y-2">
        <label class="text-sm font-semibold text-[#0F172A]" for="description"> Description </label>
        <textarea
          id="description"
          v-model="description"
          placeholder="Enter description"
          class="flex min-h-[100px] w-full rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-sm placeholder:text-[#9CA3AF] focus-visible:ring-1 focus-visible:ring-[#401903] focus-visible:outline-none"
        />
      </div>

      <div class="flex flex-col gap-3 space-y-2">
        <label class="text-sm font-semibold text-[#0F172A]" for="resource-owner">
          Resource owner
        </label>
        <Select v-model="resourceOwner">
          <SelectTrigger
            class="h-11 w-full cursor-pointer rounded-md border-[#E5E7EB] text-sm sm:w-[336px]"
          >
            <div class="flex items-center gap-2">
              <img :src="ResourceOwnerIcon" alt="Resource Owner" class="h-5 w-5" />
              <SelectValue :placeholder="resourceOwner" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem :value="username">{{ username }}</SelectItem>
          </SelectContent>
        </Select>
        <p class="text-xs text-[#6B7280]">
          The token will be able to make changes to resources owned by the selected resource owner.
          Tokens can always read all public repositories.
        </p>
      </div>

      <div class="flex flex-col gap-3 space-y-2">
        <label class="text-sm font-semibold text-[#0F172A]" for="expiration">Expiration</label>
        <Select v-model="expiration">
          <SelectTrigger
            class="h-11 w-full cursor-pointer rounded-md border-[#E5E7EB] text-sm sm:w-[336px]"
          >
            <div class="flex items-center gap-2">
              <img :src="CalendarIcon" alt="Calendar" class="h-5 w-5" />
              <SelectValue :placeholder="selectedExpirationLabel" class="cursor-pointer" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="option in expirationOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <p class="text-xs text-[#6B7280]">This token will expire on the selected date</p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          class="border-[#E5E7EB] px-6 py-2 text-[#0F172A] hover:bg-[#F5F6F8]"
          @click="closeForm"
        >
          Cancel
        </Button>
        <Button type="submit" class="bg-[#401903] px-6 py-2 text-white hover:bg-[#2f1202]">
          Generate token
        </Button>
      </div>
    </form>
  </div>
</template>
