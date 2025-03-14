<template>
  <div class="max-w-md mx-auto mt-10">
    <h2 class="text-2xl font-bold mb-4">Login</h2>
    <form @submit.prevent="handleLogin">
      <input
        v-model="email"
        placeholder="Email"
        class="border p-2 w-full mb-2"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="border p-2 w-full mb-2"
      />
      <button type="submit" class="bg-blue-500 text-white p-2 w-full">
        Login
      </button>
    </form>
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "vue-router";

const { login } = useAuth();
const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const handleLogin = async () => {
  try {
    await login(email.value, password.value);
    router.push("/"); // Redirect to home
  } catch (err) {
    error.value = "Invalid credentials";
  }
};
</script>
