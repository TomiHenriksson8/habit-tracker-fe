<template>
  <div class="max-w-md mx-auto mt-10">
    <h2 class="text-2xl font-bold mb-4">Register</h2>
    <form @submit.prevent="handleRegister">
      <input
        v-model="username"
        placeholder="Username"
        class="border p-2 w-full mb-2"
      />
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
      <button type="submit" class="bg-green-500 text-white p-2 w-full">
        Register
      </button>
    </form>
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "../hooks/useAuth.ts";
import { useRouter } from "vue-router";

const { register } = useAuth();
const username = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const handleRegister = async () => {
  try {
    await register(username.value, email.value, password.value);
    router.push("/login"); // Redirect to login after successful registration
  } catch (err) {
    error.value = "Failed to register";
  }
};
</script>
