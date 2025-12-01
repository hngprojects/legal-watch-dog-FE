<template>
  <div class="blogs-page bg-slate-100">
    <div class="app-container mx-auto px-6 lg:px-8">
      <section class="pt-20 pb-16 text-center">
        <div
          class="shadow-4xl mb-4 inline-flex items-center space-x-2 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-[#3F1A0F]"
        >
          <img :src="blogIcon" alt="Blog Icon" class="h-3 w-3" />
          <span>Blogs</span>
        </div>

        <TypographyHeading
          level="h1"
          class="mb-4 text-center text-3xl font-extrabold text-gray-900 md:text-4xl"
        >
          Insights & Updates
        </TypographyHeading>

        <TypographyText class="text-center">
          Stay informed with the latest insights, updates, and analysis in law, policy, and
          compliance.
        </TypographyText>
      </section>

      <section class="overflow-hidden pb-20">
        <div class="scrollbar-hide flex space-x-4 overflow-x-auto whitespace-nowrap md:space-x-6">
          <img
            :src="blog5"
            alt="Person typing policy document"
            class="h-32 w-40 shrink-0 rounded-xl object-cover md:h-40 md:w-64"
          />
          <img
            :src="blog2"
            alt="Compliance charts and people in a meeting"
            class="h-32 w-40 shrink-0 rounded-xl object-cover md:h-40 md:w-64"
          />
          <img
            :src="blog3"
            alt="Person holding a tablet with security icons"
            class="h-32 w-40 shrink-0 rounded-xl object-cover md:h-40 md:w-64"
          />
          <img
            :src="blog4"
            alt="Abstract law, legal, and rights icons"
            class="h-32 w-40 shrink-0 rounded-xl object-cover md:h-40 md:w-64"
          />
          <img
            :src="blog1"
            alt="Laptop displaying policy text"
            class="h-32 w-40 shrink-0 rounded-xl object-cover md:h-40 md:w-64"
          />
          <img
            :src="blog5"
            alt="Person typing policy document"
            class="h-32 w-40 shrink-0 rounded-xl object-cover md:h-40 md:w-64"
          />
        </div>
      </section>

      <section class="py-10">
        <div
          class="mb-10 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0 lg:gap-10"
        >
          <TypographyHeading level="h2" class="text-3xl font-bold text-gray-900">
            Blogs
          </TypographyHeading>

          <div class="flex w-full items-center rounded-lg border border-gray-300 bg-gray-50 p-1">
            <svg
              class="ml-2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <Input
              class="h-9 grow border-0 bg-transparent px-2 py-1 text-base shadow-none"
              placeholder="Search Blogs..."
            />
            <button
              class="ml-2 flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-600 hover:bg-gray-100"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0012 14.586V17m0 2v2"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          <div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
            <img :src="underblog1" alt="Team meeting compliance" class="h-48 w-full object-cover" />
            <div class="p-6">
              <div class="mb-3 flex items-center space-x-3 text-xs font-semibold">
                <span class="rounded-full bg-gray-100 px-3 py-1 text-[#F79009]"
                  >Policy Updates</span
                >
                <span class="text-gray-500">| Nov 28, 2025</span>
              </div>
              <TypographyHeading level="h3" class="mb-3 text-xl font-bold text-gray-900">
                Policy Developments to Know
              </TypographyHeading>
              <TypographyText class="mb-4 text-gray-600">
                An overview of upcoming or evolving policy changes that could influence industries
                in the near future.
              </TypographyText>
              <div
                class="flex items-center space-x-1 text-sm font-semibold text-[#F79009] transition duration-150 hover:text-orange-600"
              >
                <RouterLink :to="`/blog/${1}`">
                  <span>Learn More</span>
                  <span class="text-[#F79009]">→</span>
                </RouterLink>
              </div>
            </div>
          </div>

          <div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
            <img
              :src="underblog2"
              alt="Security Incident Management"
              class="h-48 w-full object-cover"
            />
            <div class="p-6">
              <div class="mb-3 flex items-center space-x-3 text-xs font-semibold">
                <span class="rounded-full bg-gray-100 px-3 py-1 text-[#F79009]"
                  >Regulatory Changes</span
                >
                <span class="text-gray-500">| Nov 28, 2025</span>
              </div>
              <TypographyHeading level="h3" class="mb-3 text-xl font-bold text-gray-900">
                New Regulations Explained
              </TypographyHeading>
              <TypographyText class="mb-4 text-gray-600">
                Clear breakdown of newly issued regulations, showing what changes are expected, and
                what organizations must do next.
              </TypographyText>

              <RouterLink :to="`/blog/${2}`">
                <span>Learn More</span>
                <span class="text-[#F79009]">→</span>
              </RouterLink>
            </div>
          </div>

          <div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
            <img
              :src="underblog3"
              alt="Computer screen with scales of justice"
              class="h-48 w-full object-cover"
            />
            <div class="p-6">
              <div class="mb-3 flex items-center space-x-3 text-xs font-semibold">
                <span class="rounded-full bg-gray-100 px-3 py-1 text-[#F79009]"
                  >AI & Legal Tech</span
                >
                <span class="text-gray-500">| Nov 28, 2025</span>
              </div>
              <TypographyHeading level="h3" class="mb-3 text-xl font-bold text-gray-900">
                Tech Innovations in Law
              </TypographyHeading>
              <TypographyText class="mb-4 text-gray-600">
                A look at emerging tools and technologies transforming how legal professionals
                research, monitor, and manage compliance.
              </TypographyText>
              <div
                class="flex items-center space-x-1 text-sm font-semibold text-[#F79009] transition duration-150 hover:text-orange-600"
              >
                <RouterLink :to="`/blog/${3}`">
                  <span>Learn More</span>
                  <span class="text-[#F79009]">→</span>
                </RouterLink>
              </div>
            </div>
          </div>

          <div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
            <img
              src="@/assets/Images/underblog4.png"
              alt="Market and Industry Insights charts"
              class="h-48 w-full object-cover"
            />
            <div class="p-6">
              <div class="mb-3 flex items-center space-x-3 text-xs font-semibold">
                <span class="rounded-full bg-gray-100 px-3 py-1 text-[#F79009]"
                  >Industry Trends</span
                >
                <span class="text-gray-500">| Nov 28, 2025</span>
              </div>
              <TypographyHeading level="h3" class="mb-3 text-xl font-bold text-gray-900">
                Market and Industry Insights
              </TypographyHeading>
              <TypographyText class="mb-4 text-gray-600">
                Clear analysis of trends shaping industries, highlighting both risks and
                opportunities in the regulatory landscape.
              </TypographyText>
              <div
                class="flex items-center space-x-1 text-sm font-semibold text-[#F79009] transition duration-150 hover:text-orange-600"
              >
                <RouterLink :to="`/blog/${4}`">
                  <span>Learn More</span>
                  <span class="text-[#F79009]">→</span>
                </RouterLink>
              </div>
            </div>
          </div>

          <template v-if="showMoreCards">
            <div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
              <img
                :src="underblog5"
                alt="Red folder covering a person"
                class="h-48 w-full object-cover"
              />
              <div class="p-6">
                <div class="mb-3 flex items-center space-x-3 text-xs font-semibold">
                  <span class="rounded-full bg-gray-100 px-3 py-1 text-[#F79009]"
                    >Policy Alerts</span
                  >
                  <span class="text-gray-500">| Nov 28, 2025</span>
                </div>
                <TypographyHeading level="h3" class="mb-3 text-xl font-bold text-gray-900">
                  Current Policy Alerts
                </TypographyHeading>
                <TypographyText class="mb-4 text-gray-600">
                  Timely updates on new or emerging policies and legislation to keep you aware of to
                  remain compliant and prepared.
                </TypographyText>
                <div
                  class="flex items-center space-x-1 text-sm font-semibold text-[#F79009] transition duration-150 hover:text-orange-600"
                >
                  <RouterLink :to="`/blog/${5}`">
                    <span>Learn More</span>
                    <span class="text-[#F79009]">→</span>
                  </RouterLink>
                </div>
              </div>
            </div>

            <div class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
              <img
                :src="underblog6"
                alt="Infographic on compliance stages"
                class="h-48 w-full object-cover"
              />
              <div class="p-6">
                <div class="mb-3 flex items-center space-x-3 text-xs font-semibold">
                  <span class="rounded-full bg-gray-100 px-3 py-1 text-[#F79009]"
                    >Compliance Tips</span
                  >
                  <span class="text-gray-500">| Nov 28, 2025</span>
                </div>
                <TypographyHeading level="h3" class="mb-3 text-xl font-bold text-gray-900">
                  Practical Compliance Guides
                </TypographyHeading>
                <TypographyText class="mb-4 text-gray-600">
                  Simple guides that help businesses avoid penalties and meet all your regulatory
                  requirements with clarity.
                </TypographyText>
                <div
                  class="flex items-center space-x-1 text-sm font-semibold text-[#F79009] transition duration-150 hover:text-orange-600"
                >
                  <RouterLink :to="`/blog/${6}`">
                    <span>Learn More</span>
                    <span class="text-[#F79009]">→</span>
                  </RouterLink>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div class="mt-12 flex justify-center">
          <Button
            variant="outline"
            class="w-full rounded-lg border border-gray-300 px-8 py-2.5 text-gray-900 transition duration-150 hover:bg-gray-50"
            @click="toggleMoreCards"
          >
            {{ showMoreCards ? 'View Less' : 'View More' }}
          </Button>
        </div>
      </section>

      <!-- <section class="-mx-6 bg-gray-50/50 py-20 text-center lg:-mx-8">
        <div class="mx-auto max-w-xl px-6">
          <TypographyHeading
            level="h3"
            class="mb-4 text-center text-2xl leading-tight font-bold text-gray-900 md:text-3xl"
          >
            Stay ahead of legal changes by
            <span class="font-extrabold text-[#3F1A0F]">subscribing</span> to our newsletter.
          </TypographyHeading>

          <TypographyText class="mb-8 text-center text-base text-gray-600">
            Join our newsletter to get early alerts on regulation updates, price fluctuations, and
            compliance insights that matter to your business.
          </TypographyText>

          <div class="mx-auto max-w-sm">
            <Input
              type="email"
              placeholder="Enter your email"
              class="focus-visible:ring-brand-primary mb-4 border-gray-300 bg-white py-6 text-center focus-visible:ring-offset-0"
            />
            <Button
              class="w-full rounded-lg bg-[#3F1A0F] py-6 text-white transition duration-200 hover:bg-[#3f1a0fab]"
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TypographyHeading, TypographyText } from '../ui/typography'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import blogIcon from '@/assets/icons/blogicon.png'
import blog1 from '@/assets/Images/blog1.png'
import blog2 from '@/assets/Images/blog2.png'
import blog3 from '@/assets/Images/blog3.png'
import blog4 from '@/assets/Images/blog4.png'
import blog5 from '@/assets/Images/blog5.png'
import underblog1 from '@/assets/Images/underblog1.png'
import underblog2 from '@/assets/Images/underblog2.png'
import underblog3 from '@/assets/Images/underblog3.png'
import underblog5 from '@/assets/Images/underblog5.png'
import underblog6 from '@/assets/Images/underblog6.png'

const showMoreCards = ref(false)
const toggleMoreCards = () => {
  showMoreCards.value = !showMoreCards.value
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
