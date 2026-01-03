import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMemorialBySlug } from "../api/memorials.js";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MemorialPage() {
  const { slug } = useParams();
  const { user } = useAuth();

  const [memorial, setMemorial] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getMemorialBySlug(slug)
      .then(setMemorial)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  function MemorialSkeleton() {
    return (
      <div style={{ maxWidth: 720, margin: "3rem auto", padding: "2.5rem" }}>
        {/* skeleton */}
      </div>
    );
  }

  if (loading) return <MemorialSkeleton />;

  if (error) {
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>
        {error}
      </p>
    );
  }

  if (!memorial) {
    return (
      <p style={{ textAlign: "center", marginTop: "3rem", color: "#777" }}>
        Questo memoriale non esiste 🌫️
      </p>
    );
  }

  const fadeStyle = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  const formattedDate = new Date(memorial.deathDate).toLocaleDateString(
    "it-IT",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <>
      <style>{fadeStyle}</style>

      {/* TORNA INDIETRO */}
      <div style={{ maxWidth: 720, margin: "1rem auto" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            color: "#888",
            cursor: "pointer",
            fontSize: "0.9rem",
            padding: 0,
          }}
        >
          ← Torna indietro
        </button>
      </div>

      {/* DASHBOARD (SOLO LOGGATO) */}
      {user && (
        <div style={{ maxWidth: 720, margin: "1rem auto" }}>
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
          maxWidth: 720,
          margin: "clamp(1.5rem, 5vw, 3rem) auto",
          padding: "clamp(1.25rem, 4vw, 2.5rem)",
          textAlign: "center",
          border: "1px solid #ddd",
          borderRadius: "12px",
          background: "#fafafa",
          color: "#222",
          animation: "fadeIn 0.6s ease-out",
        }}
      >
        {memorial.imageUrl && (
          <img
            src={memorial.imageUrl.replace(
              "/upload/",
              "/upload/f_auto,q_auto/"
            )}
            alt={memorial.petName}
            loading="lazy"
            style={{
              width: "100%",
              maxHeight: "360px",
              objectFit: "cover",
              borderRadius: "14px",
              marginBottom: "2rem",
            }}
          />
        )}

        <h1
          style={{
            fontSize: "clamp(1.8rem, 5vw, 2.2rem)",
            marginBottom: "0.5rem",
          }}
        >
          🪦 {memorial.petName}
        </h1>

        <div style={{ height: "0.5rem" }} />

        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          In memoria di un {memorial.species.toLowerCase()} · {formattedDate}
        </p>

        <blockquote
          style={{
            fontStyle: "italic",
            fontSize: "clamp(1.05rem, 4vw, 1.2rem)",
            margin: "2.5rem 0",
            color: "#444",
            lineHeight: 1.6,
          }}
        >
          “{memorial.epitaph}”
        </blockquote>

        <hr style={{ margin: "2rem 0" }} />

        <p style={{ fontSize: "0.85rem", color: "#aaa" }}>
          Un ricordo che resta
        </p>
      </div>
    </>
  );
}
