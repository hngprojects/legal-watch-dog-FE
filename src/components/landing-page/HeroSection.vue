<script setup lang="ts">
<<<<<<<< HEAD:src/features/home/components/HeroSection.vue
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { TypographyHeading, TypographyText } from '@/shared/components/ui/typography'
========
import BodyText from '../reusable/BodyText.vue'
import HeadingText from '../reusable/HeadingText.vue'
import PillTag from '../reusable/PillTag.vue'
import { Button } from '../ui/button';
>>>>>>>> 2dbf94defbe3a4f9b1b225cca6199a2e3cd6390f:src/shared/components/landing-page/HeroSection.vue
</script>

<template>
  <section id="hero" class="relative flex w-full flex-1 items-center justify-center ">
    <div
      class="mx-auto flex w-full items-center max-w-[900px] flex-col gap-7 px-6 pt-12 text-center "
    >
      <Badge
        variant="secondary"
        class="border border-white/80 bg-white px-6 py-1.5 text-sm font-semibold text-brand-brown shadow-[0_15px_35px_rgba(15,17,20,0.12)]"
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
      <Button class="self-center cursor-pointer" size="lg">
        Get Monitoring For Free
      </Button>
    </div>
  </section>
</template>
