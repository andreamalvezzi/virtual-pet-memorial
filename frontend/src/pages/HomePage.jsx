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

    {/* HERO */}
    <div style={{ textAlign: "center", marginBottom: 36 }}>
      <h1 style={{ fontSize: 44, margin: "0 0 10px" }}>
        Un luogo per ricordare chi hai amato 🐾
      </h1>

      <p style={{ margin: 0, color: "#aaa", fontSize: 16, lineHeight: 1.5 }}>
        Crea un memoriale digitale per il tuo pet e condividilo con chi lo ha conosciuto.
      </p>

      <div
        style={{
          marginTop: 18,
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <a
          href="/#/home#grid"
          style={{
          padding: "10px 14px",
          borderRadius: 10,
          border: "1px solid #444",
          textDecoration: "none",
          color: "inherit",
        }}
      >
        Esplora memoriali
      </a>

      <a
        href="/#/home#cta-create"
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          background: "#fff",
          color: "#000",
          textDecoration: "none",
        }}
      >
        Crea un memoriale
        </a>
      </div>
    </div>

    <h1 style={{ textAlign: "center", marginBottom: 32 }}>
      🌈 Memoriali Pubblici
    </h1>

    {memorials.length === 0 ? (
      <p style={{ textAlign: "center", color: "#666" }}>
        Nessun memoriale pubblico disponibile.
      </p>
    ) : (
      <div
        id="grid"
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

    {/* CTA FINALE */}
    <div
      id="cta-create"
      style={{
        textAlign: "center",
        marginTop: 48,
      }}
    >
      <h2 style={{ margin: "0 0 8px" }}>
        Vuoi creare il memoriale del tuo pet?
      </h2>

      <p style={{ margin: "0 0 16px", color: "#aaa" }}>
        Bastano pochi minuti. Puoi aggiungere una foto e un pensiero.
      </p>

      <a
        href="/#/login"
        style={{
          display: "inline-block",
          padding: "10px 14px",
          borderRadius: 10,
          background: "#fff",
          color: "#000",
          textDecoration: "none",
        }}
      >
        Inizia ora
      </a>
    </div>

  </div>
  );
}

