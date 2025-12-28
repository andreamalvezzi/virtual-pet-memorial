import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMemorialBySlug } from "../api/memorials.js";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MemorialPage() {
  const { slug } = useParams();
  const [memorial, setMemorial] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();


  useEffect(() => {
    getMemorialBySlug(slug)
      .then(setMemorial)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p>Caricamento memoriale…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!memorial) return null;

  return (
  <>
    {/* LINK DI RITORNO — SOLO SE LOGGATO */}
    {user && (
      <div style={{ maxWidth: 600, margin: "1rem auto" }}>
        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: "#666",
            fontSize: "0.9rem",
          }}
        >
          ← Torna alla dashboard
        </Link>
      </div>
    )}

    {/* CARD MEMORIALE */}
    <div
      style={{
        maxWidth: 600,
        margin: "3rem auto",
        padding: "2rem",
        textAlign: "center",
        border: "1px solid #ddd",
        borderRadius: "12px",
        background: "#fafafa",
        color: "#222",
      }}
    >
      <h1 style={{ fontSize: "2.2rem", marginBottom: "0.5rem" }}>
        🪦 {memorial.petName}
      </h1>

      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        {memorial.species}
      </p>

      <blockquote
        style={{
          fontStyle: "italic",
          fontSize: "1.2rem",
          margin: "2rem 0",
          color: "#444",
        }}
      >
        “{memorial.epitaph}”
      </blockquote>

      <p style={{ color: "#777", marginTop: "2rem" }}>
        🌈 {new Date(memorial.deathDate).toLocaleDateString()}
      </p>

      <hr style={{ margin: "2rem 0" }} />

      <p style={{ fontSize: "0.85rem", color: "#aaa" }}>
        Creato con amore ❤️
      </p>
    </div>
  </>
)};
