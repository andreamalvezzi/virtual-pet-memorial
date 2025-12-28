import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyMemorials, deleteMemorial } from "../api/memorials";

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

  // 👇👇👇 QUI VA LA FUNZIONE 👇👇👇
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

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>La tua dashboard</h1>

      <Link to="/dashboard/memorials/new">
        ➕ Crea nuovo memoriale
      </Link>

      <hr />

      {memorials.length === 0 ? (
        <p>Nessun memoriale creato.</p>
      ) : (
        <ul>
          {memorials.map((m) => (
            <li key={m.id}>
              <strong>{m.petName}</strong> ({m.species}) —{" "}
              <Link to={`/memorials/${m.slug}`}>visualizza</Link>
              <Link to={`/dashboard/memorials/${m.id}/edit`} style={{ marginLeft: "10px" }}>
                Modifica
              </Link>
              <button
                onClick={() => handleDelete(m.id)}
                style={{ marginLeft: "10px", color: "red" }}
              >
                Elimina
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
