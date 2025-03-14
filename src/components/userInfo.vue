<template>
  <div v-if="user" class="text-gray-700 font-medium">
    Welcome, {{ user.username }}!
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "../hooks/useAuth";

const { user } = useAuth();
</script>
