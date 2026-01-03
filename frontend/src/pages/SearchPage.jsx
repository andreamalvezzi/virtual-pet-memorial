import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicMemorials } from "../api/memorials";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [memorials, setMemorials] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPublicMemorials(1, 50) // 👈 temporaneamente più risultati
      .then((data) => {
        setMemorials(data);
        setFiltered(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = query.toLowerCase().trim();

    if (!q) {
      setFiltered(memorials);
      return;
    }

    setFiltered(
      memorials.filter((m) =>
        m.petName.toLowerCase().includes(q) ||
        m.species?.toLowerCase().includes(q)
      )
    );
  }, [query, memorials]);

  if (loading) return <p>Caricamento memoriali…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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

      {filtered.length === 0 && (
        <p>Nessun memoriale trovato</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "16px",
        }}
      >
        {filtered.map((m) => (
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
                transition: "transform 0.2s",
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
