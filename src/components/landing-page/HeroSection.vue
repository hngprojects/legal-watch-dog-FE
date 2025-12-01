<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { TypographyHeading, TypographyText } from '../ui/typography'
import { useAuthStore } from '@/stores/auth-store'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<template>
  <section id="hero" class="relative flex w-full flex-1 items-center justify-center">
    <div class="mx-auto flex w-full max-w-[900px] flex-col items-center px-4 pt-12 text-center sm:px-6 sm:pt-16 lg:pt-20">
      <!-- Badge -->
      <Badge
        variant="secondary"
        class="border border-white/80 bg-white px-4 py-1.5 text-xs font-semibold text-gray-600 shadow-[0_15px_35px_rgba(15,17,20,0.12)] sm:px-6 sm:py-2 sm:text-sm lg:px-10"
      >
        AI-Powered Regulatory Intelligence
      </Badge>
      
      <!-- Heading -->
      <TypographyHeading 
        level="h1" 
        align="center"
        class="mt-6 text-3xl leading-tight sm:mt-8 sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight lg:text-6xl lg:leading-tight"
      >
        Automate Legal Monitoring,<br class="hidden sm:inline" />
        <span class="sm:hidden"> </span>Never Miss A Critical Update
      </TypographyHeading>
      
      <!-- Description -->
      <TypographyText
        class="mx-auto mt-4 max-w-[280px] text-sm leading-6 font-semibold text-gray-600 sm:mt-5 sm:max-w-[500px] sm:text-base sm:leading-7 lg:mt-6 lg:max-w-[900px] lg:text-lg"
        align="center"
        tone="muted"
      >
        LegalWatchDog uses AI to track all changes on any website, from Visa portals to employment
        laws and delivers concise actionable summaries.
      </TypographyText>
      
      <!-- CTA Button -->
      <Button
        :as="RouterLink"
        :to="isAuthenticated ? { name: 'dashboard' } : { path: '/signup' }"
        class="mt-6 cursor-pointer self-center px-6 text-sm sm:mt-7 sm:px-8 sm:text-base lg:mt-8"
        size="lg"
        variant="secondary"
      >
        {{ isAuthenticated ? 'Go to Dashboard' : 'Get Monitoring For Free' }}
      </Button>
    </div>
  </section>
</template>