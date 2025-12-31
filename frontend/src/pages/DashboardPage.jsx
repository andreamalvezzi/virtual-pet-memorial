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
    return <p>Caricamento...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
      <h1>La tua dashboard</h1>

      <Link to="/dashboard/memorials/new">
        ➕ Crea nuovo memoriale
      </Link>

      <hr />

      {memorials.length === 0 ? (
        <p>Nessun memoriale creato.</p>
      ) : (
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
                <Link to={`/dashboard/memorials/${memorial.id}/edit`}>
                  Modifica
                </Link>

                <button
                  onClick={() => handleDelete(memorial.id)}
                  style={{ color: "red" }}
                >
                  Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
