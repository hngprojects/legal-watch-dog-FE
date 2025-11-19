<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthBranding from '@/components/authentication/AuthBranding.vue';
import MainHeader from '@/components/landing-page/MainHeader.vue';
import MainFooter from '@/components/landing-page/MainFooter.vue';

const companyName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreeToTerms = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const router = useRouter();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hasLetter = /[A-Za-z]/;
const hasNumber = /[0-9]/;
const hasSpecial = /[^A-Za-z0-9]/;
const MIN_PASSWORD_LENGTH = 8;

const sanitize = (value: string) => value.trim();

const resetForm = () => {
  companyName.value = '';
  email.value = '';
  password.value = '';
  confirmPassword.value = '';
  agreeToTerms.value = false;
  showPassword.value = false;
  showConfirmPassword.value = false;
};

const validateSignupForm = () => {
  const sanitizedCompany = sanitize(companyName.value);
  const sanitizedEmail = sanitize(email.value).toLowerCase();
  const sanitizedPassword = sanitize(password.value);
  const sanitizedConfirm = sanitize(confirmPassword.value);

  if (!sanitizedCompany) {
    window.alert('Company name is required.');
    return false;
  }

  if (!sanitizedEmail || !emailPattern.test(sanitizedEmail)) {
    window.alert('Enter a valid company email address.');
    return false;
  }

  if (!sanitizedPassword) {
    window.alert('Password is required.');
    return false;
  }

  if (sanitizedPassword.length < MIN_PASSWORD_LENGTH || !hasLetter.test(sanitizedPassword) || !hasNumber.test(sanitizedPassword) || !hasSpecial.test(sanitizedPassword)) {
    window.alert('Password must be at least 8 characters and include a letter, number, and special character.');
    return false;
  }

  if (sanitizedPassword !== sanitizedConfirm) {
    window.alert('Passwords do not match.');
    return false;
  }

  if (!agreeToTerms.value) {
    window.alert('Please agree to the terms of service to proceed.');
    return false;
  }

  return true;
};

const handleCreateAccount = () => {
  if (!validateSignupForm()) return;
  router.push({ name: 'success' });
  resetForm();
};
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    
    <MainHeader />

    <main class="flex-1 flex relative">
      
      <AuthBranding />

      <div class="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div class="w-full max-w-[440px]">
          
          <div class="lg:hidden text-center mb-8">
            <h1 class="text-2xl font-bold text-[#3C2610]">Legal WatchDog</h1>
          </div>

          <div class="text-center mb-8">
            <div class="flex items-center justify-center mb-4">
               <div class="w-12 h-12 bg-[#3C2610] rounded-full flex items-center justify-center text-[#F4E4D4]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="7" y="10" width="4" height="8" rx="1" />
                    <rect x="13" y="10" width="4" height="8" rx="1" />
                    <path d="M7 6h10v2H7z" />
                  </svg>
               </div>
            </div>

            <h2 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p class="text-sm text-gray-500">Your AI assistant for smarter legal monitoring.</p>
          </div>

          <form @submit.prevent="handleCreateAccount" class="space-y-5">
            
            <div class="relative">
              <label class="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500 pointer-events-none">
                Company Name
              </label>
              <input 
                v-model="companyName" 
                type="text" 
                placeholder="Enter your company's name"
                class="w-full px-4 py-3.5 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:border-[#3C2610] focus:ring-1 focus:ring-[#3C2610] transition-colors" 
              />
            </div>

            <div class="relative">
              <label class="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500 pointer-events-none">
                Company Email
              </label>
              <input 
                v-model="email" 
                type="email" 
                placeholder="Enter your company's email"
                class="w-full px-4 py-3.5 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:border-[#3C2610] focus:ring-1 focus:ring-[#3C2610] transition-colors" 
              />
            </div>

            <div class="relative">
              <label class="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500 pointer-events-none">
                Password
              </label>
              <input 
                v-model="password" 
                :type="showPassword ? 'text' : 'password'" 
                placeholder="Enter your password"
                class="w-full px-4 py-3.5 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:border-[#3C2610] focus:ring-1 focus:ring-[#3C2610] transition-colors pr-12" 
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>

            <div class="relative">
              <label class="absolute -top-2 left-3 bg-white px-1 text-xs text-gray-500 pointer-events-none">
                Confirm Password
              </label>
              <input 
                v-model="confirmPassword" 
                :type="showConfirmPassword ? 'text' : 'password'" 
                placeholder="Confirm your password"
                class="w-full px-4 py-3.5 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:border-[#3C2610] focus:ring-1 focus:ring-[#3C2610] transition-colors pr-12" 
              />
              <button 
                type="button" 
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
              >
                <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>

            <div class="flex items-start">
              <div class="flex h-5 items-center">
                <input
                  id="terms"
                  v-model="agreeToTerms"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-[#3C2610] focus:ring-[#3C2610] cursor-pointer"
                />
              </div>
              <div class="ml-2 text-sm">
                <label for="terms" class="text-gray-500">
                  I agree to the <a href="#" class="text-gray-900 font-medium underline decoration-1 hover:text-[#3C2610]">terms of service</a> and <a href="#" class="text-gray-900 font-medium underline decoration-1 hover:text-[#3C2610]">Privacy policy</a>
                </label>
              </div>
            </div>

            <button type="submit"
              class="w-full bg-[#3C2610] text-white py-3.5 rounded-md text-sm font-bold hover:bg-[#2a1b0b] transition-colors shadow-sm uppercase tracking-wide cursor-pointer">
              Signup
            </button>

            <div class="relative py-2">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div class="relative flex justify-center text-xs uppercase">
                <span class="px-4 bg-white text-gray-500 tracking-wider">OR</span>
              </div>
            </div>

            <div class="space-y-3">
              <button type="button"
                class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                <img src="/images/google.png" alt="Google" class="w-5 h-5">
                <span class="text-gray-700 text-sm font-medium">Continue with Google</span>
              </button>

              <button type="button"
                class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                <img src="/images/apple.png" alt="Apple" class="w-5 h-5">
                <span class="text-gray-700 text-sm font-medium">Continue with Apple</span>
              </button>

              <button type="button"
                class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 py-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                <img src="/images/microsoft.png" alt="Microsoft" class="w-5 h-5">
                <span class="text-gray-700 text-sm font-medium">Continue with Microsoft</span>
              </button>
            </div>

            <div class="text-center pt-2 pb-4">
              <p class="text-sm text-gray-600">
                Already have an account?
                <router-link to="/login" class="text-gray-900 font-bold underline hover:text-[#3C2610] ml-1">
                  Login
                </router-link>
              </p>
            </div>

          </form>
        </div>
      </div>
    </main>

    <MainFooter />
    
  </div>
</template>
