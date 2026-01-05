import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getMemorialBySlug } from "../api/memorials";
import { useAuth } from "../context/AuthContext";
import MemorialSkeleton from "../components/MemorialSkeleton.jsx";
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
     SEO
     ========================= */
  const title = memorial
    ? `${memorial.petName} – Memoriale per Animali | Virtual Pet Memorial`
    : "Memoriale – Virtual Pet Memorial";

  const description = memorial?.epitaph
    ? memorial.epitaph.length > 155
      ? memorial.epitaph.slice(0, 152) + "…"
      : memorial.epitaph
    : memorial
    ? `Memoriale dedicato a ${memorial.petName}, un ricordo che resta nel tempo.`
    : "Memoriale per animali domestici – Virtual Pet Memorial";

  const ogTitle = memorial
    ? `${memorial.petName} – Virtual Pet Memorial`
    : "Virtual Pet Memorial";

  const ogImage = memorial?.imageUrl
    ? memorial.imageUrl.replace(
        "/upload/",
        "/upload/w_1200,h_630,c_fill,f_auto,q_auto/"
      )
    : "/og-default.jpg";

  const SITE_URL =
    import.meta.env.VITE_SITE_URL ||
    "https://virtual-pet-memorial-frontend.onrender.com";

  const ogUrl = `${SITE_URL}/#/memorials/${slug}`;

  /* =========================
     RENDER
     ========================= */
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      {loading && <MemorialSkeleton />}

      {!loading && (error || !memorial) && (
        <div className="memorial-empty">
          <h2>😔 Memoriale non disponibile</h2>
          <p>
            Questo memoriale non esiste, è stato rimosso
            oppure non è pubblico.
          </p>
          <button
            className="empty-action"
            onClick={() => navigate("/home")}
          >
            Torna alla home
          </button>
        </div>
      )}

      {!loading && memorial && (
        <>
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

          <article
            className="memorial-container fade-in"
            aria-labelledby="memorial-title"
          >
            {memorial.imageUrl && (
              <div className="memorial-image-wrapper skeleton">
                <img
                  src={memorial.imageUrl.replace(
                    "/upload/",
                    "/upload/w_800,f_auto,q_auto/"
                  )}
                  srcSet={`
                    ${memorial.imageUrl.replace("/upload/", "/upload/w_400,f_auto,q_auto/")} 400w,
                    ${memorial.imageUrl.replace("/upload/", "/upload/w_800,f_auto,q_auto/")} 800w,
                    ${memorial.imageUrl.replace("/upload/", "/upload/w_1200,f_auto,q_auto/")} 1200w
                  `}
                  sizes="(max-width: 768px) 100vw, 720px"
                  alt={`Foto commemorativa di ${memorial.petName}`}
                  loading="eager"
                  fetchpriority="high"
                  className="memorial-image"
                  onLoad={(e) =>
                    e.currentTarget.classList.add("loaded")
                  }
                />
              </div>
            )}

            <h1 id="memorial-title" className="memorial-title">
              🪦 {memorial.petName}
            </h1>

            <p className="memorial-meta">
              In memoria di un{" "}
              {memorial.species?.toLowerCase() || "pet"} ·{" "}
              <time dateTime={memorial.deathDate}>
                {new Date(memorial.deathDate).toLocaleDateString(
                  "it-IT",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </time>
            </p>

            <blockquote
              className="memorial-epitaph"
              aria-label="Epitaffio commemorativo"
            >
              “{memorial.epitaph}”
            </blockquote>

            <footer className="memorial-footer">
              Un ricordo che resta
            </footer>
          </article>
        </>
      )}
    </>
  );
}
