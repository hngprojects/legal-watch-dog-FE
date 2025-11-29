<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthShell from '@/components/authentication/AuthLayout.vue'
import MainHeader from '@/components/landing-page/MainHeader.vue'

const route = useRoute()

const layoutProps = computed(
  () => (route.meta?.authLayoutProps as Record<string, string | undefined>) ?? {},
)
</script>

<template>
  <div class="container--wide">
    <MainHeader />
    <AuthShell v-bind="layoutProps">
      <router-view />
    </AuthShell>
  </div>
</template>
