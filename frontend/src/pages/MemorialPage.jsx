import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMemorialBySlug } from "../api/memorials";
import { useAuth } from "../context/AuthContext";
import "./MemorialPage.css";

export default function MemorialPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [memorial, setMemorial] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMemorialBySlug(slug)
      .then(setMemorial)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <MemorialSkeleton />;

  if (error) {
    return <p className="memorial-error">{error}</p>;
  }

  if (!memorial) {
    return (
      <p className="memorial-missing">
        Questo memoriale non esiste 🌫️
      </p>
    );
  }

  const formattedDate = new Date(memorial.deathDate).toLocaleDateString(
    "it-IT",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <>
      <nav className="memorial-nav">
        <button onClick={() => navigate(-1)}>← Torna indietro</button>

        {user && (
          <Link to="/dashboard">← Dashboard</Link>
        )}
      </nav>

      <article className="memorial-container">
        {memorial.imageUrl && (
          <img
            src={memorial.imageUrl.replace(
              "/upload/",
              "/upload/f_auto,q_auto/"
            )}
            alt={memorial.petName}
            loading="lazy"
            className="memorial-image"
          />
        )}

        <h1 className="memorial-title">
          🪦 {memorial.petName}
        </h1>

        <p className="memorial-meta">
          In memoria di un {memorial.species.toLowerCase()} · {formattedDate}
        </p>

        <blockquote className="memorial-epitaph">
          “{memorial.epitaph}”
        </blockquote>

        <footer className="memorial-footer">
          Un ricordo che resta
        </footer>
      </article>
    </>
  );
}

function MemorialSkeleton() {
  return (
    <div className="memorial-skeleton">
      <div className="skeleton-image" />
      <div className="skeleton-line title" />
      <div className="skeleton-line meta" />
      <div className="skeleton-line long" />
      <div className="skeleton-line long" />
    </div>
  );
}
