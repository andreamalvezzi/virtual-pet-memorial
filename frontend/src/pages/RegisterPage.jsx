import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(email, password);
      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Errore di registrazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", padding: "0 16px" }}>
      <h1 style={{ textAlign: "center", marginBottom: 8 }}>
        Crea il tuo spazio 🐾
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#aaa",
          marginBottom: 24,
        }}
      >
        Registrati per creare e condividere memoriali
      </p>

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>
          {error}
        </p>
      )}

      {success && (
        <p style={{ color: "green", textAlign: "center" }}>
          Registrazione completata! Reindirizzamento al login…
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
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
          placeholder="Password (min 6 caratteri)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          disabled={loading}
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
          {loading ? "Creazione account…" : "Registrati"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 20 }}>
        Hai già un account?{" "}
        <Link to="/login">Accedi</Link>
      </p>
    </div>
  );
}
