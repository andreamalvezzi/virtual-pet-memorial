import axios from "axios";

const api = axios.create({
  baseURL: "https://virtual-pet-memorial-backend.onrender.com",
});

// LOGIN
export async function login(email, password) {
  const response = await api.post("/api/auth/login", { email, password });
  return response.data;
}

// REGISTER
export async function register(email, password) {
  const response = await api.post("/api/auth/register", { email, password });
  return response.data;
}
