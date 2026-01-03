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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginApi(email, password);
      login(data.token, data.user);
    } catch {
      setError("Credenziali non valide");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard/memorials/new");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-container">
      <h1>Bentornato 🐾</h1>

      <p className="auth-subtitle">
        Accedi per gestire i memoriali dei tuoi pet
      </p>

      {error && (
        <p className="auth-error">{error}</p>
      )}

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
