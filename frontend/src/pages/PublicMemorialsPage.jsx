import { useEffect, useState } from "react";
import { getPublicMemorials } from "../api/memorials";
import MemorialCard from "../components/MemorialCard";

export default function PublicMemorialsPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  async function load() {
    setLoading(true);

    try {
      const data = await getPublicMemorials(page, 12);

      // ✅ compatibilità backend vecchio / nuovo
      if (Array.isArray(data)) {
        setItems(data);
        setTotalPages(1);
      } else if (data && Array.isArray(data.items)) {
        setItems(data.items);
        setTotalPages(data.totalPages || 1);
      } else {
        setItems([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error(err);
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
    return <p style={{ textAlign: "center" }}>Caricamento…</p>;
  }

  if (error) {
    return (
      <p style={{ color: "red", textAlign: "center" }}>
        {error}
      </p>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ textAlign: "center", marginBottom: 32 }}>
        Tutti i memoriali pubblici
      </h1>

      {items.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>
          Nessun memoriale disponibile.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {items.map((m) => (
            <MemorialCard key={m.id} memorial={m} />
          ))}
        </div>
      )}

      {/* PAGINAZIONE */}
      <div
        style={{
          marginTop: 32,
          display: "flex",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ← Indietro
        </button>

        <span>
          Pagina {page} di {totalPages}
        </span>

        <button
          onClick={() =>
            setPage((p) => Math.min(totalPages, p + 1))
          }
          disabled={page === totalPages}
        >
          Avanti →
        </button>
      </div>
    </div>
  );
}
