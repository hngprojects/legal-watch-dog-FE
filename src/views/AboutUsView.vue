<script setup lang="ts">
import { TypographyHeading, TypographyText } from '@/components/ui/typography'
import aboutHeroImg from '@/assets/Images/About_us.png'
import missionImg from '@/assets/Images/mission_vision.png'
import accuracyIcon from '@/assets/icons/arrow.png'
import transparencyIcon from '@/assets/icons/eye.png'
import speedIcon from '@/assets/icons/speedometer.png'
import trustIcon from '@/assets/icons/trust.png'
import team1 from '@/assets/Images/meet_team_1.png'
import team2 from '@/assets/Images/meet_team_2.png'
import team3 from '@/assets/Images/meet_team_3.png'
import { RouterLink } from 'vue-router'
import GlobalStatsSection from '@/components/landing-page/GlobalStatsSection.vue'

const coreValues = [
  {
    title: 'Accuracy',
    icon: accuracyIcon,
    description: 'Every update is verified, cross-checked, and structured.',
  },
  {
    title: 'Transparency',
    icon: transparencyIcon,
    description: 'Your sources, your data you see everything.',
  },
  {
    title: 'Speed',
    icon: speedIcon,
    description: 'Get update summaries in minutes, not days.',
  },
  {
    title: 'Trust',
    icon: trustIcon,
    description: 'Expert-backed insights from trained policy specialists.',
  },
]

const teamMembers = [
  {
    name: 'Amara Okafor',
    role: 'Chief Data Officer',
    image: team1,
    description: 'Builds responsible AI pipelines that keep our insights precise and auditable.',
  },
  {
    name: 'Lucas Nguyen',
    role: 'VP, Legal Operations',
    image: team2,
    description: 'Former regulator translating policy shifts into clear, actionable playbooks.',
  },
  {
    name: 'Sabastian Ogbufuru',
    role: 'Head of Product Design',
    image: team3,
    description: 'Designs the human-first experiences that make complex compliance feel simple.',
  },
]
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <main class="relative mx-auto flex w-full flex-1 flex-col overflow-hidden bg-[#F7F7F7]">
      <!-- Background gradient - responsive -->
      <div
        class="pointer-events-none absolute top-0 left-1/2 z-0 h-[400px] w-[1000px] -translate-x-1/2 -translate-y-[50%] rounded-[50%] sm:h-[500px] sm:w-[1200px] md:h-[600px] md:w-[1400px] lg:h-[800px] lg:w-[1600px] lg:-translate-y-[60%]"
        style="
          background: radial-gradient(
            ellipse,
            #f8d9c5 0%,
            rgba(248, 217, 197, 0.5) 40%,
            rgba(247, 247, 247, 0.8) 70%,
            #f7f7f7 100%
          );
        "
      ></div>

      <!-- Hero Section -->
      <section
        class="relative z-10 flex w-full flex-col items-center justify-center pt-12 pb-8 sm:pt-16 sm:pb-12"
      >
        <div class="app-container flex w-full flex-col items-center text-center">
          <TypographyHeading
            level="h1"
            align="center"
            class="mb-4 text-2xl leading-tight sm:mb-5 sm:text-3xl md:text-4xl lg:text-5xl lg:leading-[1.1]"
          >
            We're Transforming How Companies Track Regulatory Changes.
          </TypographyHeading>
          <TypographyText
            class="mx-auto mb-6 max-w-2xl text-sm leading-relaxed font-semibold text-gray-600 sm:mb-8 sm:text-base md:text-lg"
            align="center"
            tone="muted"
          >
            AI monitoring and human expertise help your team stay compliant, informed, and always
            ahead without stress.
          </TypographyText>
          <RouterLink to="/signup" class="btn--default btn--lg mb-6 sm:mb-8">
            Get Started
          </RouterLink>
          <div
            class="w-full max-w-[800px] overflow-hidden rounded-xl shadow-xl sm:max-w-[900px] lg:max-w-[1000px] lg:rounded-2xl"
          >
            <img :src="aboutHeroImg" alt="Team collaborating" class="h-auto w-full object-cover" />
          </div>
        </div>
      </section>

      <!-- Mission & Vision -->
      <section class="app-container relative z-10 w-full py-12 sm:py-16">
        <div
          class="mx-auto flex w-full flex-col items-center gap-8 md:flex-row md:gap-12 lg:max-w-[1240px]"
        >
          <div class="flex-1 space-y-4 sm:space-y-6">
            <TypographyHeading
              level="h2"
              class="text-lg font-semibold text-[#F2AB6D] sm:text-xl md:text-2xl"
            >
              Our Mission & Vision
            </TypographyHeading>
            <TypographyText class="text-base leading-relaxed text-gray-700 sm:text-lg">
              Our goal is to make compliance effortless. We believe businesses shouldn't struggle to
              track complex regulatory updates across regions. By combining automation, human
              expertise, and powerful research workflows, we provide clarity where others provide
              chaos.
            </TypographyText>
          </div>
          <div class="w-full flex-1">
            <img
              :src="missionImg"
              alt="Mission and Vision"
              class="w-full rounded-xl shadow-lg sm:rounded-2xl"
            />
          </div>
        </div>
      </section>

      <!-- Core Values -->
      <section class="app-container relative z-10 w-full bg-transparent py-12 sm:py-16">
        <div class="mx-auto flex w-full flex-col items-center gap-8 sm:gap-12">
          <div class="space-y-3 text-center sm:space-y-4">
            <TypographyHeading level="h2" class="text-2xl font-bold sm:text-3xl md:text-4xl">
              Our <span class="text-[#F2AB6D]">Core</span> Values
            </TypographyHeading>
            <TypographyText tone="muted" align="center" class="text-sm sm:text-base">
              The principles that guide everything we do
            </TypographyText>
          </div>
          <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            <div
              v-for="(card, i) in coreValues"
              :key="i"
              class="flex flex-col items-start gap-3 rounded-xl border-none bg-white p-4 shadow-md transition-shadow hover:shadow-lg sm:gap-4 sm:p-6"
            >
              <div class="flex w-full flex-col gap-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-full bg-[#fae5d3] sm:h-12 sm:w-12"
                >
                  <img
                    :src="card.icon"
                    :alt="`${card.title} icon`"
                    class="h-5 w-5 object-contain sm:h-6 sm:w-6"
                  />
                </div>
                <h3 class="text-lg font-bold text-gray-900 sm:text-xl">
                  {{ card.title }}
                </h3>
              </div>
              <p class="text-sm leading-relaxed text-gray-600 sm:text-base">
                {{ card.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Meet Our Team -->
      <section class="app-container relative z-10 w-full py-12 sm:py-16">
        <div class="mx-auto flex w-full flex-col items-center gap-8 sm:gap-12">
          <div class="space-y-3 text-center sm:space-y-4">
            <TypographyHeading level="h2" class="text-2xl font-bold sm:text-3xl md:text-4xl">
              Meet <span class="text-[#F2AB6D]">Our</span> Team
            </TypographyHeading>
            <TypographyText tone="muted" align="center" class="text-sm sm:text-base">
              Meet the dedicated minds working to bring transparency and innovation.
            </TypographyText>
          </div>
          <div
            class="flex w-full flex-col items-center justify-center gap-8 sm:flex-row sm:flex-wrap sm:gap-6 lg:gap-8"
          >
            <div
              v-for="(member, i) in teamMembers"
              :key="i"
              class="flex w-full max-w-[300px] flex-col items-start sm:max-w-[280px] md:max-w-[320px] lg:max-w-[350px]"
            >
              <div
                class="mb-3 h-[250px] w-full overflow-hidden rounded-lg sm:mb-4 sm:h-[280px] lg:h-[300px] lg:rounded-xl"
              >
                <img
                  :src="member.image"
                  :alt="member.name"
                  class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <p class="mb-2 text-base leading-relaxed font-normal text-[#1F1F1F] sm:text-lg">
                {{ member.description }}
              </p>
              <p class="text-sm font-medium sm:text-base">
                <span class="text-[#1F1F1F]">({{ member.role }})</span>
                <span class="text-[#F2AB6D]"> {{ member.name }}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <GlobalStatsSection />
    </main>
  </div>
</template>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .app-container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Ensure images maintain aspect ratio */
img {
  max-width: 100%;
  height: auto;
}

/* Better touch targets */
@media (max-width: 768px) {
  a,
  button {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}

/* Prevent content from being too wide on large screens */
@media (min-width: 1536px) {
  .app-container {
    max-width: 1280px;
  }
}

/* Smooth transitions */
.transition-shadow {
  transition: box-shadow 0.3s ease;
}

.transition-transform {
  transition: transform 0.3s ease;
}
</style>
