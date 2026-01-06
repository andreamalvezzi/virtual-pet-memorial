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

  const SITE_URL =
    import.meta.env.VITE_SITE_URL ||
    "https://virtual-pet-memorial-frontend.onrender.com";

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
     SEO DATA
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
    : `${SITE_URL}/og-default.jpg`;

  const canonicalUrl = `${SITE_URL}/#/memorials/${slug}`;

  /* =========================
     RENDER
     ========================= */
  return (
    <>
      {/* ================= SEO / META ================= */}
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* Canonical */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* ===== STRUCTURED DATA: ARTICLE ===== */}
        {memorial && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": canonicalUrl
              },
              "headline": `${memorial.petName} – Memoriale`,
              "description": description,
              ...(memorial.imageUrl && {
                image: ogImage
              }),
              "author": {
                "@type": "Organization",
                "name": "Virtual Pet Memorial"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Virtual Pet Memorial"
              },
              "datePublished": memorial.deathDate,
              "dateModified": memorial.updatedAt || memorial.deathDate,
              "isAccessibleForFree": true
            })}
          </script>
        )}
      </Helmet>

      {/* ================= LOADING ================= */}
      {loading && <MemorialSkeleton />}

      {/* ================= ERROR ================= */}
      {!loading && error && (
      <div className="memorial-empty" role="alert">
        <h2>⚠️ Errore di caricamento</h2>
        <p>
          Non siamo riusciti a caricare questo memoriale.
          Controlla la connessione o riprova più tardi.
      </p>
      <button
        className="empty-action"
        onClick={() => navigate("/home")}
      >
        Torna alla home
      </button>
    </div>
  )}

  {/* ================= NOT FOUND / PRIVATE ================= */}
  {!loading && !error && !memorial && (
    <div className="memorial-empty">
      <h2>😔 Memoriale non trovato</h2>
      <p>
        Questo memoriale non esiste oppure non è pubblico.
      </p>
      <button
        className="empty-action"
        onClick={() => navigate("/home")}
      >
        Torna alla home
      </button>
    </div>
  )}

      {/* ================= CONTENT ================= */}
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
                {new Date(memorial.deathDate).toLocaleDateString("it-IT", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
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
            <section
                className="memorial-cta"
                aria-label="Azioni disponibili"
              >
              <p className="memorial-cta-text">
                Vuoi creare un memoriale per ricordare il tuo animale?
              </p>

                <div className="memorial-cta-actions">
                <Link
                  to="/dashboard/memorials/new"
                  className="cta-primary"
                >
                  Crea un memoriale
                </Link>

                <Link
                  to="/memorials"
                  className="cta-secondary"
                >
                  Esplora altri memoriali
                </Link>
              </div>
            </section>
          </article>
        </>
      )}
    </>
  );
}
