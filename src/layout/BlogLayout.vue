<template>
  <div
    class="blog-content-block mx-auto min-h-screen max-w-4xl bg-white px-6 py-10 shadow-md lg:px-8"
  >
    <!-- Blog Metadata & Title -->
    <div class="mb-10 text-center">
      <TypographyHeading
        level="h1"
        class="mb-3 text-4xl leading-tight font-extrabold text-[#3F1A0F]"
      >
        {{ blogPost.title }}
      </TypographyHeading>
      <div class="flex items-center justify-center space-x-3 text-sm text-gray-500">
        <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-[#F79009]">
          {{ blogPost.category }}
        </span>
        <span>| {{ blogPost.date }}</span>
      </div>
    </div>
    <figure class="mb-12">
      <img
        :src="blogPost.mainImage"
        :alt="blogPost.title"
        class="h-auto max-h-[450px] w-full rounded-xl object-cover shadow-lg"
        onerror="this.onerror=null; this.src='"
      />
    </figure>

    <!-- Main Text Content Area -->
    <article class="prose max-w-none text-gray-700">
      <div class="mb-10 text-center">
        <TypographyHeading level="h2" class="mb-4 text-2xl font-bold text-gray-900">
          Introduction
        </TypographyHeading>
        <template v-for="(p, index) in blogPost.introduction" :key="index">
          <TypographyText class="text-lg" :class="{ 'mt-4': index > 0 }">
            {{ p }}
          </TypographyText>
        </template>
      </div>

      <!-- Section 1: Emerging Focus Areas -->
      <div class="mb-10" v-if="blogPost.sections?.focusAreas">
        <TypographyHeading level="h2" class="mb-4 text-center text-2xl font-bold text-gray-900">
          Emerging Focus Areas
        </TypographyHeading>
        <TypographyText class="mb-4 block text-base">
          {{ blogPost.sections.focusAreas.intro }}
        </TypographyText>
        <ul class="ml-6 list-outside list-disc space-y-2">
          <li v-for="(item, key) in blogPost.sections.focusAreas.items" :key="key">
            <span class="font-semibold">{{ key }}:</span> {{ item }}
          </li>
        </ul>
      </div>

      <!-- Section 2: Potential Impact on Businesses -->
      <div class="mb-10" v-if="blogPost.sections?.impact">
        <TypographyHeading level="h2" class="mb-4 text-center text-2xl font-bold text-gray-900">
          Potential Impact on Businesses
        </TypographyHeading>
        <TypographyText class="mb-4 block text-base">
          {{ blogPost.sections.impact.intro }}
        </TypographyText>
        <ul class="ml-6 list-outside list-disc space-y-2">
          <li v-for="(item, key) in blogPost.sections.impact.items" :key="key">
            <span class="font-semibold">{{ key }}:</span> {{ item }}
          </li>
        </ul>
      </div>

      <!-- Section 3: How to Prepare -->
      <div class="mb-10" v-if="blogPost.sections?.preparation">
        <TypographyHeading level="h2" class="mb-4 text-center text-2xl font-bold text-gray-900">
          How to Prepare
        </TypographyHeading>
        <TypographyText class="mb-4 block text-base">
          {{ blogPost.sections.preparation.intro }}
        </TypographyText>
        <ol class="ml-6 list-outside list-decimal space-y-2">
          <li v-for="(item, key) in blogPost.sections.preparation.items" :key="key">
            <span class="font-semibold">{{ key }}:</span> {{ item }}
          </li>
        </ol>
      </div>

      <!-- Summary -->
      <div class="mb-10 text-center" v-if="blogPost.summary">
        <TypographyHeading level="h2" class="mb-4 text-2xl font-bold text-gray-900">
          Summary
        </TypographyHeading>
        <TypographyText class="text-lg">
          {{ blogPost.summary }}
        </TypographyText>
      </div>
    </article>

    <!-- Newsletter CTA -->
    <!-- <section class="my-12 rounded-xl bg-gray-50/50 py-16 text-center">
      <div class="mx-auto max-w-xl px-6">
        <TypographyHeading
          level="h3"
          class="mb-4 text-center text-2xl leading-tight font-bold text-gray-900 md:text-3xl"
        >
          Stay ahead of legal changes by
          <span class="font-extrabold text-[#F79009]">subscribing</span> to our newsletter.
        </TypographyHeading>

        <TypographyText class="mb-8 text-center text-base text-gray-600">
          Join our newsletter to get early alerts on regulation updates, price fluctuations, and
          compliance insights that matter to your business.
        </TypographyText>

        <div class="mx-auto max-w-sm">
          <input
            type="email"
            placeholder="Enter your email"
            class="mb-4 w-full rounded-lg border-gray-300 bg-white p-3 text-center shadow-sm focus-visible:ring-[#F79009] focus-visible:ring-offset-0"
          />
          <button
            class="w-full rounded-lg bg-[#5D2D18] py-3 font-semibold text-white transition duration-200 hover:bg-[#3F1A0F]"
          >
            Subscribe
          </button>
        </div>
      </div>
    </section> -->

    <!-- Related Posts Section (Dynamic content) -->
    <section class="mt-16 border-t border-gray-200 pt-8" v-if="blogPost.relatedPosts?.length">
      <TypographyHeading level="h2" class="mb-8 text-2xl font-bold text-gray-900">
        Related Posts
      </TypographyHeading>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div
          v-for="post in blogPost.relatedPosts"
          :key="post.id"
          class="cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition duration-300 hover:shadow-lg"
          @click="emit('post-selected', post.id)"
        >
          <!-- Related Post Card -->
          <img
            :src="post.image"
            :alt="post.title"
            class="h-48 w-full object-cover"
            onerror="this.onerror=null; this.src='https://placehold.co/400x192/e0e0e0/5D2D18?text=Related+Image'"
          />
          <div class="p-6">
            <div class="mb-3 flex items-center space-x-3 text-xs font-semibold">
              <span class="rounded-full bg-gray-100 px-3 py-1 text-[#F79009]">
                {{ post.category }}
              </span>
              <span class="text-gray-500">| {{ post.date }}</span>
            </div>
            <TypographyHeading level="h3" class="mb-3 text-xl font-bold text-gray-900">
              {{ post.title }}
            </TypographyHeading>
            <TypographyText class="mb-4 line-clamp-3 text-gray-600">
              {{ post.summary }}
            </TypographyText>
            <a
              href="#"
              class="flex items-center space-x-1 text-sm font-semibold text-[#F79009] transition duration-150 hover:text-orange-600"
              @click.prevent="emit('post-selected', post.id)"
            >
              <span>Read More</span>
              <span class="text-[#F79009]">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import TypographyHeading from './TypographyHeading.vue'
import TypographyText from './TypographyText.vue'

interface PostSection {
  intro: string
  items: { [key: string]: string }
}

interface BlogPost {
  title: string
  category: string
  date: string
  mainImage: string
  introduction: string[]
  sections: {
    focusAreas?: PostSection
    impact?: PostSection
    preparation?: PostSection
    [key: string]: PostSection | undefined
  }
  summary: string
  relatedPosts: {
    id: number
    title: string
    category: string
    date: string
    summary: string
    image: string
  }[]
}

const { blogPost } = defineProps<{
  blogPost: BlogPost
}>()

const emit = defineEmits<{
  (e: 'post-selected', id: number): void
}>()
</script>

<style scoped>
.blog-content-block {
  background-color: #ffffff;
}
.h-48 {
  height: 12rem;
}
</style>
