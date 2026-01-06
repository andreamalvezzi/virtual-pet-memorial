import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getMemorialBySlug } from "../api/memorials";
import { useAuth } from "../context/AuthContext";
import MemorialSkeleton from "../components/MemorialSkeleton.jsx";
import "./MemorialPage.css";

/* ======================================================
   MEMORIAL PAGE — G4
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
     FETCH
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
    ? `${memorial.petName} – Virtual Pet Memorial`
    : "Memoriale – Virtual Pet Memorial";

  const description = memorial?.epitaph
    ? memorial.epitaph.slice(0, 155)
    : "Memoriale per animali domestici";

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
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>

      {loading && <MemorialSkeleton />}

      {!loading && error && (
        <div className="memorial-empty">
          <h2>Errore</h2>
          <p>Impossibile caricare il memoriale.</p>
          <button onClick={() => navigate("/home")}>
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
            {user && <Link to="/dashboard">Dashboard</Link>}
          </nav>

          <article
            className={`memorial-container grave-${memorial.graveStyle}`}
          >
            {/* IMMAGINE PRINCIPALE */}
            {memorial.imageUrl && (
              <img
                src={memorial.imageUrl.replace(
                  "/upload/",
                  "/upload/w_800,f_auto,q_auto/"
                )}
                alt={`Foto di ${memorial.petName}`}
                className="memorial-image"
              />
            )}

            <h1 className="memorial-title">
              🪦 {memorial.petName}
            </h1>

            <p className="memorial-meta">
              {memorial.species} ·{" "}
              {new Date(memorial.deathDate).toLocaleDateString(
                "it-IT"
              )}
            </p>

            <blockquote className="memorial-epitaph">
              “{memorial.epitaph}”
            </blockquote>

            {/* ===== GALLERIA IMMAGINI ===== */}
            {Array.isArray(memorial.galleryImages) &&
              memorial.galleryImages.length > 0 && (
                <section className="memorial-gallery">
                  <h2>Ricordi fotografici</h2>
                  <div className="gallery-grid">
                    {memorial.galleryImages.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Galleria ${i + 1}`}
                        loading="lazy"
                      />
                    ))}
                  </div>
                </section>
              )}

            {/* ===== VIDEO ===== */}
            {Array.isArray(memorial.videoUrls) &&
              memorial.videoUrls.length > 0 && (
                <section className="memorial-videos">
                  <h2>Video ricordo</h2>
                  <div className="video-grid">
                    {memorial.videoUrls.map((url, i) => (
                      <iframe
                        key={i}
                        src={url}
                        title={`Video ${i + 1}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ))}
                  </div>
                </section>
              )}

            <footer className="memorial-footer">
              Un ricordo che resta
            </footer>
          </article>
        </>
      )}
    </>
  );
}
