<script setup lang="ts">
import { ref } from 'vue';
import AuthBranding from '@/components/authentication/AuthBranding.vue';

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);

const handleLogin = () => {
  console.log('Login clicked', { email: email.value, password: password.value });
};
</script>

<template>
  <main class="min-h-screen bg-gray-50 flex">
    <AuthBranding />

    <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <div class="lg:hidden text-center mb-8">
          <h1 class="text-3xl font-bold text-amber-900">Legal WatchDog</h1>
        </div>

        <div class="text-center mb-8">
          <div class="flex  items-center justify-center mb-6 mx-auto">
            <img src="/images/logo.png" alt="" class="w-[58px] h-[58px]">
          </div>

          <h2 class="text-4xl font-medium text-gray-900 mb-2">Log in</h2>
          <p class="text-gray-400">Your AI assistant for smarter legal monitoring.</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="max-w-[400px] mx-auto space-y-4">
          <!-- Email Input -->
          <div>
            <div class="relative">
              <span class="absolute left-3 top-3 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input v-model="email" type="email" placeholder="Email"
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent" />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <div class="relative">
              <span class="absolute left-3 top-3 text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Password"
                class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center cursor-pointer">
              <input v-model="rememberMe" type="checkbox"
                class="w-4 h-4 text-amber-900 border-gray-300 rounded focus:ring-amber-900" />
              <span class="ml-2 text-gray-700">Remember me</span>
            </label>
            <a href="#" class="text-[#3C2610] hover:text-amber-800 font-medium">Forgot password?</a>
          </div>

          <!-- Login Button -->
          <button type="submit"
            class="w-full bg-[#3C2610] text-white py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors">
            Login
          </button>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-gray-50 text-gray-500">OR</span>
            </div>
          </div>

          <!-- Social Login Buttons -->
          <div class="flex flex-col gap-2.5">
            <button type="button"
              class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 rounded-[8px] hover:bg-gray-50 transition-colors">
              <img src="/images/google.png" alt="" class="w-6 h-6">
              <span class="text-gray-700 font-medium">Continue with Google</span>
            </button>

            <button type="button"
              class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <img src="/images/apple.png" alt="" class="w-6 h-6">
              <span class="text-gray-700 font-medium">Continue with Apple</span>
            </button>

            <button type="button"
              class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <img src="/images/microsoft.png" alt="" class="w-6 h-6">
              <span class="text-gray-700 font-medium">Continue with Microsoft</span>
            </button>
          </div>

          <!-- Sign Up Link -->
          <div class="text-center mt-6">
            <p class="text-sm text-gray-600">
              Don't have an account?
              <router-link to="/signup" class="text-[#3C2610] hover:text-amber-800 font-medium">
                Create Account
              </router-link>

            </p>
          </div>

          <!-- Footer -->
          <div class="text-center mt-8">
            <p class="text-xs text-gray-500">
              ©2025 LegalWatchDog. All Rights Reserved | <a href="#" class="hover:text-amber-900">Terms of Use</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
