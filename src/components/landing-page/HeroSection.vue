<script setup lang="ts">
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { TypographyHeading, TypographyText } from '../ui/typography'
</script>

<template>
  <section id="hero" class="relative flex w-full flex-1 items-center justify-center">
    <div
      class="mx-auto flex w-full max-w-[900px] flex-col items-center gap-7 px-6 pt-12 text-center"
    >
      <Badge
        variant="default"
        class="text-brand-brown border border-white/80 bg-white px-6 py-1.5 text-sm font-semibold shadow-[0_15px_35px_rgba(15,17,20,0.12)]"
      >
        AI-Powered Regulatory Intelligence
      </Badge>
      <TypographyHeading level="h1" align="center">
        Automate Legal Monitoring,<br />
        Never Miss A Critical Update
      </TypographyHeading>
      <TypographyText class="mx-auto max-w-[600px]" align="center" tone="muted">
        LegalWatchDog uses AI to track all changes on any website, from Visa portals to employment
        laws and delivers concise actionable summaries.
      </TypographyText>
      <Button class="cursor-pointer self-center" size="lg"> Get Monitoring For Free </Button>
    </div>
  </section>
</template>
