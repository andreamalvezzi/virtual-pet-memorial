import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import "./LoginPage.css"; // 🔁 riusiamo lo stesso CSS

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
    <div className="auth-container">
      <h1>Crea il tuo spazio 🐾</h1>

      <p className="auth-subtitle">
        Registrati per creare e condividere memoriali
      </p>

      {error && (
        <p className="auth-error">{error}</p>
      )}

      {success && (
        <p className="auth-success">
          Registrazione completata! Reindirizzamento…
        </p>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password (min 6 caratteri)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creazione account…" : "Registrati"}
        </button>
      </form>

      <p className="auth-footer">
        Hai già un account?{" "}
        <Link to="/login">Accedi</Link>
      </p>
    </div>
  );
}
