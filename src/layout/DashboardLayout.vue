<script setup lang="ts">
import Navbar from '../components/dashboard/Navbar.vue';
import Sidebar from '../components/dashboard/Sidebar.vue';
</script>

<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <Sidebar />
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <Navbar />
      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>
