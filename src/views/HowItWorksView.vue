<script setup lang="ts">
import MainHeader from '@/components/landing-page/MainHeader.vue'
import MainFooter from '@/components/landing-page/MainFooter.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[#F5EFE8]">
    <MainHeader />
    <main class="flex flex-1 items-center justify-center px-6 py-16">
      <section class="w-full max-w-5xl rounded-4xl bg-white p-10 shadow-2xl">
        <p class="text-xs font-semibold tracking-[0.3em] text-[#C27A3F] uppercase">How it works</p>
        <h1 class="mt-2 text-3xl font-bold text-[#1D140B]">
          From sign-up to signals in four steps
        </h1>
        <div class="mt-10 grid gap-6 md:grid-cols-2">
          <article class="rounded-3xl border border-[#F1E4D7] p-6">
            <p class="text-xs font-semibold text-[#BE8554]">Step 1</p>
            <h2 class="mt-2 text-xl font-semibold text-[#1D140B]">Tell us about your firm</h2>
            <p class="mt-2 text-sm text-[#705C4A]">
              Share your industry, jurisdictions, and primary compliance needs so we can tailor
              feeds to you.
            </p>
          </article>
          <article class="rounded-3xl border border-[#F1E4D7] p-6">
            <p class="text-xs font-semibold text-[#BE8554]">Step 2</p>
            <h2 class="mt-2 text-xl font-semibold text-[#1D140B]">Verify your access</h2>
            <p class="mt-2 text-sm text-[#705C4A]">
              Complete OTP verification so we can keep your workspace secure.
            </p>
          </article>
          <article class="rounded-3xl border border-[#F1E4D7] p-6">
            <p class="text-xs font-semibold text-[#BE8554]">Step 3</p>
            <h2 class="mt-2 text-xl font-semibold text-[#1D140B]">Onboard in minutes</h2>
            <p class="mt-2 text-sm text-[#705C4A]">
              Add your projects and stakeholders, then choose the regulators and watchlists to
              monitor.
            </p>
          </article>
          <article class="rounded-3xl border border-[#F1E4D7] p-6">
            <p class="text-xs font-semibold text-[#BE8554]">Step 4</p>
            <h2 class="mt-2 text-xl font-semibold text-[#1D140B]">Receive AI signals</h2>
            <p class="mt-2 text-sm text-[#705C4A]">
              Sit back while Legal Watchdog delivers prioritised insights, summaries, and alerts to
              your dashboard.
            </p>
          </article>
        </div>
        <div class="mt-10 flex flex-wrap gap-4">
          <router-link
            :to="{ name: 'signup' }"
            class="inline-flex items-center justify-center rounded-full bg-[#3C2610] px-8 py-3 text-sm font-semibold text-white shadow-md"
          >
            Get started
          </router-link>
          <router-link
            :to="{ name: 'waitlist' }"
            class="inline-flex items-center justify-center rounded-full border border-[#3C2610] px-8 py-3 text-sm font-semibold text-[#3C2610]"
          >
            Join the waitlist
          </router-link>
        </div>
      </section>
    </main>
    <MainFooter />
  </div>
</template>
