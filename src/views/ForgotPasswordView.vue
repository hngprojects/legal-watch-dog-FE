<script setup lang="ts">
import forgot1 from '@/assets/images/forgot1.png';
</script>
<template>
    <div class="max-w-[1440px] mx-auto p-3 flex max-h-screen">
        <div class="basis-0 grow rounded-2xl">
            <img :src="forgot1" alt="" class="h-full w-full object-fill"/>
            
        </div>
        <main class="basis-0 grow flex items-center justify-center">
            <form>
                    <div class="flex flex-col gap-[8px] mb-[48px]">
                        <h1 class="text-[56px] font-semibold leading-14 tracking-[-0.02] text-[hsla(30,6%,7%,1)]">Forgot Password</h1>
                        <span class="text-[16px] font-normal leading-[24px] text-[hsla(0,0%,15%,1)]">Enter your Email to reset password</span>
                    </div>
                    <div class="flex flex-col gap-[6px] mb-[32px]">
                        <label for="email" class="text-[12px] ">Email</label>
                        <input id="email" type="email" placeholder="someone@email.com" class="placeholder:leading-[24px] placeholder:[hsla(0,0%,13%,1)] px-[20px] py-[16px] border-2  border-[hsla(0,0%,88%,1)] rounded-[6px] placeholder:text-[hsla(0,0%,13%,1)]" />
                    </div>
                    <div>
                        <button class="bg-[hsla(22,91%,13%,1)] text-[hsla(240,88%,97%,1)] inline-block w-full rounded-[6px] py-[13px] text-[20px] leading-[26px] cursor-pointer hover:opacity-90">Continue</button>
                    </div>
                </form>
        </main>
    </div>
</template>