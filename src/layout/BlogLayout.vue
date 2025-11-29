<template>
  <div class="blog-content-block mx-auto max-w-4xl px-6 lg:px-8 py-10 bg-white min-h-screen shadow-md">
    
    <!-- Blog Metadata & Title -->
    <div class="text-center mb-10">
      <TypographyHeading level="h1" class="text-4xl font-extrabold text-[#3F1A0F] mb-3 leading-tight">
        {{ blogPost.title }}
      </TypographyHeading>
      <div class="flex items-center justify-center space-x-3 text-sm text-gray-500">
        <span class="text-xs font-semibold rounded-full bg-gray-100 px-3 py-1 text-[#F79009]">
          {{ blogPost.category }}
        </span>
        <span>| {{ blogPost.date }}</span>
      </div>
    </div>
    <figure class="mb-12">
      <img
        :src="blogPost.mainImage"
        :alt="blogPost.title"
        class="w-full h-auto max-h-[450px] object-cover rounded-xl shadow-lg"
        onerror="this.onerror=null; this.src='"
      />
    </figure>

    <!-- Main Text Content Area -->
    <article class="prose max-w-none text-gray-700">
      <div class="mb-10 text-center">
        <TypographyHeading level="h2" class="text-2xl font-bold text-gray-900 mb-4">
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
        <TypographyHeading level="h2" class="text-2xl font-bold text-gray-900 mb-4 text-center">
          Emerging Focus Areas
        </TypographyHeading>
        <TypographyText class="text-base mb-4 block">
          {{ blogPost.sections.focusAreas.intro }}
        </TypographyText>
        <ul class="list-disc list-outside ml-6 space-y-2">
          <li v-for="(item, key) in blogPost.sections.focusAreas.items" :key="key">
            <span class="font-semibold">{{ key }}:</span> {{ item }}
          </li>
        </ul>
      </div>

      <!-- Section 2: Potential Impact on Businesses -->
      <div class="mb-10" v-if="blogPost.sections?.impact">
        <TypographyHeading level="h2" class="text-2xl font-bold text-gray-900 mb-4 text-center">
          Potential Impact on Businesses
        </TypographyHeading>
        <TypographyText class="text-base mb-4 block">
          {{ blogPost.sections.impact.intro }}
        </TypographyText>
        <ul class="list-disc list-outside ml-6 space-y-2">
          <li v-for="(item, key) in blogPost.sections.impact.items" :key="key">
            <span class="font-semibold">{{ key }}:</span> {{ item }}
          </li>
        </ul>
      </div>

      <!-- Section 3: How to Prepare -->
      <div class="mb-10" v-if="blogPost.sections?.preparation">
        <TypographyHeading level="h2" class="text-2xl font-bold text-gray-900 mb-4 text-center">
          How to Prepare
        </TypographyHeading>
        <TypographyText class="text-base mb-4 block">
          {{ blogPost.sections.preparation.intro }}
        </TypographyText>
        <ol class="list-decimal list-outside ml-6 space-y-2">
          <li v-for="(item, key) in blogPost.sections.preparation.items" :key="key">
            <span class="font-semibold">{{ key }}:</span> {{ item }}
          </li>
        </ol>
      </div>

      <!-- Summary -->
      <div class="mb-10 text-center" v-if="blogPost.summary">
        <TypographyHeading level="h2" class="text-2xl font-bold text-gray-900 mb-4">
          Summary
        </TypographyHeading>
        <TypographyText class="text-lg">
          {{ blogPost.summary }}
        </TypographyText>
      </div>
    </article>

    <!-- Newsletter CTA -->
    <section class="bg-gray-50/50 py-16 text-center rounded-xl my-12">
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
            class="w-full focus-visible:ring-[#F79009] mb-4 border-gray-300 bg-white p-3 text-center focus-visible:ring-offset-0 rounded-lg shadow-sm"
          />
          <!-- The Button component needs to be imported or globally available -->
          <button
            class="w-full rounded-lg bg-[#5D2D18] py-3 text-white transition duration-200 hover:bg-[#3F1A0F] font-semibold"
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>

    <!-- Related Posts Section (Dynamic content) -->
    <section class="mt-16 pt-8 border-t border-gray-200" v-if="blogPost.relatedPosts?.length">
      <TypographyHeading level="h2" class="text-2xl font-bold text-gray-900 mb-8">
        Related Posts
      </TypographyHeading>

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div 
          v-for="post in blogPost.relatedPosts" 
          :key="post.id" 
          class="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md cursor-pointer hover:shadow-lg transition duration-300"
          @click="$emit('post-selected', post.id)"
        >
          <!-- Related Post Card -->
          <img :src="post.image" :alt="post.title" class="h-48 w-full object-cover" 
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
            <TypographyText class="mb-4 text-gray-600 line-clamp-3">
              {{ post.summary }}
            </TypographyText>
            <a
              href="#"
              class="flex items-center space-x-1 text-sm font-semibold text-[#F79009] transition duration-150 hover:text-orange-600"
              @click.prevent="$emit('post-selected', post.id)"
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
export { default as TypographyHeading } from './TypographyHeading.vue'
export { default as TypographyText } from './TypographyText.vue'

interface PostSection {
    intro: string;
    items: { [key: string]: string };
}

interface BlogPost {
  title: string;
  category: string;
  date: string;
  mainImage: string;
  introduction: string[];
  sections: {
    focusAreas?: PostSection;
    impact?: PostSection;
    preparation?: PostSection;
    [key: string]: PostSection | undefined; 
  };
  summary: string;
  relatedPosts: {
    id: number;
    title: string;
    category: string;
    date: string;
    summary: string;
    image: string;
  }[];
}

const props = defineProps<{
  blogPost: BlogPost;
}>();

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