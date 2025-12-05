<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import TokenItem from './TokenItem.vue'
import GenerateTokenForm from './GenerateTokenForm.vue'

interface Token {
  id: string
  name: string
  lastUsed?: string
  expiresOn?: string
  isExpired?: boolean
}

const tokens = ref<Token[]>([
  {
    id: '1',
    name: 'Test',
    expiresOn: 'Sat, Jan 3 2026',
  },
  {
    id: '2',
    name: 'Test',
    lastUsed: '2 years ago',
    isExpired: true,
  },
])

const showGenerateForm = ref(false)

const openGenerateForm = () => {
  showGenerateForm.value = true
}

const closeGenerateForm = () => {
  showGenerateForm.value = false
}
</script>

<template>
  <main class="min-h-screen flex-1 bg-[#F5F6F8] p-6 lg:p-10">
    <div class="mx-auto flex max-w-5xl flex-col gap-8">
      <template v-if="!showGenerateForm">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex flex-col gap-4 sm:w-full">
            <div class="flex w-full items-center justify-between">
              <h1 class="text-3xl font-bold text-[#0F172A]">Fine-grained personal access token</h1>
              <Button
                class="hidden bg-[#401903] px-6 py-3 whitespace-nowrap text-white hover:bg-[#2f1202] sm:flex"
                @click="openGenerateForm"
              >
                Generate new token
              </Button>
            </div>
            <p class="text-sm text-[#1F1F1F]">
              These are fine-grained, repository-scoped tokens suitable for personal API use and for
              using Legal Watch Dog over HTTPS
            </p>
          </div>
          <Button
            class="bg-[#401903] px-6 py-3 whitespace-nowrap text-white hover:bg-[#2f1202] sm:hidden"
            @click="openGenerateForm"
          >
            Generate new token
          </Button>
        </div>

        <div class="flex flex-col rounded-md border border-gray-200 bg-white">
          <TokenItem
            v-for="token in tokens"
            :key="token.id"
            :name="token.name"
            :last-used="token.lastUsed"
            :expires-on="token.expiresOn"
            :is-expired="token.isExpired"
          />
        </div>
      </template>

      <GenerateTokenForm v-else @close="closeGenerateForm" />
    </div>
  </main>
</template>
