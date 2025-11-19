<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import AuthBranding from '@/components/authentication/AuthBranding.vue';

const otpCode = ref('');
const timer = ref(32);
let interval: ReturnType<typeof setInterval> | null = null;

const email = 'd*****@gmail.com';

onMounted(() => {
  interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    }
  }, 1000);
});

onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
  }
});

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const handleContinue = () => {
  console.log('OTP Code:', otpCode.value);
};

const handleResend = () => {
  if (timer.value === 0) {
    timer.value = 32;
    otpCode.value = '';
  }
};
</script>

<template>
  <main class="min-h-screen bg-gray-50 flex">
    <!-- Left Section - Branding -->
    <AuthBranding />


    <!-- Right Section - OTP Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-8">
          <h1 class="text-3xl font-bold text-amber-900">Legal WatchDog</h1>
        </div>

        <!-- OTP Card -->
        <div class="text-center mb-8">
          <div class="flex items-center justify-center mb-6 mx-auto">
            <img src="/images/logo.png" alt="" class="w-[58px] h-[58px]">
          </div>

          <h2 class="text-4xl font-medium text-gray-900 mb-2">Enter OTP Code</h2>
          <p class="text-gray-400">Enter the 8 digit code sent to {{ email }}</p>
        </div>

        <!-- OTP Input Section -->
        <div class="max-w-[400px] mx-auto space-y-6">
          <!-- OTP Input -->
          <div class="flex justify-center">
            <input
              v-model="otpCode"
              type="text"
              maxlength="8"
              placeholder="8"
              class="w-20 h-14 text-center text-2xl font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent"
            />
          </div>

          <!-- Resend Section -->
          <div class="flex items-center justify-between text-sm">
            <button
              type="button"
              @click="handleResend"
              :class="[
                'text-gray-600',
                timer === 0 ? 'hover:text-[#3C2610] cursor-pointer underline' : 'cursor-not-allowed'
              ]"
            >
              Don't receive code?
            </button>
            <span class="text-gray-500">Resend in {{ formatTime(timer) }}</span>
          </div>

          <!-- Continue Button -->
          <button
            type="button"
            @click="handleContinue"
            class="w-full bg-[#3C2610] text-white py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
