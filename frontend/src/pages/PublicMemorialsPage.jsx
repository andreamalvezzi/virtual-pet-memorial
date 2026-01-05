import { useEffect, useState } from "react";
import { getPublicMemorials } from "../api/memorials";
import MemorialCard from "../components/MemorialCard";
import "./PublicMemorialsPage.css";

export default function PublicMemorialsPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
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

  if (loading) {
    return (
      <p className="public-loading">
        Caricamento memoriali 🐾
      </p>
    );
  }

  if (error) {
    return (
      <p className="public-error">{error}</p>
    );
  }

  return (
    <div className="public-container">
      <h1>Tutti i memoriali pubblici</h1>

      <p className="public-count">
        {totalItems} memoriali pubblici
      </p>

      {items.length === 0 ? (
      <div className="public-empty">
        <h2>🐾 Nessun memoriale pubblico</h2>

        <p>
          Al momento non ci sono memoriali pubblici da
          visualizzare.
        </p>

        <p>
          Puoi provare a cercare un memoriale specifico.
        </p>

        <a href="/#/search" className="public-search-link">
          🔍 Cerca un memoriale
        </a>
      </div>
    ) : (
      <div className="memorial-grid">
        {items.map((m) => (
          <MemorialCard key={m.id} memorial={m} />
        ))}
      </div>
    )}

      {/* PAGINAZIONE */}
      <div className="pagination">
        <button
          onClick={() =>
            setPage((p) => Math.max(1, p - 1))
          }
          disabled={page === 1 || loading}
        >
          ← Indietro
        </button>

        <span>
          Pagina {page} di {totalPages}
        </span>

        <button
          onClick={() =>
            setPage((p) =>
              Math.min(totalPages, p + 1)
            )
          }
          disabled={page === totalPages || loading}
        >
          Avanti →
        </button>
      </div>
    </div>
  );
}
