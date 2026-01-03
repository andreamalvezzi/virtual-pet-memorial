import { useState, useEffect } from "react";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

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
    } catch (err) {
      setError("Credenziali non valide");
    } finally {
      setLoading(false);
    }
  };

  // 🔑 redirect quando lo stato auth è pronto
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard/memorials/new");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: "0 16px" }}>
      <h1 style={{ textAlign: "center", marginBottom: 8 }}>
        Bentornato 🐾
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#aaa",
          marginBottom: 24,
        }}
      >
        Accedi per gestire i memoriali dei tuoi pet
      </p>

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: 16,
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 8,
            border: "none",
            background: "#1a1a1a",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Accesso in corso…" : "Accedi"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 20 }}>
        Non hai un account?{" "}
        <Link to="/register">Registrati</Link>
      </p>
    </div>
  );
}
