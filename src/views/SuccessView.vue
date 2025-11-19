<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AuthBranding from '@/components/authentication/AuthBranding.vue';

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
  <main class="min-h-screen bg-gray-50 flex">
    <!-- Left Section - Branding -->
   <AuthBranding />


    <!-- Right Section - Success Message -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-8">
          <h1 class="text-3xl font-bold text-amber-900">Legal WatchDog</h1>
        </div>

        <!-- Success Card -->
        <div class="text-center mb-8">
          <!-- Logo with Success Badge -->
          <div class="flex flex-col items-center justify-center mb-6 mx-auto relative">
            <!-- Success Checkmark Badge -->
            <div class=" w-[79px] h-[79px] bg-green-500 rounded-full flex items-center justify-center">
              <svg width="28" height="21" viewBox="0 0 28 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.17676 10.8844L9.79684 18.5045L25.037 2.17578" stroke="white" stroke-width="4.35433"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>

            </div>
          </div>

          <h2 class="text-4xl font-medium text-gray-900 mb-1">Account Created</h2>
          <h2 class="text-4xl font-medium text-gray-900 mb-4">Successful!</h2>
          <p class="text-gray-400">Redirecting to account page</p>
        </div>
      </div>
    </div>
  </main>
</template>
