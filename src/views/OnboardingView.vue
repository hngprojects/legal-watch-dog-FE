<script setup lang="ts">
import MainHeader from '@/components/landing-page/MainHeader.vue'
import MainFooter from '@/components/landing-page/MainFooter.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[#F8F4F0]">
    <MainHeader />
    <main class="flex flex-1 items-center justify-center px-6 py-12">
      <div class="max-w-2xl rounded-2xl bg-white p-10 text-center shadow-xl">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[#C27A3F]">
          Onboarding
        </p>
        <h1 class="mb-4 mt-2 text-3xl font-bold text-[#1B140E]">Let's get to know your firm</h1>
        <p class="mx-auto mb-8 max-w-xl text-sm text-[#5D4632]">
          This is the space where we'll collect the final details we need before activating your
          personalised Legal Watchdog workspace. Once submitted, you'll be redirected to verify your
          access with a one-time password and then straight into your dashboard.
        </p>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="rounded-xl border border-dashed border-[#E2D8CF] p-4 text-left">
            <p class="text-sm font-semibold text-[#1B140E]">Organisation Profile</p>
            <p class="mt-1 text-xs text-[#7C6B5A]">Tell us about your structure, size, and key jurisdictions.</p>
          </div>
          <div class="rounded-xl border border-dashed border-[#E2D8CF] p-4 text-left">
            <p class="text-sm font-semibold text-[#1B140E]">Compliance Needs</p>
            <p class="mt-1 text-xs text-[#7C6B5A]">Share the regulatory work we're monitoring for you.</p>
          </div>
        </div>
        <button
          type="button"
          class="mt-10 inline-flex items-center justify-center rounded-full bg-[#3C2610] px-10 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#2e1d0c]"
        >
          Continue to Onboarding Form
        </button>
      </div>
    </main>
    <MainFooter />
  </div>
</template>
