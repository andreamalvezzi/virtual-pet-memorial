import axios from "axios";

const api = axios.create({
  //baseURL: "https://virtual-pet-memorial-backend.onrender.com",
  baseURL: "http://localhost:3001",

});

function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getMe() {
  const res = await api.get("/api/users/me", { headers: authHeader() });
  return res.data;
}

export async function deleteMe() {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/users/me`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Errore durante l’eliminazione dell’account");
  }
}

