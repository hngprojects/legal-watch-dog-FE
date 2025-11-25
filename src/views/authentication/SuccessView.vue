<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AuthLayout from '@/components/authentication/AuthLayout.vue'
const redirectSeconds = ref(3)

onMounted(() => {
  const interval = setInterval(() => {
    if (redirectSeconds.value > 0) {
      redirectSeconds.value--
    } else {
      clearInterval(interval)
      console.log('Redirecting to account page...')
    }
  }, 1000)
})
</script>

<template>
  <AuthLayout
    wrapper-class="bg-gray-50"
    main-class="h-[calc(100vh-88px)] w-full overflow-hidden bg-gray-50"
    container-class="h-full items-stretch justify-start p-8 lg:w-1/2"
  >
    <div class="flex h-full flex-col">
      <div class="flex flex-1 flex-col items-center justify-center">
        <div class="w-full max-w-md text-center">
          <div class="mb-8 lg:hidden">
            <h1 class="text-3xl font-bold text-amber-900">Legal WatchDog</h1>
          </div>

          <div class="mb-6 flex justify-center">
            <div
              class="flex h-[79px] w-[79px] items-center justify-center rounded-full bg-green-500"
            >
              <svg width="28" height="21" viewBox="0 0 28 21" fill="none">
                <path
                  d="M2.17 10.88L9.79 18.5L25.03 2.17"
                  stroke="white"
                  stroke-width="4.35"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>

          <h2 class="mb-1 text-4xl font-medium text-gray-900">Account Created</h2>
          <h2 class="mb-4 text-4xl font-medium text-gray-900">Successful!</h2>
          <p class="text-gray-400">Redirecting to account page</p>
        </div>
      </div>

      <div class="pb-4 text-center">
        <small class="text-[15px] text-gray-400">
          &copy; 2025 LegalWatchDog. All Rights Reserved | Terms of Use
        </small>
      </div>
    </div>
  </AuthLayout>
</template>
