<template>
  <div class="blogs-page relative overflow-hidden bg-[#f7f7f7]">
    <div
      class="pointer-events-none absolute top-0 left-1/2 z-0 h-[800px] w-[1600px] -translate-x-1/2 -translate-y-[60%] rounded-[50%]"
      style="
        background: radial-gradient(
          ellipse,
          #f8d9c5 0%,
          rgba(248, 217, 197, 0.5) 40%,
          rgba(247, 247, 247, 0.8) 70%,
          transparent 100%
        );
      "
    ></div>
    <div class="app-container relative z-10 mx-auto px-6 lg:px-8">
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
        <div class="relative" @mouseenter="stopAutoSlide" @mouseleave="startAutoSlide">
          <div
            class="overflow-hidden rounded-2xl border border-gray-200 shadow-md"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd"
          >
            <div
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
            >
              <div v-for="(slide, idx) in slides" :key="idx" class="w-full shrink-0">
                <div class="grid grid-cols-1 gap-3 bg-white p-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div
                    v-for="item in slide"
                    :key="item.alt"
                    class="relative overflow-hidden rounded-xl"
                  >
                    <img
                      :src="item.src"
                      :alt="item.alt"
                      class="h-48 w-full bg-gray-50 object-cover sm:h-56 md:h-60 lg:h-64"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            class="btn--default btn--icon-only btn--icon-sm absolute top-1/2 left-3 z-10 -translate-y-1/2"
            type="button"
            aria-label="Previous slide"
            @click="prevSlide"
          >
            <svg class="text-bg h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            class="btn--default btn--icon-only btn--icon-sm absolute top-1/2 right-3 z-10 -translate-y-1/2"
            type="button"
            aria-label="Next slide"
            @click="nextSlide"
          >
            <svg class="text-bg h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div class="mt-4 flex justify-center gap-2">
            <button
              v-for="(_, idx) in slides"
              :key="idx"
              type="button"
              class="h-2 w-2 rounded-full transition-all"
              :class="idx === currentSlide ? 'w-4 bg-[#3F1A0F]' : 'bg-gray-300'"
              @click="goToSlide(idx)"
              :aria-label="`Go to slide ${idx + 1}`"
            />
          </div>
        </div>
      </section>

      <section class="py-10">
        <div
          class="mb-10 flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0 lg:gap-10"
        >
          <TypographyHeading level="h2" class="text-3xl font-bold text-gray-900">
            Blogs
          </TypographyHeading>

          <form
            class="flex w-full items-center rounded-lg border border-gray-300 bg-gray-50 p-1"
            role="search"
            @submit.prevent
          >
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
              class="h-9 grow border-0 bg-transparent px-2 py-1 text-base outline-0"
              placeholder="Search Blogs..."
              v-model="searchTerm"
            />
          </form>
        </div>

        <div v-if="displayedPosts.length" class="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          <RouterLink
            v-for="post in displayedPosts"
            :key="post.id"
            :to="`/blog/${post.slug}`"
            custom
            v-slot="{ href, navigate }"
          >
            <article
              :href="href"
              @click="navigate"
              class="group cursor-pointer overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition duration-300 ease-in-out hover:border-gray-200 hover:shadow-xl"
            >
              <img
                :src="post.mainImage"
                :alt="post.title"
                class="h-48 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />
              <div class="p-6">
                <div class="mb-3 flex items-center space-x-3 text-xs font-semibold">
                  <span class="rounded-full bg-gray-100 px-3 py-1 text-[#F79009]">
                    {{ post.category }}
                  </span>
                  <span class="text-gray-500">| {{ post.date }}</span>
                </div>
                <TypographyHeading
                  level="h3"
                  class="mb-3 text-xl font-bold text-gray-900 transition duration-150 group-hover:text-[#3F1A0F]"
                >
                  {{ post.title }}
                </TypographyHeading>
                <TypographyText class="mb-4 text-gray-600">
                  {{ getPreview(post) }}
                </TypographyText>
              </div>
            </article>
          </RouterLink>
        </div>

        <div
          v-else
          class="rounded-xl border border-gray-100 bg-white p-10 text-center text-gray-600 shadow-md"
        >
          No blog posts match your search yet.
        </div>

        <div class="mt-12 flex justify-center" v-if="canToggle">
          <Button
            class="mt-6 cursor-pointer self-center px-[50px] text-sm sm:mt-7 sm:px-[120px] sm:text-base lg:mt-8"
            size="lg"
            variant="default"
            @click="toggleMoreCards"
          >
            {{ showMoreCards ? 'View Less' : 'View More' }}
          </Button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { TypographyHeading, TypographyText } from '../ui/typography'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { blogPosts } from '@/data/posts'

import blogIcon from '@/assets/icons/blogicon.png'
import blog1 from '@/assets/Images/blog1.png'
import blog2 from '@/assets/Images/blog2.png'
import blog3 from '@/assets/Images/blog3.png'
import blog4 from '@/assets/Images/blog4.png'
import blog5 from '@/assets/Images/blog5.png'
import underblog4 from '@/assets/Images/underblog4.png'

const carouselImages = [
  { src: blog5, alt: 'Person typing policy document' },
  { src: blog2, alt: 'Compliance charts and people in a meeting' },
  { src: blog3, alt: 'Person holding a tablet with security icons' },
  { src: blog4, alt: 'Abstract law, legal, and rights icons' },
  { src: blog1, alt: 'Laptop displaying policy text' },
  { src: underblog4, alt: 'Market and industry insights charts' },
]

const searchTerm = ref('')
const showMoreCards = ref(false)
const currentSlide = ref(0)
const autoSlideDelay = 5000
let autoSlideTimer: number | null = null
const perView = ref(1)

const slides = computed(() => {
  const chunkSize = perView.value
  const result: Array<Array<(typeof carouselImages)[number]>> = []
  for (let i = 0; i < carouselImages.length; i += chunkSize) {
    result.push(carouselImages.slice(i, i + chunkSize))
  }
  return result
})

const filteredPosts = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return blogPosts
  return blogPosts.filter((post) => post.title.toLowerCase().includes(term))
})

const displayedPosts = computed(() => {
  const posts = filteredPosts.value
  if (showMoreCards.value || posts.length <= 4) return posts
  return posts.slice(0, 4)
})

const canToggle = computed(() => filteredPosts.value.length > 4)

const toggleMoreCards = () => {
  showMoreCards.value = !showMoreCards.value
}

watch(filteredPosts, (posts) => {
  if (posts.length <= 4) {
    showMoreCards.value = false
  }
})

watch(slides, (newSlides) => {
  const maxIndex = newSlides.length - 1
  if (currentSlide.value > maxIndex) {
    currentSlide.value = maxIndex >= 0 ? maxIndex : 0
  }
})

const getPreview = (post: (typeof blogPosts)[number]) => post.introduction?.[0] ?? ''

const goToSlide = (index: number) => {
  const total = slides.value.length
  currentSlide.value = (index + total) % total
  startAutoSlide()
}

const nextSlide = () => goToSlide(currentSlide.value + 1)
const prevSlide = () => goToSlide(currentSlide.value - 1)

let touchStartX = 0
const onTouchStart = (event: TouchEvent) => {
  touchStartX = event.touches[0]?.clientX ?? 0
}

const onTouchEnd = (event: TouchEvent) => {
  const deltaX = (event.changedTouches[0]?.clientX ?? 0) - touchStartX
  if (Math.abs(deltaX) < 40) return
  if (deltaX < 0) nextSlide()
  else prevSlide()
}

const startAutoSlide = () => {
  stopAutoSlide()
  autoSlideTimer = window.setInterval(() => nextSlide(), autoSlideDelay)
}

const stopAutoSlide = () => {
  if (autoSlideTimer !== null) {
    clearInterval(autoSlideTimer)
    autoSlideTimer = null
  }
}

const setPerViewFromWidth = () => {
  const width = window.innerWidth
  if (width >= 1024) perView.value = 3
  else if (width >= 640) perView.value = 2
  else perView.value = 1
}

onMounted(() => {
  setPerViewFromWidth()
  window.addEventListener('resize', setPerViewFromWidth)
  startAutoSlide()
})

onUnmounted(() => {
  window.removeEventListener('resize', setPerViewFromWidth)
  stopAutoSlide()
})
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
