<template>
  <div class="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
    <h1 class="text-3xl font-bold text-center mb-6">Profile</h1>

    <div class="flex flex-col items-center">
      <!-- Profile Picture -->
      <div class="relative">
        <img
          :src="user?.profilePicture || defaultProfilePic"
          alt="Profile Picture"
          class="w-32 h-32 rounded-full border-4 border-gray-300 shadow-md"
        />
        <label
          class="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600"
        >
          📷
          <input type="file" @change="handleFileUpload" class="hidden" />
        </label>
      </div>

      <!-- Username -->
      <div class="mt-6 w-full">
        <label class="block text-gray-600 font-semibold">Username</label>
        <input
          type="text"
          v-model="updatedUsername"
          class="w-full p-2 border rounded-md mt-1"
        />
      </div>

      <!-- Email -->
      <div class="mt-4 w-full">
        <label class="block text-gray-600 font-semibold">Email</label>
        <input
          type="email"
          v-model="updatedEmail"
          class="w-full p-2 border rounded-md mt-1"
        />
      </div>

      <!-- Buttons -->
      <div class="mt-6 flex space-x-4">
        <button
          @click="updateProfile"
          class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Save Changes
        </button>
        <button
          @click="logout"
          class="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUser } from "../hooks/useUser"; // ✅ Import user context
import apiClient from "../hooks/useApi";

const { user, fetchUser, logoutUser } = useUser();
const updatedUsername = ref(user.value?.username || "");
const updatedEmail = ref(user.value?.email || "");
const defaultProfilePic = "https://via.placeholder.com/150"; // Placeholder image

// ✅ Handle Profile Update
const updateProfile = async () => {
  try {
    await apiClient.put(`/users/${user.value.id}`, {
      username: updatedUsername.value,
      email: updatedEmail.value,
    });
    alert("Profile updated successfully!");
    fetchUser(); // Refresh user info
  } catch (err) {
    console.error("Update failed:", err);
  }
};

// ✅ Handle Profile Picture Upload
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("profilePicture", file);

  try {
    await apiClient.put(`/users/${user.value.id}/upload-profile`, formData);
    alert("Profile picture updated!");
    fetchUser();
  } catch (err) {
    console.error("Failed to upload image:", err);
  }
};

// ✅ Logout User
const logout = () => {
  logoutUser();
};
</script>
