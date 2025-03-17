<template>
  <div
    class="min-h-screen flex flex-col bg-gradient-to-br from-white to-indigo-100"
  >
    <NavBar />
    <div class="flex-1">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import NavBar from "@/components/NavBar.vue";
</script>
