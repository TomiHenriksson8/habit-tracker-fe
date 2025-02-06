<template>
  <div id="app" class="p-4">
    <nav class="mb-4">
      <!-- Navigation links for routes -->
      <router-link to="/" class="mr-4 text-blue-500 hover:underline"
        >Home</router-link
      >
      <router-link to="/habits" class="text-blue-500 hover:underline"
        >Habits</router-link
      >
    </nav>

    <!-- Router outlet to display the current route's component -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
// No additional script is needed for basic routing
</script>
