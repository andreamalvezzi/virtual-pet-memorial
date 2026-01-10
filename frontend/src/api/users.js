import axios from "axios";

const api = axios.create({
  baseURL: "https://virtual-pet-memorial-backend.onrender.com",
});

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getMe() {
  const res = await api.get("/api/users/me", { headers: authHeader() });
  return res.data;
}
