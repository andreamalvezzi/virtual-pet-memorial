import { useEffect, useState } from "react";
import { getPublicMemorials } from "../api/memorials";
import MemorialCard from "../components/MemorialCard";

export default function HomePage() {
  const [memorials, setMemorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPublicMemorials();
        setMemorials(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

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
    <h1 style={{ textAlign: "center" }}></h1>
       
    <h1 style={{ textAlign: "center", marginBottom: 32 }}>
      🌈 Memoriali Pubblici
    </h1>

    {memorials.length === 0 ? (
      <p style={{ textAlign: "center", color: "#666" }}>
        Nessun memoriale pubblico disponibile.
      </p>
    ) : (
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 24,
        }}
      >
        {memorials.map((m) => (
          <MemorialCard key={m.id} memorial={m} />
        ))}
      </div>
    )}    
  </div>
  );
}

