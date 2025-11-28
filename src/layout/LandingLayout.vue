<template>
  <div>
    <MainHeader />

    <main>
      <router-view />
    </main>

    <MainFooter />
  </div>
</template>

<script>
import MainHeader from "@/components/landing-page/MainHeader.vue";
import MainFooter from "@/components/landing-page/MainFooter.vue";

export default {
  components: { MainHeader, MainFooter }
};
</script>
