<script setup lang="ts">
import { useRoute } from 'vue-router'
import { blogPosts } from '@/data/posts'

const route = useRoute()
const blogId = Number(route.params.id)

// Find blog by ID
const blogPost = blogPosts.find((post) => post.id === blogId)
</script>

<template>
  <div v-if="blogPost" class="min-h-screen bg-gray-50 py-16">
    <div class="mx-auto max-w-4xl px-6">
      <!-- Category -->
      <p class="mb-4 text-sm font-semibold text-[#F79009]">
        {{ blogPost.category }}
      </p>

      <!-- Title -->
      <TypographyHeading level="h1" class="mb-4 text-4xl font-bold">
        {{ blogPost.title }}
      </TypographyHeading>

      <!-- Date -->
      <p class="mb-10 text-sm text-gray-500">
        {{ blogPost.date }}
      </p>

      <!-- Main Image -->
      <img :src="blogPost.mainImage" class="mb-10 w-full rounded-xl object-cover" />

      <!-- Introduction Paragraphs -->
      <div v-for="(para, i) in blogPost.introduction" :key="i">
        <p class="mb-6 leading-7 text-gray-700">{{ para }}</p>
      </div>

      <!-- Focus Areas -->
      <section class="mt-12">
        <TypographyHeading level="h2" class="mb-4 text-2xl font-bold">
          Focus Areas
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

      <!-- Impact Section -->
      <section class="mt-12">
        <TypographyHeading level="h2" class="mb-4 text-2xl font-bold"> Impact </TypographyHeading>

        <p class="mb-4 text-gray-700">
          {{ blogPost.sections.impact.intro }}
        </p>

        <ul class="list-disc pl-6 text-gray-700">
          <li v-for="(value, key) in blogPost.sections.impact.items" :key="key">
            <strong>{{ key }}:</strong> {{ value }}
          </li>
        </ul>
      </section>
    </div>
  </div>

  <div v-else class="py-40 text-center text-xl text-gray-600">Blog post not found.</div>
</template>
