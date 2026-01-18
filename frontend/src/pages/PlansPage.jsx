import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import "./PlansPage.css";

export default function PlansPage() {
  return (
    <div className="plans-container">
      <Helmet>
        <title>Funzionalità – Virtual Pet Memorial</title>
        <meta
          name="description"
          content="Scopri le funzionalità disponibili per creare e custodire un memoriale digitale dedicato al tuo animale."
        />
      </Helmet>

      {/* HEADER */}
      <header className="plans-header">
        <h1>Funzionalità del Memoriale</h1>
        <p>
          Virtual Pet Memorial è un progetto personale e indipendente,
          pensato per offrire uno spazio semplice e rispettoso dove
          custodire il ricordo dei propri animali.
        </p>
      </header>

      {/* GRID */}
      <section className="plans-grid">
        {/* BASE */}
        <article className="plan-card active">
          <h2>Funzionalità di base</h2>

          <p className="plan-description">
            Disponibili gratuitamente per tutti gli utenti.
          </p>

          <ul className="plan-features">
            <li>Creazione di un memoriale</li>
            <li>1 immagine di copertina</li>
            <li>Lapide standard</li>
            <li>Epitaffio breve</li>
            <li>Memoriale pubblico o privato</li>
          </ul>

          <div className="plan-status">
            Attive
          </div>
        </article>

        {/* AVANZATE */}
        <article className="plan-card muted">
          <h2>Funzionalità avanzate</h2>

          <p className="plan-description">
            Funzionalità attualmente in fase sperimentale.
          </p>

          <ul className="plan-features">
            <li>Galleria immagini</li>
            <li>Stili di lapide personalizzati</li>
            <li>Epitaffio esteso</li>
            <li>Memoriale privato avanzato</li>
          </ul>

          <div className="plan-status muted">
            In sviluppo
          </div>
        </article>

        {/* SOSTEGNO */}
        <article className="plan-card">
          <h2>Sostieni il progetto</h2>

          <p className="plan-description">
            Se desideri supportare lo sviluppo del progetto o
            ricevere maggiori informazioni sulle funzionalità
            sperimentali, puoi contattarci.
          </p>

          <p className="plan-description">
            Il sostegno avviene esclusivamente tramite
            contributi volontari.
          </p>

          <Link to="/contatti" className="plan-cta">
            Contattaci
          </Link>
        </article>
      </section>

      {/* NOTA FINALE */}
      <footer className="plans-note">
        <p>
          ℹ️ Le funzionalità avanzate non sono attualmente
          attive per tutti gli utenti e vengono abilitate
          solo su richiesta, in forma sperimentale.
        </p>
      </footer>
    </div>
  );
}
