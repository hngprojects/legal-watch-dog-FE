<script setup lang="ts">
import { useRoute } from "vue-router";
import { blogPosts } from "@/data/posts";

const route = useRoute();
const blogId = Number(route.params.id);

// Find blog by ID
const blogPost = blogPosts.find((post) => post.id === blogId);
</script>

<template>
  <div v-if="blogPost" class="min-h-screen bg-gray-50 py-16">
    <div class="max-w-4xl mx-auto px-6">
      
      <!-- Category -->
      <p class="text-[#F79009] font-semibold mb-4 text-sm">
        {{ blogPost.category }}
      </p>

      <!-- Title -->
      <TypographyHeading level="h1" class="text-4xl font-bold mb-4">
        {{ blogPost.title }}
      </TypographyHeading>

      <!-- Date -->
      <p class="text-gray-500 text-sm mb-10">
        {{ blogPost.date }}
      </p>

      <!-- Main Image -->
      <img :src="blogPost.mainImage" class="w-full rounded-xl mb-10 object-cover" />

      <!-- Introduction Paragraphs -->
      <div v-for="(para, i) in blogPost.introduction" :key="i">
        <p class="text-gray-700 leading-7 mb-6">{{ para }}</p>
      </div>

      <!-- Focus Areas -->
      <section class="mt-12">
        <TypographyHeading level="h2" class="text-2xl font-bold mb-4">
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
        <TypographyHeading level="h2" class="text-2xl font-bold mb-4">
          Impact
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

    </div>
  </div>

  <div v-else class="text-center py-40 text-gray-600 text-xl">
    Blog post not found.
  </div>
</template>