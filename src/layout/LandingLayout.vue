<template>
  <div class="">
    <MainHeader />

    <main>
      <router-view />
    </main>

    <MainFooter />
  </div>
</template>

<script lang="ts">
import MainHeader from '@/components/landing-page/MainHeader.vue'
import MainFooter from '@/components/landing-page/MainFooter.vue'

export default {
  components: { MainHeader, MainFooter },
}
</script>
