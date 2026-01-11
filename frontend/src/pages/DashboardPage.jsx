import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getMyMemorials, deleteMemorial } from "../api/memorials";
import { getMe } from "../api/users";
import PlanInfoTooltip from "../components/PlanInfoTooltip";
import MemorialCard from "../components/MemorialCard";
import "./DashboardPage.css";

export default function DashboardPage() {
  const [me, setMe] = useState(null);

  const [memorials, setMemorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAll() {
      try {
        const [meData, memData] = await Promise.all([getMe(), getMyMemorials()]);
        setMe(meData);
        setMemorials(memData);
      } catch {
        setError("Errore nel caricamento dei dati");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm("Sei sicuro di voler eliminare questo memoriale?");
    if (!confirmed) return;

    try {
      await deleteMemorial(id);
      setMemorials((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p className="dashboard-loading">Caricamento…</p>;
  if (error) return <p className="dashboard-error">{error}</p>;

  const plan = me?.plan || "FREE";
  const maxMemorials = me?.limits?.maxMemorials ?? 1;
  const used = me?.usage?.memorialsUsed ?? memorials.length;

  const planTitle =
    plan === "FREE" ? "Piano FREE – 0€" :
    plan === "MEDIUM" ? "Piano MEDIUM – 2,99€ / memoriale" :
    "Piano PLUS – 5,99€ / memoriale";

  const planText =
    plan === "FREE"
      ? "1 memoriale, 1 foto, lapide standard, 100 parole."
      : plan === "MEDIUM"
      ? "3 memoriali, 5 immagini, 6 lapidi, 300 parole."
      : "6 memoriali, 10 immagini, 3 video, tutte le lapidi, 1000 parole.";

  return (
    <div className="dashboard-container">
      <Helmet>
        <title>Dashboard – Virtual Pet Memorial</title>
        <meta
          name="description"
          content="Gestisci i memoriali che hai creato, modificane i contenuti o creane di nuovi nel tuo spazio personale."
        />
      </Helmet>

      <header className="dashboard-header">
        <h1>La tua dashboard</h1>
        <p>Questo è il tuo spazio personale, 
          <br />
            un luogo intimo dove preservare e celebrare
          <br />
            i ricordi dei tuoi animali, e trasformarli in memoria vivente.
        </p>
      </header>

      {/* BOX PIANO */}
      {me && (
        <div className="dashboard-planbox">

        <strong className="dashboard-planline">
          Piano:
        <span className="plan-tag active">
          FREE
          <PlanInfoTooltip title="Piano FREE – 0€">
            1 memoriale, 1 foto, lapide standard, epitaffio breve.
          </PlanInfoTooltip>
        </span>

          <span className="plan-tag">
            PLUS
            <PlanInfoTooltip title="Piano Plus">
              Più memoriali, più immagini e maggiori possibilità di personalizzazione.
            </PlanInfoTooltip>
          </span>

          <span className="plan-tag">
            PREMIUM
            <PlanInfoTooltip title="Piano Premium">
              Tutte le funzionalità disponibili per custodire ogni ricordo senza limiti.
            </PlanInfoTooltip>
            </span>
          </strong>

          <div>
            Memoriali: {used} / {maxMemorials}
          </div>
          {!me.emailVerified && (
            <div className="dashboard-planwarn">
              ⚠️ Email non verificata: non puoi creare memoriali finché non verifichi.
            </div>
          )}
          </div>
        )}

      <div className="dashboard-cta">
        <Link
          to="/dashboard/memorials/new"
          className="dashboard-button"
        >
          ➕ Crea nuovo memoriale
        </Link>
      </div>

      {memorials.length === 0 ? (
        <div className="dashboard-empty">
          <h2>🐾 Il tuo spazio è pronto</h2>
          <p>
            Qui troverai i memoriali dedicati ai tuoi animali. Puoi iniziare creando il primo,
            aggiungendo una foto e un pensiero che resti nel tempo.
          </p>

          <Link to="/dashboard/memorials/new" className="dashboard-button">
            ✨ Crea il tuo primo memoriale
          </Link>
        </div>
      ) : (
        <div className="memorial-grid">
          {memorials.map((memorial) => (
            <div key={memorial.id} className="dashboard-card-wrapper">
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
