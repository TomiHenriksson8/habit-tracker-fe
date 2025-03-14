import apiClient from "../hooks/useApi";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export async function registerUser(payload: RegisterPayload) {
  const response = await apiClient.post("/auth/register", payload);
  return response.data;
}

export async function loginUser(payload: LoginPayload) {
  const response = await apiClient.post("/auth/login", payload);
  return response.data.token; // Extract JWT token
}
