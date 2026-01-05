import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getPublicMemorials } from "../api/memorials";
import MemorialCard from "../components/MemorialCard";
import "./PublicMemorialsPage.css";

export default function PublicMemorialsPage() {
  const SITE_URL =
    import.meta.env.VITE_SITE_URL ||
    "https://virtual-pet-memorial-frontend.onrender.com";

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =========================
     FETCH MEMORIALS
     ========================= */
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await getPublicMemorials(page, 6);

        if (Array.isArray(data)) {
          setItems(data);
          setTotalPages(1);
          setTotalItems(data.length);
        } else if (data?.items) {
          setItems(data.items);
          setTotalPages(data.totalPages || 1);
          setTotalItems(data.totalItems || 0);
        } else {
          setItems([]);
          setTotalPages(1);
          setTotalItems(0);
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch {
        setError("Errore nel caricamento dei memoriali");
        setItems([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [page]);

  /* =========================
     LOADING / ERROR
     ========================= */
  if (loading) {
    return (
      <p className="public-loading">
        Caricamento memoriali 🐾
      </p>
    );
  }

  if (error) {
    return <p className="public-error">{error}</p>;
  }

  /* =========================
     RENDER
     ========================= */
  return (
    <div className="public-container">
      {/* ================= SEO ================= */}
      <Helmet>
        <title>
          Memoriali pubblici per animali – Virtual Pet Memorial
        </title>

        <meta
          name="description"
          content="Scopri i memoriali pubblici dedicati ad animali domestici. Un luogo online per ricordare cani, gatti e altri pet con rispetto."
        />

        {/* Canonical fisso (pagina principale) */}
        <link
          rel="canonical"
          href={`${SITE_URL}/#/memorials`}
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Memoriali pubblici per animali – Virtual Pet Memorial"
        />
        <meta
          property="og:description"
          content="Scopri i memoriali pubblici dedicati ad animali domestici e condividi un ricordo che resta nel tempo."
        />
        <meta
          property="og:url"
          content={`${SITE_URL}/#/memorials`}
        />
      </Helmet>

      {/* ================= HEADER ================= */}
      <h1>Tutti i memoriali pubblici</h1>

      {/* SEARCH CTA */}
      <Link to="/search" className="public-search-link">
        🔍 Cerca un memoriale
      </Link>

      <p className="public-count">
        {totalItems} memoriali pubblici
      </p>

      {/* ================= EMPTY STATE ================= */}
      {items.length === 0 && (
        <div className="public-empty">
          <h2>🐾 Nessun memoriale pubblico</h2>
          <p>
            Al momento non ci sono memoriali pubblici da
            visualizzare.
          </p>
          <p>
            Puoi provare a cercare un memoriale specifico.
          </p>
        </div>
      )}

      {/* ================= GRID ================= */}
      {items.length > 0 && (
        <div className="memorial-grid">
          {items.map((m) => (
            <MemorialCard key={m.id} memorial={m} />
          ))}
        </div>
      )}

      {/* ================= PAGINAZIONE ================= */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="ui-button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Indietro
          </button>

          <span>
            Pagina {page} di {totalPages}
          </span>

          <button
            className="ui-button"
            onClick={() =>
              setPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={page === totalPages}
          >
            Avanti →
          </button>
        </div>
      )}
    </div>
  );
}
