<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { blogPosts } from '@/data/posts'
import TypographyHeading from '@/components/ui/typography/TypographyHeading.vue'
// import TypographyText from '@/components/ui/typography/TypographyText.vue'

const route = useRoute()

const blogId = computed(() => route.params.slug)

const blogPost = computed(() => blogPosts.find((post) => post.slug === blogId.value))
</script>
<template>
  <div v-if="blogPost" class="min-h-screen bg-gray-50 py-16">
    <div class="mx-auto max-w-4xl px-6">
      <p class="mb-4 text-sm font-semibold text-[#F79009]">
        {{ blogPost.category }}
      </p>

      <TypographyHeading level="h1" class="mb-4 text-4xl font-bold">
        {{ blogPost.title }}
      </TypographyHeading>

      <p class="mb-10 text-sm text-gray-500">
        {{ blogPost.date }}
      </p>

      <img :src="blogPost.mainImage" class="mb-10 w-full rounded-xl object-cover" />

      <!-- Introduction -->
      <section>
        <TypographyHeading level="h2" class="mb-4 text-center text-2xl font-bold">
          Introduction
        </TypographyHeading>
        <p v-for="(para, i) in blogPost.introduction" :key="i" class="mb-6 leading-7 text-gray-700">
          {{ para }}
        </p>
      </section>

      <!-- Emerging Focus Areas -->
      <section v-if="blogPost.sections.focusAreas" class="mt-12">
        <TypographyHeading level="h2" class="mb-4 text-center text-2xl font-bold">
          Emerging Focus Areas
        </TypographyHeading>

        <p class="mb-4 text-gray-700">
          {{ blogPost.sections.focusAreas.intro }}
        </p>

        <ul class="list-disc pl-6 text-gray-700">
          <li v-for="(value, key) in blogPost.sections.focusAreas.items" :key="key">
            <strong>{{ key }}:</strong> {{ value }}
          </li>
        </ul>
      </section>

      <!-- Impact -->
      <section v-if="blogPost.sections.impact" class="mt-12">
        <TypographyHeading level="h2" class="mb-4 text-center text-2xl font-bold">
          Potential Impact on Businesses
        </TypographyHeading>

        <p class="mb-4 text-gray-700">
          {{ blogPost.sections.impact.intro }}
        </p>

        <ul class="list-disc pl-6 text-gray-700">
          <li v-for="(value, key) in blogPost.sections.impact.items" :key="key">
            <strong>{{ key }}:</strong> {{ value }}
          </li>
        </ul>
      </section>

      <!-- Preparation -->
      <section v-if="blogPost.sections.preparation" class="mt-12">
        <TypographyHeading level="h2" class="mb-4 text-center text-2xl font-bold">
          How to Prepare
        </TypographyHeading>

        <p class="mb-4 text-gray-700">{{ blogPost.sections.preparation.intro }}</p>

        <ol class="list-decimal pl-6 text-gray-700">
          <li v-for="(value, key) in blogPost.sections.preparation.items" :key="key">
            <strong>{{ key }}:</strong> {{ value }}
          </li>
        </ol>
      </section>

      <!-- Summary -->
      <section v-if="blogPost.summary" class="mt-12">
        <TypographyHeading level="h2" class="mb-4 text-center text-2xl font-bold">
          Summary
        </TypographyHeading>

        <p class="mb-4 text-gray-700">
          {{ blogPost.summary }}
        </p>
      </section>
      <!-- <section class="pt-16 pb-20 text-center">
        <TypographyHeading
          level="h2"
          class="mb-4 text-center text-3xl font-extrabold text-gray-900 md:text-4xl"
        >
          Stay ahead of legal changes by
          <span class="text-[#F2AB6D]"> subscribing</span>
          to our newsletter.
        </TypographyHeading>

        <TypographyText class="mx-auto max-w-2xl text-center text-gray-600">
          Join our newsletter to get early alerts on regulation updates, price fluctuations, and
          compliance insights that matter to your business.
        </TypographyText>

        <div class="mx-auto mt-8 max-w-md">
          <Input
            type="email"
            placeholder="Enter your email"
            class="focus-visible:ring-brand-primary mb-4 w-full rounded-lg border-gray-600 bg-white py-4 text-center focus-visible:ring-offset-0"
          />
          <Button
            class="w-full rounded-lg bg-[#3F1A0F] py-4 text-white transition duration-200 hover:bg-[#3f1a0fab]"
          >
            Subscribe
          </Button>
        </div>
      </section> -->
      <!-- Related Posts -->
      <section v-if="blogPost.relatedPosts?.length" class="mt-16 border-t border-gray-200 pt-8">
        <TypographyHeading level="h2" class="mb-8 text-2xl font-bold">
          Related Posts
        </TypographyHeading>

        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div
            v-for="post in blogPost.relatedPosts"
            :key="post.id"
            class="cursor-pointer rounded-xl border bg-white shadow-md transition hover:shadow-lg"
            @click="$router.push(`/blog/${blogPosts.find((bp) => bp.id === post.id)?.slug}`)"
          >
            <img :src="post.image" class="h-48 w-full rounded-t-xl object-cover" />

            <div class="p-6">
              <p class="mb-2 text-sm text-[#F79009]">{{ post.category }}</p>
              <p class="mb-2 text-lg font-bold">{{ post.title }}</p>
              <p class="line-clamp-3 text-gray-600">{{ post.summary }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>

  <div v-else class="py-40 text-center text-xl text-gray-600">Blog post not found.</div>
</template>
