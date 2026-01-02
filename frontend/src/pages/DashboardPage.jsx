import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyMemorials, deleteMemorial } from "../api/memorials";
import MemorialCard from "../components/MemorialCard";

export default function DashboardPage() {
  const [memorials, setMemorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMemorials() {
      try {
        const data = await getMyMemorials();
        setMemorials(data);
      } catch (err) {
        console.error(err);
        setError("Errore nel caricamento dei memoriali");
      } finally {
        setLoading(false);
      }
    }

    loadMemorials();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Sei sicuro di voler eliminare questo memoriale?"
    );

    if (!confirmed) return;

    try {
      await deleteMemorial(id);
      setMemorials((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

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
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      {/* HEADER */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 6 }}>La tua dashboard</h1>
        <p style={{ color: "#aaa", margin: 0 }}>
          Qui trovi tutti i memoriali che hai creato.
        </p>
      </div>

      {/* CTA CREAZIONE */}
      <div style={{ marginBottom: 24 }}>
        <Link
          to="/dashboard/memorials/new"
          style={{
            display: "inline-block",
            padding: "10px 14px",
            borderRadius: 10,
            background: "#fff",
            color: "#000",
            textDecoration: "none",
          }}
        >
          ➕ Crea nuovo memoriale
        </Link>
      </div>

      {/* EMPTY STATE */}
      {memorials.length === 0 ? (
        <div
          style={{
            marginTop: 40,
            textAlign: "center",
            padding: "40px 20px",
            border: "1px dashed #444",
            borderRadius: 12,
          }}
        >
          <h2 style={{ marginBottom: 8 }}>
            Non hai ancora creato nessun memoriale 🐾
          </h2>

          <p style={{ color: "#aaa", marginBottom: 20 }}>
            Qui compariranno i memoriali dei tuoi pet.
            Inizia creando il tuo primo memoriale.
          </p>

          <Link
            to="/dashboard/memorials/new"
            style={{
              display: "inline-block",
              padding: "10px 14px",
              borderRadius: 10,
              background: "#fff",
              color: "#000",
              textDecoration: "none",
            }}
          >
            ➕ Crea il tuo primo memoriale
          </Link>
        </div>
      ) : (
        /* GRID MEMORIALI */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
            marginTop: 20,
          }}
        >
          {memorials.map((memorial) => (
            <div key={memorial.id}>
              <MemorialCard memorial={memorial} />

              {/* AZIONI DASHBOARD */}
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Link
                  to={`/dashboard/memorials/${memorial.id}/edit`}
                  style={{ textDecoration: "none" }}
                >
                  ✏️ Modifica
                </Link>

                <button
                  onClick={() => handleDelete(memorial.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "red",
                    cursor: "pointer",
                  }}
                >
                  🗑️ Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

