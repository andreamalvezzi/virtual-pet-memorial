import { useState, useEffect } from "react";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // ✅ LOGIN → otteniamo SOLO il token
      const data = await loginApi(email, password);

      // ✅ salviamo SOLO il token
      login(data.token);
      } catch (err) {
        if (err.response?.status === 403) {
          setError("Devi verificare l’email prima di accedere");
        } else {
          setError("Credenziali non valide");
        }
      } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true});
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-container">
      <h1>Bentornato 🐾</h1>

      <p className="auth-subtitle">
        Accedi per gestire i memoriali dei tuoi pet
      </p>

      {error && <p className="auth-error">{error}</p>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Accesso in corso…" : "Accedi"}
        </button>
      </form>

      <p className="auth-footer">
        Non hai un account?{" "}
        <Link to="/register">Registrati</Link>
      </p>
    </div>
  );
}
