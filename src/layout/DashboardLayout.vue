<script setup lang="ts">
import Navbar from '../components/dashboard/Navbar.vue'
import Sidebar from '../components/dashboard/Sidebar.vue'
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">
    <Sidebar />
    <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
      <Navbar />
      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>
