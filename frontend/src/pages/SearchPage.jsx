import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicMemorials } from "../api/memorials";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [memorials, setMemorials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(true);
      setError(null);

      getPublicMemorials(1, 12, query) // 👈 search lato backend
        .then((data) => {
          setMemorials(data.items); // 👈 FIX FONDAMENTALE
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 400); // debounce UX

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px" }}>
      <h1>🔍 Cerca un memoriale</h1>

      <input
        type="text"
        placeholder="Cerca per nome o specie…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      />

      {loading && <p>Ricerca in corso…</p>}
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
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "14px",
              }}
            >
              <strong>{m.petName}</strong>
              <div>{m.species}</div>

              {m.imageUrl && (
                <img
                  src={m.imageUrl}
                  alt={m.petName}
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    borderRadius: "6px",
                  }}
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
