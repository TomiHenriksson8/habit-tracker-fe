import { ref, watch } from "vue";
import { loginUser, registerUser } from "../services/authService";
import { useUser } from "./useUser";

const token = ref<string | null>(localStorage.getItem("token"));
const { user, fetchUser, clearUser } = useUser();

export function useAuth() {
  const login = async (email: string, password: string) => {
    const jwt = await loginUser({ email, password });
    token.value = jwt;
    localStorage.setItem("token", jwt);
    await fetchUser(); // Fetch user after login
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    return await registerUser({ username, email, password });
  };

  const logout = () => {
    token.value = null;
    localStorage.removeItem("token");
    clearUser(); // Clear user state
  };

  // Watch for token changes and fetch user if a token exists
  if (token.value) {
    fetchUser();
  }

  return { token, login, register, logout, user };
}
