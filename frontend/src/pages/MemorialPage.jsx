import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getMemorialBySlug } from "../api/memorials";
import { useAuth } from "../context/AuthContext";
import "./MemorialPage.css";

/* ======================================================
   MEMORIAL PAGE
   ====================================================== */

export default function MemorialPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [memorial, setMemorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =========================
     FETCH MEMORIAL
     ========================= */
  useEffect(() => {
    setLoading(true);
    setError(null);

    getMemorialBySlug(slug)
      .then(setMemorial)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  /* =========================
     LOADING / ERROR STATES
     ========================= */
  if (loading) return <MemorialSkeleton />;

  if (error) {
    return (
      <p className="memorial-error">
        {error}
      </p>
    );
  }

  if (!memorial) {
    return (
      <p className="memorial-missing">
        Questo memoriale non esiste 🌫️
      </p>
    );
  }

  /* =========================
     SEO / OPENGRAPH
     ========================= */
  const ogTitle = `🪦 ${memorial.petName} – Virtual Pet Memorial`;

  const ogDescription =
    memorial.epitaph?.length > 160
      ? memorial.epitaph.slice(0, 157) + "…"
      : memorial.epitaph;

  const ogImage = memorial.imageUrl
    ? memorial.imageUrl.replace(
        "/upload/",
        "/upload/w_1200,h_630,c_fill,f_auto,q_auto/"
      )
    : "/og-default.jpg";

  const formattedDate = new Date(
    memorial.deathDate
  ).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  /* =========================
     RENDER
     ========================= */
  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>{ogTitle}</title>

        <meta name="description" content={ogDescription} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />

        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* NAV */}
      <nav className="memorial-nav">
        <button onClick={() => navigate(-1)}>
          ← Torna indietro
        </button>

        {user && (
          <Link to="/dashboard">
            ← Dashboard
          </Link>
        )}
      </nav>

      {/* CONTENT */}
      <article
        className="memorial-container"
        role="article"
      >
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
          In memoria di un{" "}
          {memorial.species?.toLowerCase() || "pet"} ·{" "}
          {formattedDate}
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

/* ======================================================
   SKELETON
   ====================================================== */

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
