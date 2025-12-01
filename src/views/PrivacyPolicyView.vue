<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

type Section = {
  id: string
  label: string
}

const sections: Section[] = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'information-we-collect', label: 'Information We Collect' },
  { id: 'use-of-information', label: 'How We Use Information' },
  { id: 'legal-basis', label: 'Legal Basis for Processing' },
  { id: 'data-sharing', label: 'How We Share Information' },
  { id: 'data-retention', label: 'Data Storage & Retention' },
  { id: 'security', label: 'Security Measures' },
  { id: 'rights', label: 'Your Rights' },
  { id: 'ai-transparency', label: 'AI Transparency' },
  { id: 'international-transfers', label: 'International Data Transfers' },
  { id: 'children', label: "Children's Privacy" },
  { id: 'updates', label: 'Updates to this Policy' },
  { id: 'contact', label: 'Contact Information' },
]

const activeSection = ref(sections[0]?.id)
let observer: IntersectionObserver | null = null

const setActiveSection = (id: string) => {
  activeSection.value = id
}

onMounted(() => {
  if (typeof window === 'undefined') return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    },
    {
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0.1,
    },
  )

  sections.forEach(({ id }) => {
    const el = document.getElementById(id)
    if (el) observer?.observe(el)
  })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-[#F7F4EF] text-gray-800">
    <main class="relative flex-1">
      <div
        class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]"
        style="
          background: radial-gradient(
            60% 55% at 50% 35%,
            rgba(242, 171, 109, 0.24),
            rgba(247, 244, 239, 0.8) 55%,
            rgba(247, 244, 239, 0.9) 80%,
            #f7f4ef 100%
          );
        "
      ></div>

      <section
        class="app-container mx-auto flex w-full flex-col gap-10 px-4 py-14 sm:px-6 lg:flex-row lg:gap-14 lg:py-20"
      >
        <aside
          class="sticky top-24 z-10 hidden w-64 shrink-0 self-start lg:block"
          aria-label="Privacy policy sections"
        >
          <h2 class="text-sm font-semibold tracking-wide text-[#c36932] uppercase">Overview</h2>
          <nav class="mt-4 space-y-1" aria-label="On-page navigation">
            <a
              v-for="section in sections"
              :key="section.id"
              :href="`#${section.id}`"
              @click="setActiveSection(section.id)"
              class="focus-visible:ring-accent-main group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              :class="{
                'bg-[#fdebd8] text-[#3C2610] shadow-sm ring-1 ring-[#f5c9a3]':
                  activeSection === section.id,
                'hover:bg-white': activeSection !== section.id,
              }"
              :aria-current="activeSection === section.id ? 'true' : undefined"
            >
              <span
                class="h-1.5 w-1.5 rounded-full"
                :class="activeSection === section.id ? 'bg-[#c36932]' : 'bg-gray-300'"
                aria-hidden="true"
              ></span>
              <span>{{ section.label }}</span>
            </a>
          </nav>
        </aside>

        <div class="app-container w-full space-y-10">
          <header class="space-y-3">
            <div>
              <h1 class="text-foregroud text-4xl font-bold sm:text-[60px]">Privacy Policy</h1>
              <p class="font-medium text-gray-600 sm:text-[36px]">
                How we handle and protect your data
              </p>
              <p class="text-gray-500 sm:text-[16px]">Last updated: 23rd November, 2025.</p>
            </div>
          </header>

          <div class="policy-content grid gap-10 lg:grid-cols-[minmax(0,1fr)]">
            <nav class="lg:hidden" aria-label="Privacy policy sections (mobile)">
              <div
                class="flex flex-col gap-2 overflow-x-auto rounded-xl border border-[#f4e4d7] bg-white/90 p-3"
              >
                <a
                  v-for="section in sections"
                  :key="section.id"
                  :href="`#${section.id}`"
                  @click="setActiveSection(section.id)"
                  class="rounded-full px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors duration-150"
                  :class="
                    activeSection === section.id
                      ? 'bg-[#fdebd8] text-[#3C2610]'
                      : 'text-gray-600 hover:bg-gray-50'
                  "
                  :aria-current="activeSection === section.id ? 'true' : undefined"
                >
                  {{ section.label }}
                </a>
              </div>
            </nav>

            <section id="introduction" class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold text-[#3C2610]">Introduction</h2>
                <p class="mt-2 text-gray-600">
                  LegalWatchDog provides automated regulatory monitoring, source tracking, and
                  AI-powered summarization for enterprise teams. This Privacy Policy explains how we
                  collect, use, store, and protect information when organizations use our platform.
                  By creating an account or accessing the service, you agree to this policy.
                </p>
              </div>
            </section>

            <section id="information-we-collect" class="space-y-6">
              <div class="space-y-3">
                <h2 class="text-2xl font-bold text-[#3C2610]">Information We Collect</h2>
                <p class="text-gray-600">
                  We collect information to provide and improve our services.
                </p>
              </div>

              <div class="space-y-6 text-gray-700">
                <div class="space-y-2">
                  <h3 class="text-lg font-semibold text-[#3C2610]">
                    A. Company &amp; Account Information
                  </h3>
                  <p class="text-gray-600">We may collect:</p>
                  <ul class="mt-2 list-disc space-y-1 pl-6">
                    <li>Company name</li>
                    <li>Work email</li>
                    <li>Industry</li>
                    <li>Company size</li>
                    <li>Admin details</li>
                    <li>User roles and permissions within the organization</li>
                  </ul>
                </div>

                <div class="space-y-2">
                  <h3 class="text-lg font-semibold text-[#3C2610]">B. Platform Usage Data</h3>
                  <p class="text-gray-600">This includes:</p>
                  <ul class="mt-2 list-disc space-y-1 pl-6">
                    <li>Created projects and jurisdictions</li>
                    <li>Added sources (URLs, files, documents)</li>
                    <li>Sub-jurisdiction selections</li>
                    <li>AI instructions or monitoring preferences</li>
                    <li>Activity logs (views, uploads, edits, assignments)</li>
                  </ul>
                </div>

                <div class="space-y-2">
                  <h3 class="text-lg font-semibold text-[#3C2610]">C. Uploaded Documents</h3>
                  <p class="text-gray-600">If your team uploads documents, we store:</p>
                  <ul class="mt-2 list-disc space-y-1 pl-6">
                    <li>Internal compliance files</li>
                    <li>Legal documents</li>
                    <li>Regulatory filings</li>
                    <li>News articles</li>
                  </ul>
                </div>

                <div class="space-y-2">
                  <h3 class="text-lg font-semibold text-[#3C2610]">
                    D. Automatically Collected Technical Data
                  </h3>
                  <p class="text-gray-600">This includes:</p>
                  <ul class="mt-2 list-disc space-y-1 pl-6">
                    <li>Device type</li>
                    <li>Browser and OS</li>
                    <li>IP address</li>
                    <li>Session logs</li>
                    <li>Time of access</li>
                    <li>Performance logs</li>
                    <li>Security events</li>
                  </ul>
                </div>

                <div class="space-y-2">
                  <h3 class="text-lg font-semibold text-[#3C2610]">E. AI Processing Data</h3>
                  <p class="text-gray-600">To provide accurate monitoring:</p>
                  <ul class="mt-2 list-disc space-y-1 pl-6">
                    <li>Extracted text from scanned sources</li>
                    <li>AI-generated summaries</li>
                    <li>Content-derived scores</li>
                    <li>Detected website changes</li>
                  </ul>
                </div>

                <div class="space-y-2">
                  <h3 class="text-lg font-semibold text-[#3C2610]">
                    F. Cookies &amp; Tracking Technologies
                  </h3>
                  <p class="text-gray-600">We use:</p>
                  <ul class="mt-2 list-disc space-y-1 pl-6">
                    <li>Session cookies</li>
                    <li>Analytics cookies</li>
                    <li>Preference cookies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section id="use-of-information" class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold text-[#3C2610]">How We Use Information</h2>
                <p class="mt-2 text-gray-600">We process data to:</p>
              </div>
              <ul class="list-disc space-y-2 pl-6 text-gray-700">
                <li>Create and manage enterprise accounts</li>
                <li>Track regulatory sources</li>
                <li>Detect changes and issue alerts</li>
                <li>Generate AI summaries</li>
                <li>Power the dashboard and reporting features</li>
                <li>Provide customer support</li>
                <li>Improve service accuracy and reliability</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </section>

            <section id="legal-basis" class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold text-[#3C2610]">Legal Basis for Processing</h2>
                <p class="mt-2 text-gray-600">Depending on your region, we rely on:</p>
              </div>
              <ul class="list-disc space-y-2 pl-6 text-gray-700">
                <li>Performance of a contract</li>
                <li>Legitimate business interest</li>
                <li>Compliance with legal obligations</li>
                <li>Consent for optional analytics</li>
              </ul>
            </section>

            <section id="data-sharing" class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold text-[#3C2610]">How We Share Information</h2>
                <p class="mt-2 text-gray-600">We may share information with:</p>
              </div>
              <ul class="list-disc space-y-2 pl-6 text-gray-700">
                <li>Authorized users within your organization</li>
                <li>External partners added to tickets or reviews</li>
                <li>Service providers (hosting, data processing, AI processing)</li>
                <li>Legal authorities if required by law</li>
              </ul>
              <p class="text-gray-600">We do not sell personal data.</p>
            </section>

            <section id="data-retention" class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold text-[#3C2610]">Data Storage &amp; Retention</h2>
                <p class="mt-2 text-gray-600">We store all information securely and retain:</p>
              </div>
              <ul class="list-disc space-y-2 pl-6 text-gray-700">
                <li>
                  Projects, activity logs, and documents as long as your account remains active
                </li>
                <li>Deleted account data for a limited period for compliance purposes</li>
                <li>Scan history for audit-tracking unless requested to be removed</li>
              </ul>
            </section>

            <section id="security" class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold text-[#3C2610]">Security Measures</h2>
                <p class="mt-2 text-gray-600">We use enterprise-grade security:</p>
              </div>
              <ul class="list-disc space-y-2 pl-6 text-gray-700">
                <li>Encryption at rest and in transit</li>
                <li>Access control &amp; RBAC</li>
                <li>Audit logs</li>
                <li>Two-factor authentication</li>
                <li>Network-level security</li>
                <li>Regular penetration testing</li>
              </ul>
            </section>

            <section id="rights" class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold text-[#3C2610]">Your Rights</h2>
                <p class="mt-2 text-gray-600">
                  Depending on your jurisdiction, you may request to:
                </p>
              </div>
              <ul class="list-disc space-y-2 pl-6 text-gray-700">
                <li>Access your data</li>
                <li>Update or correct information</li>
                <li>Delete your data</li>
                <li>Export your data</li>
                <li>Limit or object to certain processing</li>
              </ul>
            </section>

            <section id="ai-transparency" class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold text-[#3C2610]">AI Transparency</h2>
                <p class="mt-2 text-gray-600">LegalWatchDog uses AI to:</p>
              </div>
              <ul class="list-disc space-y-2 pl-6 text-gray-700">
                <li>Parse regulatory websites</li>
                <li>Compare changes between versions</li>
                <li>Generate summaries</li>
              </ul>
              <p class="text-gray-600">
                All outputs are provided to assist your team but should not replace legal review. We
                do not use your private data to train public AI models.
              </p>
            </section>

            <section id="international-transfers" class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold text-[#3C2610]">International Data Transfers</h2>
                <p class="mt-2 text-gray-600">
                  Data may be processed in other countries using secure frameworks like SCCs.
                </p>
              </div>
            </section>

            <section id="children" class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold text-[#3C2610]">Children's Privacy</h2>
                <p class="mt-2 text-gray-600">
                  Our services are not intended for children under 16.
                </p>
              </div>
            </section>

            <section id="updates" class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold text-[#3C2610]">Updates to this Policy</h2>
                <p class="mt-2 text-gray-600">
                  We may update this policy and notify organizations of major changes.
                </p>
              </div>
            </section>

            <section id="contact" class="space-y-4">
              <div>
                <h2 class="text-2xl font-bold text-[#3C2610]">Contact Information</h2>
                <p class="mt-2 text-gray-600">For privacy concerns, contact:</p>
                <p class="text-gray-700">
                  Email:
                  <a
                    class="text-[#c36932] underline decoration-2 underline-offset-2 hover:text-[#a65424]"
                    href="mailto:privacy@legalwatchdog.com"
                  >
                    privacy@legalwatchdog.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.policy-content section {
  scroll-margin-top: 140px;
}

@media (min-width: 1024px) {
  .policy-content section {
    scroll-margin-top: 180px;
  }
}
</style>
