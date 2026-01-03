import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicMemorials } from "../api/memorials";
import MemorialCard from "../components/MemorialCard";
import { useAuth } from "../context/AuthContext";
import "./HomePage.css";

export default function HomePage() {
  const [memorials, setMemorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        const data = await getPublicMemorials(1, 6);
        if (Array.isArray(data)) setMemorials(data);
        else if (data?.items) setMemorials(data.items);
        else setMemorials([]);
      } catch (err) {
        setError(err.message);
        setMemorials([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="home-loading">Caricamento…</p>;
  if (error) return <p className="home-error">{error}</p>;

  return (
    <div className="home-container">
      {/* HERO */}
      <section className="home-hero">
        <h1>
          Un luogo per ricordare chi hai amato 🐾
        </h1>

        <p>
          Crea un memoriale digitale per il tuo pet e condividilo
          con chi lo ha conosciuto.
        </p>

        <div className="home-hero-actions">
          <button
            onClick={() =>
              document
                .getElementById("memorial-grid")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="button secondary"
          >
            Esplora memoriali
          </button>

          <Link
            to={user ? "/dashboard/memorials/new" : "/login"}
            className="button"
          >
            Crea un memoriale
          </Link>
        </div>
      </section>

      {/* MEMORIALI */}
      <section>
        <h2 className="home-section-title">
          🌈 Memoriali pubblici
        </h2>

        {memorials.length === 0 ? (
          <p className="home-empty">
            Nessun memoriale pubblico disponibile.
          </p>
        ) : (
          <div
            id="memorial-grid"
            className="memorial-grid"
          >
            {memorials.map((m) => (
              <MemorialCard key={m.id} memorial={m} />
            ))}
          </div>
        )}

        {memorials.length > 0 && (
          <div className="home-view-all">
            <Link to="/memorials">
              Vedi tutti i memoriali →
            </Link>
          </div>
        )}
      </section>

      {/* CTA FINALE */}
      <section
        id="cta-create"
        className="home-cta"
      >
        <h2>
          Vuoi creare il memoriale del tuo pet?
        </h2>

        <p>
          Bastano pochi minuti. Puoi aggiungere
          una foto e un pensiero.
        </p>

        <Link
          to={user ? "/dashboard/memorials/new" : "/login"}
          className="button"
        >
          Inizia ora
        </Link>
      </section>
    </div>
  );
}
