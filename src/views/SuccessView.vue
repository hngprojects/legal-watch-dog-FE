<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AuthBranding from '@/components/authentication/AuthBranding.vue';
import MainHeader from '@/components/landing-page/MainHeader.vue';
import MainFooter from '@/components/landing-page/MainFooter.vue';
const redirectSeconds = ref(3);

onMounted(() => {
  const interval = setInterval(() => {
    if (redirectSeconds.value > 0) {
      redirectSeconds.value--;
    } else {
      clearInterval(interval);
      console.log('Redirecting to account page...');
    }
  }, 1000);
});
</script>

<template>
  <MainHeader />

<main class="w-full bg-gray-50 flex h-[calc(100vh-88px)] overflow-hidden">
  <!-- Left Section -->
  <AuthBranding />

  <!-- Right Section -->
  <div class="w-full lg:w-1/2 flex flex-col p-8 h-full">
    <!-- Centered Content -->
    <div class="flex flex-col items-center justify-center flex-1">
      <div class="w-full max-w-md text-center">

        <!-- Mobile Logo -->
        <div class="lg:hidden mb-8">
          <h1 class="text-3xl font-bold text-amber-900">Legal WatchDog</h1>
        </div>

        <!-- Success Badge -->
        <div class="flex justify-center mb-6">
          <div class="w-[79px] h-[79px] bg-green-500 rounded-full flex items-center justify-center">
            <svg width="28" height="21" viewBox="0 0 28 21" fill="none">
              <path d="M2.17 10.88L9.79 18.5L25.03 2.17"
                stroke="white" stroke-width="4.35" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>

        <h2 class="text-4xl font-medium text-gray-900 mb-1">Account Created</h2>
        <h2 class="text-4xl font-medium text-gray-900 mb-4">Successful!</h2>
        <p class="text-gray-400">Redirecting to account page</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="pb-4 text-center">
      <small class="text-gray-400 text-[15px]">
        &copy; 2025 LegalWatchDog. All Rights Reserved | Terms of Use
      </small>
    </div>
  </div>
</main>
<MainFooter/>
</template>
