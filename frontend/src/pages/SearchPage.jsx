import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { getPublicMemorials } from "../api/memorials";
import MemorialCard from "../components/MemorialCard";
import "./SearchPage.css";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [memorials, setMemorials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!query) {
      setMemorials([]);
      setHasMore(false);
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(true);
      setError(null);

      getPublicMemorials(page, 6, query)
        .then((data) => {
          const items = data?.items || [];
          setMemorials((prev) =>
            page === 1 ? items : [...prev, ...items]
          );
          setHasMore(page < (data?.totalPages || 1));
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, page]);

  return (
    <div className="search-container">
      {/* ===== SEO ===== */}
      <Helmet>
        <title>Cerca un memoriale per animali – Virtual Pet Memorial</title>
        <meta
          name="description"
          content="Cerca memoriali pubblici dedicati ad animali domestici per nome o specie. Trova e visita un ricordo che resta nel tempo."
        />
      </Helmet>

      <h1>🔍 Cerca un memoriale</h1>

      <input
        type="text"
        className="search-input"
        placeholder="Cerca per nome o specie…"
        aria-label="Cerca memoriali per nome o specie"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value.trimStart());
          setPage(1);
        }}
      />

      {/* STATO INIZIALE */}
      {!query && (
        <div className="search-hint">
          <p>
            Inizia a digitare il nome di un animale o una specie
            per cercare tra i memoriali pubblici.
          </p>
        </div>
      )}

      {/* LOADING INIZIALE */}
      {loading && page === 1 && (
        <p className="search-loading">
          Ricerca in corso…
        </p>
      )}

      {/* ERRORE */}
      {error && (
        <p className="search-error">{error}</p>
      )}

      {/* EMPTY STATE */}
      {!loading && query && memorials.length === 0 && (
        <div className="search-empty">
          <h2>😔 Nessun memoriale trovato</h2>

          <p>
            Non abbiamo trovato memoriali pubblici che corrispondono a
            <strong> “{query}”</strong>.
          </p>

          <p>
            Prova con un nome più generico oppure cerca per specie
            (es. <em>cane</em>, <em>gatto</em>).
          </p>
        </div>
      )}

      {/* RISULTATI */}
      <div className="memorial-grid">
        {memorials.map((m) => (
          <MemorialCard key={m.id} memorial={m} />
        ))}
      </div>

      {/* LOAD MORE */}
      {hasMore && !loading && memorials.length > 0 && (
        <div className="search-load-more">
          <button
            className="ui-button"
            onClick={() => setPage((p) => p + 1)}
          >
            Carica altri
          </button>
        </div>
      )}

      {/* LOADING PAGINAZIONE */}
      {loading && page > 1 && (
        <p className="search-loading-more">
          Caricamento…
        </p>
      )}
    </div>
  );
}
