import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicMemorials } from "../api/memorials";
import MemorialCard from "../components/MemorialCard";
import { useAuth } from "../context/AuthContext";
import "./HomePage.css";
import React from "react";
import { Helmet } from "react-helmet-async";

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

  if (loading) {
    return (
      <p className="home-loading">
        Caricamento memoriali… <br />
        (potrebbe richiedere qualche secondo al primo avvio)
      </p>
    );
  }

  if (error) return <p className="home-error">{error}</p>;

  return (
    <React.Fragment>
      {/* SEO */}
      <Helmet>
        <title>Cimitero Virtuale per Animali</title>

        <meta
          name="description"
          content="Crea un memoriale online per il tuo animale domestico. Un luogo per ricordare cani, gatti e altri pet con amore."
        />

        <link
          rel="canonical"
          href={`${
            import.meta.env.VITE_SITE_URL ||
            "https://virtual-pet-memorial-frontend.onrender.com"
          }/#/home`}
        />
      </Helmet>

      <div className="home-container">
        {/* HERO */}
        <section className="home-hero">
          <h1>Cimitero Virtuale per Animali</h1>

          <h2 className="home-subtitle">
            Un luogo online per ricordare il tuo animale domestico
          </h2>

          <p>
            Crea un memoriale digitale per il tuo pet e condividilo
            con chi lo ha conosciuto.
          </p>

          <div className="home-hero-actions">
            {/* CTA PRIMARIA */}
            <Link
              to={user ? "/dashboard/memorials/new" : "/login"}
              className="button"
            >
              {user
                ? "Crea il memoriale del tuo pet"
                : "Accedi per creare un memoriale"}
            </Link>

            {/* CTA SECONDARIA */}
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
          </div>
        </section>

        {/* SEO TESTUALE */}
        <section className="home-seo">
          <p>
            Il <strong>Cimitero Virtuale per Animali</strong> è uno spazio online
            dedicato a chi desidera ricordare il proprio animale domestico.
            Qui puoi creare un memoriale digitale per cani, gatti e altri pet,
            conservando il loro ricordo nel tempo.
          </p>

          <p>
            Ogni memoriale permette di aggiungere una foto, una dedica e le
            informazioni più importanti, offrendo un luogo rispettoso e
            sempre accessibile per chi ha condiviso un legame speciale con
            il proprio amico a quattro zampe.
          </p>
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
            Ogni ricordo merita il suo spazio
          </h2>

          <p>
            Bastano pochi minuti per creare un memoriale
            dedicato al tuo pet.
          </p>

          <Link
            to={user ? "/dashboard/memorials/new" : "/login"}
            className="button"
          >
            Inizia ora
          </Link>
        </section>
      </div>
    </React.Fragment>
  );
}
