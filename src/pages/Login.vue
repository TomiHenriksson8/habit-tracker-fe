<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-blue-200"
  >
    <div
      class="bg-gray-400/80 border border-gray-500/60 bg-opacity-10 backdrop-blur-lg p-8 rounded-2xl w-full max-w-md"
    >
      <h2 class="text-4xl font-extrabold text-center text-white mb-10">
        Login
      </h2>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Email Input -->
        <div class="relative">
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="w-full p-4 bg-white border border-white/30 rounded-lg text-gray-800 placeholder-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-300"
          />
        </div>

        <!-- Password Input -->
        <div class="relative">
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full p-4 bg-white border border-white/30 rounded-lg text-gray-800 placeholder-gray-800 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all duration-300"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 hover:scale-103 transition-transform duration-300"
        >
          <span class="text-xl">🚀</span> Login
        </button>
      </form>

      <!-- Error Message -->
      <p v-if="error" class="text-red-300 text-center mt-4">{{ error }}</p>

      <!-- Divider -->
      <div class="flex items-center justify-center mt-6">
        <span class="w-full border-t border-white/20"></span>
        <span class="text-white text-sm px-3">or</span>
        <span class="w-full border-t border-white/20"></span>
      </div>

      <!-- Register Link -->
      <p class="text-center text-white mt-5">
        Don't have an account?
        <RouterLink
          to="/register"
          class="text-blue-600 hover:underline font-bold"
          >Sign Up</RouterLink
        >
      </p>
    </div>
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
