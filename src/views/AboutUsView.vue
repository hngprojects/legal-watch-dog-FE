<script setup lang="ts">
import MainHeader from '@/components/landing-page/MainHeader.vue'
import MainFooter from '@/components/landing-page/MainFooter.vue'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import stratBgLeft from '@/assets/Images/backleft.png'
import stratBgRight from '@/assets/Images/backright.png'

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
    name: 'Mark Essien',
    role: 'CEO',
    image: team1,
    description: 'A product-driven leader leveraging AI to help teams stay ahead.',
  },
  {
    name: 'Mark Essien',
    role: 'CEO',
    image: team2,
    description: 'A product-driven leader leveraging AI to help teams stay ahead.',
  },
  {
    name: 'Mark Essien',
    role: 'CEO',
    image: team3,
    description: 'A product-driven leader leveraging AI to help teams stay ahead.',
  },
]
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <MainHeader />
    <main class="relative mx-auto flex w-full flex-1 flex-col overflow-hidden bg-[#F7F7F7]">
      <div
        class="pointer-events-none absolute top-0 left-1/2 z-0 h-[800px] w-[1600px] -translate-x-1/2 -translate-y-[60%] rounded-[50%]"
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

      <section class="relative z-10 flex w-full flex-col items-center justify-center pt-16 pb-12">
        <div class="mx-auto flex w-full max-w-[1240px] flex-col items-center px-6 text-center">
          <TypographyHeading level="h1" align="center" class="mb-6 max-w-4xl">
            We're Transforming How <br />
            Companies Track Regulatory <br />
            Changes.
          </TypographyHeading>
          <TypographyText
            class="mx-auto mb-8 max-w-2xl leading-7 font-semibold text-gray-600"
            align="center"
            tone="muted"
          >
            AI monitoring and human expertise help your team stay compliant, informed, and always
            ahead without stress.
          </TypographyText>
          <Button class="mb-12 bg-[#3C2610] px-8 py-6 text-white hover:bg-[#3C2610]/90">
            Get Started
          </Button>
          <div class="w-full max-w-[1000px] overflow-hidden rounded-2xl shadow-xl">
            <img :src="aboutHeroImg" alt="Team collaborating" class="h-auto w-full object-cover" />
          </div>
        </div>
      </section>

      <section class="relative z-10 w-full px-6 py-16">
        <div class="mx-auto flex w-full max-w-[1240px] flex-col items-center gap-12 md:flex-row">
          <div class="flex-1 space-y-6">
            <TypographyHeading level="h2" class="text-[#F2AB6D]">
              Our Mission & Vision
            </TypographyHeading>
            <TypographyText class="text-lg leading-relaxed text-gray-700">
              Our goal is to make compliance effortless. We believe businesses shouldn't struggle to
              track complex regulatory updates across regions. By combining automation, human
              expertise, and powerful research workflows, we provide clarity where others provide
              chaos.
            </TypographyText>
          </div>
          <div class="flex-1">
            <img :src="missionImg" alt="Mission and Vision" class="w-full rounded-2xl shadow-lg" />
          </div>
        </div>
      </section>

      <section class="relative z-10 w-full bg-transparent px-6 py-16">
        <div class="mx-auto flex w-full max-w-[1240px] flex-col items-center gap-12">
          <div class="space-y-4 text-center">
            <TypographyHeading level="h2">
              Our <span class="text-[#F2AB6D]">Core</span> Values
            </TypographyHeading>
            <TypographyText tone="muted" align="center">
              The principles that guide everything we do
            </TypographyText>
          </div>
          <div class="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card
              v-for="(card, i) in coreValues"
              :key="i"
              class="flex flex-col items-start gap-4 rounded-xl border-none bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
            >
              <CardHeader class="w-full space-y-4 p-0">
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#fae5d3]">
                  <img
                    :src="card.icon"
                    :alt="`${card.title} icon`"
                    class="h-6 w-6 object-contain"
                  />
                </div>
                <CardTitle class="text-xl font-bold text-gray-900">
                  {{ card.title }}
                </CardTitle>
              </CardHeader>
              <CardDescription class="mt-2 text-sm leading-relaxed text-gray-600">
                {{ card.description }}
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      <section class="relative z-10 w-full px-6 py-16">
        <div class="mx-auto flex w-full max-w-[1240px] flex-col items-center gap-12">
          <div class="space-y-4 text-center">
            <TypographyHeading level="h2" class="text-center">
              Meet <span class="text-[#F2AB6D]">Our</span> Team
            </TypographyHeading>
            <TypographyText tone="muted" align="center">
              Meet the dedicated minds working to bring transparency and innovation.
            </TypographyText>
          </div>
          <div class="flex w-full flex-wrap justify-center gap-8">
            <div
              v-for="(member, i) in teamMembers"
              :key="i"
              class="flex max-w-[350px] flex-col items-start"
            >
              <div class="mb-4 h-[300px] w-full overflow-hidden rounded-xl">
                <img
                  :src="member.image"
                  :alt="member.name"
                  class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <p class="mb-[10px] text-xl leading-relaxed font-normal text-[#1F1F1F]">
                {{ member.description }}
              </p>
              <p class="font-medium">
                <span class="text-[#1F1F1F]">(CEO)</span>
                <span class="text-[#F2AB6D]"> {{ member.name }}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        class="relative mx-auto mt-12 mb-12 w-full max-w-[1240px] overflow-hidden rounded-3xl bg-[#3C2610] px-6 py-24"
      >
        <img
          :src="stratBgLeft"
          alt=""
          class="pointer-events-none absolute bottom-0 left-0 w-48 opacity-50 md:w-64"
        />
        <img
          :src="stratBgRight"
          alt=""
          class="pointer-events-none absolute right-0 bottom-0 w-48 opacity-50 md:w-64"
        />
        <div class="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
          <h2 class="text-3xl font-bold text-white md:text-4xl">Gain your Strategic Advantage</h2>
          <p class="text-lg leading-relaxed text-white/80">
            Stop reacting to change. Start predicting it. See how LegalWatchDog can transform your
            workflow with intelligence, and autonomous updates in real time.
          </p>
          <Button
            class="rounded-lg bg-[#F2AB6D] px-8 py-6 text-lg font-semibold text-white hover:bg-[#F2AB6D]/90"
          >
            + Get Monitoring For Free
          </Button>
        </div>
      </section>
    </main>
    <MainFooter />
  </div>
</template>
