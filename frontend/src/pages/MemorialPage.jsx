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
    return <p className="memorial-error">{error}</p>;
  }

  if (!memorial) {
    return (
      <p className="memorial-missing">
        Questo memoriale non esiste 🌫️
      </p>
    );
  }

  /* =========================
     SEO (B1)
     ========================= */
  const title = `${memorial.petName} – Memoriale per Animali | Virtual Pet Memorial`;

  const description = memorial.epitaph
    ? memorial.epitaph.length > 155
      ? memorial.epitaph.slice(0, 152) + "…"
      : memorial.epitaph
    : `Memoriale dedicato a ${memorial.petName}, un ricordo che resta nel tempo.`;

  const formattedDate = new Date(
    memorial.deathDate
  ).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const ogTitle = `${memorial.petName} – Virtual Pet Memorial`;

  const ogDescription = description;

  const ogImage = memorial.imageUrl
    ? memorial.imageUrl.replace(
        "/upload/",
        "/upload/w_1200,h_630,c_fill,f_auto,q_auto/"
      )
    : "/og-default.jpg";

  const SITE_URL = import.meta.env.VITE_SITE_URL || "https://virtual-pet-memorial-frontend.onrender.com";

  const ogUrl = `${SITE_URL}/#/memorials/${slug}`;

  /* =========================
     RENDER
     ========================= */
  return (
    <>
      <Helmet>
      {/* SEO */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* OpenGraph */}
      <meta property="og:type" content="article" key="og:type" />
      <meta property="og:title" content={ogTitle} key="og:title" />
      <meta property="og:description" content={ogDescription} key="og:description" />
      <meta property="og:image" content={ogImage}  key="og:image" />
      <meta property="og:url" content={ogUrl} key="og:url" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />
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
