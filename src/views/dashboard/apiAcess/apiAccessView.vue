<script setup lang="ts">
import { Button } from '@/components/ui/button'
import TokenItem from './TokenItem.vue'
</script>

<template>
  <main class="min-h-screen flex-1 bg-[#F5F6F8] p-6 lg:p-10">
    <div class="mx-auto flex max-w-5xl flex-col gap-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="flex flex-col gap-4 sm:w-full">
          <div class="flex w-full items-center justify-between">
            <h1 class="text-3xl font-bold text-[#0F172A]">Fine-grained personal access token</h1>
            <Button
              class="hidden bg-[#401903] px-6 py-3 whitespace-nowrap text-white hover:bg-[#2f1202] sm:flex"
            >
              Generate new token
            </Button>
          </div>
          <p class="text-sm text-[#6B7280]">
            These are fine-grained, repository-scoped tokens suitable for personal API use and for
            using Git over HTTPS
          </p>
        </div>
        <Button
          class="bg-[#401903] px-6 py-3 whitespace-nowrap text-white hover:bg-[#2f1202] sm:hidden"
        >
          Generate new token
        </Button>
      </div>

      <div class="flex flex-col rounded-md border border-gray-200 bg-white">
        <TokenItem name="Test" expires-on="Sat, Jan 3 2026" />
        <TokenItem name="Test" last-used="2 years ago" :is-expired="true" />
      </div>
    </div>
  </main>
</template>
