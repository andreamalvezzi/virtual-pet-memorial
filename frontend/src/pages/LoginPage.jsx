import { useState, useEffect } from "react";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ AGGIUNTO

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true); // ✅ inizio loading

    try {
      const data = await loginApi(email, password);
      login(data.token, data.user);
    } catch (err) {
      setError("Credenziali non valide");
    } finally {
      setLoading(false); // ✅ fine loading (success o errore)
    }
  };

  // 🔑 redirect quando lo stato auth è pronto
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard/memorials/new");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <h1>Login</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}   // ✅ blocca input
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}   // ✅ blocca input
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Accesso in corso…" : "Accedi"}
        </button>
      </form>
    </div>
  );
}
