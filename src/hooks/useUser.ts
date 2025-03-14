import { ref } from "vue";
import apiClient from "./useApi";

interface User {
  username: string;
  email: string;
}

const user = ref<User | null>(null); // Global user state

export function useUser() {
  const fetchUser = async () => {
    try {
      const response = await apiClient.get("/auth/me");
      user.value = response.data;
    } catch (error) {
      console.error("Failed to fetch user", error);
      user.value = null; // Clear user on error
    }
  };

  const clearUser = () => {
    user.value = null;
  };

  return { user, fetchUser, clearUser };
}
