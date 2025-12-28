import axios from "axios";

// LOGIN
export async function login(email, password) {
  const response = await axios.post("/api/auth/login", {
    email,
    password,
  });

  return response.data; // { token, user }
}

// REGISTER
export async function register(email, password) {
  const response = await axios.post("/api/auth/register", {
    email,
    password,
  });

  return response.data; // { id, email }
}
