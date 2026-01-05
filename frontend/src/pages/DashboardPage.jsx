import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getMyMemorials, deleteMemorial } from "../api/memorials";
import MemorialCard from "../components/MemorialCard";
import "./DashboardPage.css";

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
    return <p className="dashboard-loading">Caricamento…</p>;
  }

  if (error) {
    return <p className="dashboard-error">{error}</p>;
  }

  return (
    <div className="dashboard-container">
      {/* ===== SEO (pagina privata) ===== */}
      <Helmet>
        <title>Dashboard – Virtual Pet Memorial</title>
        <meta
          name="description"
          content="Gestisci i memoriali che hai creato, modificane i contenuti o creane di nuovi nel tuo spazio personale."
        />
      </Helmet>

      {/* HEADER */}
      <header className="dashboard-header">
        <h1>La tua dashboard</h1>
        <p>Qui trovi tutti i memoriali che hai creato.</p>
      </header>

      {/* CTA */}
      <div className="dashboard-cta">
        <Link
          to="/dashboard/memorials/new"
          className="dashboard-button"
        >
          ➕ Crea nuovo memoriale
        </Link>
      </div>

      {/* EMPTY STATE */}
      {memorials.length === 0 ? (
        <div className="dashboard-empty">
          <h2>Non hai ancora creato nessun memoriale 🐾</h2>
          <p>
            Qui compariranno i memoriali dei tuoi pet.
            Inizia creando il tuo primo memoriale.
          </p>
          <Link
            to="/dashboard/memorials/new"
            className="dashboard-button"
          >
            ➕ Crea il tuo primo memoriale
          </Link>
        </div>
      ) : (
        <div className="memorial-grid">
          {memorials.map((memorial) => (
            <div
              key={memorial.id}
              className="dashboard-card-wrapper"
            >
              <MemorialCard memorial={memorial} />

              <div className="dashboard-card-actions">
                <Link
                  to={`/dashboard/memorials/${memorial.id}/edit`}
                  className="edit-link"
                >
                  ✏️ Modifica
                </Link>

                <button
                  onClick={() => handleDelete(memorial.id)}
                  className="delete-button"
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
