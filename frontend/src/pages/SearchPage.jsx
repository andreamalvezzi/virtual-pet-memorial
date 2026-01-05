import { useEffect, useState } from "react";
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
      <h1>🔍 Cerca un memoriale</h1>

      <input
        type="text"
        className="search-input"
        placeholder="Cerca per nome o specie…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1);
        }}
      />

      {loading && page === 1 && (
        <p className="search-loading">
          Ricerca in corso…
        </p>
      )}

      {error && (
        <p className="search-error">{error}</p>
      )}

      {!loading && memorials.length === 0 && query && (
      <div className="search-empty">
        <h2>🔍 Nessun risultato</h2>
        <p>
          Non abbiamo trovato memoriali che corrispondono a
          <strong> “{query}”</strong>.
        </p>
      <p>Prova a modificare la ricerca.</p>
      </div>
    )}


      <div className="memorial-grid">
        {memorials.map((m) => (
          <MemorialCard key={m.id} memorial={m} />
        ))}
      </div>

      {/* LOAD MORE */}
      {hasMore && !loading && memorials.length > 0 && (
        <div className="search-load-more">
          <button className="ui-button" onClick={() => setPage((p) => p + 1)}>
            Carica altri
          </button>
        </div>
      )}

      {loading && page > 1 && (
        <p className="search-loading-more">
          Caricamento…
        </p>
      )}
    </div>
  );
}
