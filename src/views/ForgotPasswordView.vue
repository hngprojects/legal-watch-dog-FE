<script setup lang="ts">
import forgot1 from '@/assets/images/forgot1.png'
</script>
<template>
  <div class="mx-auto flex max-h-screen max-w-[1440px] p-3">
    <div class="grow basis-0 rounded-2xl">
      <img :src="forgot1" alt="" class="h-full w-full object-fill" />
    </div>
    <main class="flex grow basis-0 items-center justify-center">
      <form>
        <div class="mb-[48px] flex flex-col gap-[8px]">
          <h1 class="text-[56px] leading-14 font-semibold tracking-[-0.02] text-[hsla(30,6%,7%,1)]">
            Forgot Password
          </h1>
          <span class="text-[16px] leading-[24px] font-normal text-[hsla(0,0%,15%,1)]"
            >Enter your Email to reset password</span
          >
        </div>
        <div class="mb-[32px] flex flex-col gap-[6px]">
          <label for="email" class="text-[12px]">Email</label>
          <input
            id="email"
            type="email"
            placeholder="someone@email.com"
            class="placeholder:[hsla(0,0%,13%,1)] rounded-[6px] border-2 border-[hsla(0,0%,88%,1)] px-[20px] py-[16px] placeholder:leading-[24px] placeholder:text-[hsla(0,0%,13%,1)]"
          />
        </div>
        <div>
          <button
            class="inline-block w-full cursor-pointer rounded-[6px] bg-[hsla(22,91%,13%,1)] py-[13px] text-[20px] leading-[26px] text-[hsla(240,88%,97%,1)] hover:opacity-90"
          >
            Continue
          </button>
        </div>
      </form>
    </main>
  </div>
</template>
