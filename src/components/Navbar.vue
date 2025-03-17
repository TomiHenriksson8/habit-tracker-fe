<template>
  <nav class="bg-gradient-to-r from-blue-500 to-indigo-700 p-4 shadow-lg">
    <div class="container mx-auto flex justify-between items-center">
      <!-- ✅ Logo / Title -->
      <RouterLink
        to="/"
        class="text-3xl font-bold tracking-wide flex items-center hover:opacity-80 transition text-slate-800"
      >
        <span class="text-4xl text-slate-900">HT</span>racker
      </RouterLink>

      <!-- ✅ Navigation Links -->
      <ul class="flex space-x-6 items-center">
        <template v-if="!user">
          <li>
            <RouterLink
              to="/login"
              class="text-white font-semibold px-4 py-2 rounded-md hover:bg-white/20 hover:text-gray-200 transition"
            >
              🔑 Login
            </RouterLink>
          </li>
          <li>
            <RouterLink
              to="/register"
              class="text-white font-semibold px-4 py-2 rounded-md hover:bg-white/20 hover:text-gray-200 transition"
            >
              📝 Register
            </RouterLink>
          </li>
        </template>

        <template v-else>
          <!-- 🏠 Home Button -->
          <li>
            <RouterLink
              to="/"
              class="text-white font-semibold px-4 py-2 rounded-md hover:bg-white/20 hover:text-gray-200 transition"
            >
              Home
            </RouterLink>
          </li>

          <!-- ⚙️ Profile / Settings Dropdown -->
          <li class="relative">
            <button
              class="relative w-10 h-10 cursor-pointer bg-white rounded-full flex items-center justify-center text-lg font-bold text-indigo-600 shadow-md hover:scale-105 transition"
              @click="toggleDropdown"
            >
              {{ getInitials(user.username) }}
            </button>

            <div
              v-if="dropdownOpen"
              class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-md py-2 z-50"
            >
              <RouterLink
                to="/profile"
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                ⚙️ Profile Settings
              </RouterLink>
              <button
                @click="handleLogout"
                class="block w-full cursor-pointer text-left px-4 py-2 text-red-600 hover:bg-red-100"
              >
                🚪 Logout
              </button>
            </div>
          </li>

          <!-- 🌙 Dark Mode Toggle -->
          <li>
            <button
              @click="toggleDarkMode"
              class="text-white text-xl p-2 cursor-pointer hover:bg-white/20 rounded-lg transition"
            >
              {{ darkMode ? "🌞" : "🌙" }}
            </button>
          </li>
        </template>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"; // ✅ Import Router
import { useAuth } from "../hooks/useAuth";

const { user, logout } = useAuth();
const router = useRouter();
const dropdownOpen = ref(false);
const darkMode = ref(false);

// ✅ Handle Logout with Correct Redirection
const handleLogout = async () => {
  await logout();
  router.push("/"); // ✅ Redirect to home page
};

// ✅ Function to generate initials from the username
const getInitials = (name) => {
  return name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"; // Default to "U" if no name is provided
};

// ✅ Toggle dropdown for profile settings
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// ✅ Toggle Dark Mode
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  document.documentElement.classList.toggle("dark", darkMode.value);
};

// ✅ Load Dark Mode Preference
if (localStorage.getItem("darkMode") === "true") {
  darkMode.value = true;
  document.documentElement.classList.add("dark");
}
</script>
