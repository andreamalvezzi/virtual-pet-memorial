import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicMemorials } from "../api/memorials";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [memorials, setMemorials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /* =========================
     FETCH MEMORIALS
     ========================= */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      setError(null);

      getPublicMemorials(page, 6, query)
        .then((data) => {
          setMemorials((prev) =>
            page === 1 ? data.items : [...prev, ...data.items]
          );
          setHasMore(page < data.totalPages);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, page]);

  /* =========================
     RENDER
     ========================= */
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px" }}>
      <h1>🔍 Cerca un memoriale</h1>

      <input
        type="text"
        placeholder="Cerca per nome o specie…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1); // reset pagination on new search
        }}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      />

      {loading && page === 1 && <p>Ricerca in corso…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && memorials.length === 0 && (
        <p>Nessun memoriale trovato</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "16px",
        }}
      >
        {memorials.map((m) => (
          <Link
            key={m.id}
            to={`/memorials/${m.slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #e6e6e6",
                borderRadius: "12px",
                padding: "16px",
              }}
            >
              {m.imageUrl && (
                <img
                  src={m.imageUrl}
                  alt={m.petName}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "12px",
                  }}
                />
              )}

              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#222",
                }}
              >
                {m.petName}
              </div>

              <div style={{ color: "#666", marginTop: "4px" }}>
                {m.species}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* LOAD MORE */}
      {hasMore && !loading && memorials.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <button
            onClick={() => setPage((p) => p + 1)}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Carica altri
          </button>
        </div>
      )}

      {loading && page > 1 && (
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Caricamento…
        </p>
      )}
    </div>
  );
}
