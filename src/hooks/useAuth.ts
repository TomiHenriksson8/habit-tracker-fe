import { ref } from "vue";
import { loginUser, registerUser } from "../services/authService";

const token = ref<string | null>(localStorage.getItem("token"));

export function useAuth() {
  const login = async (email: string, password: string) => {
    const jwt = await loginUser({ email, password });
    token.value = jwt;
    localStorage.setItem("token", jwt);
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
  };

  return { token, login, register, logout };
}
