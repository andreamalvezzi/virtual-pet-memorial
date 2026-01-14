import { Helmet } from "react-helmet-async";
import PlanInfoTooltip from "../components/PlanInfoTooltip";
import "./PlansPage.css";

export default function PlansPage() {
  return (
    <div className="plans-container">
      <Helmet>
        <title>Piani – Virtual Pet Memorial</title>
        <meta
          name="description"
          content="Scopri i piani disponibili per creare e custodire memoriali dedicati ai tuoi animali."
        />
      </Helmet>

      {/* HEADER */}
      <header className="plans-header">
        <h1>I nostri piani</h1>
        <p>
          Un modo semplice e flessibile per scegliere come custodire
          i ricordi dei tuoi animali, oggi e in futuro.
        </p>
      </header>

      {/* GRID PIANI */}
      <section className="plans-grid">
        {/* FREE */}
        <article className="plan-card active">
          <h2>
            FREE
            <PlanInfoTooltip title="Piano FREE – 0€">
              Il piano base per iniziare a creare un memoriale e
              custodire un primo ricordo.
            </PlanInfoTooltip>
          </h2>

          <div className="plan-price">0€</div>

          <p className="plan-description">
            Ideale per creare un primo spazio commemorativo in modo
            semplice e immediato.
          </p>

          <ul className="plan-features">
            <li>1 memoriale</li>
            <li>1 immagine (cover)</li>
            <li>Lapide standard</li>
            <li>Epitaffio fino a 100 caratteri</li>
            <li>Memoriale pubblico o privato</li>
          </ul>

          <div className="plan-status">
            Piano attivo
          </div>
        </article>

        {/* PLUS */}
        <article className="plan-card">
          <h2>
            PLUS
            <PlanInfoTooltip title="Piano Plus – 2,99€">
              Pensato per chi desidera più spazio e maggiori
              possibilità di personalizzazione.
            </PlanInfoTooltip>
          </h2>

          <div className="plan-price">2,99€</div>

          <p className="plan-description">
            Una soluzione intermedia per chi vuole dedicare più
            spazio ai propri ricordi.
          </p>

          <ul className="plan-features">
            <li>Fino a 3 memoriali</li>
            <li>Più immagini per memoriale</li>
            <li>Più stili di lapide</li>
            <li>Epitaffio più esteso</li>
          </ul>

          <div className="plan-status muted">
            Disponibile prossimamente
          </div>
        </article>

        {/* PREMIUM */}
        <article className="plan-card">
          <h2>
            PREMIUM
            <PlanInfoTooltip title="Piano Premium – 5,99€">
              Il piano più completo per custodire ogni ricordo
              senza limiti.
            </PlanInfoTooltip>
          </h2>

          <div className="plan-price">5,99€</div>

          <p className="plan-description">
            Pensato per chi desidera raccogliere e preservare
            ogni ricordo in modo completo.
          </p>

          <ul className="plan-features">
            <li>Fino a 6 memoriali</li>
            <li>Galleria completa di immagini</li>
            <li>Video commemorativi</li>
            <li>Tutti gli stili di lapide</li>
            <li>Epitaffio esteso</li>
          </ul>

          <div className="plan-status muted">
            Disponibile prossimamente
          </div>
        </article>
      </section>

      {/* NOTA FINALE */}
      <footer className="plans-note">
        <p>
          ℹ️ Al momento è possibile creare memoriali solo con il piano FREE.
          I piani Plus e Premium saranno disponibili in futuro per offrire
          maggiori possibilità di personalizzazione.
        </p>
      </footer>
    </div>
  );
}
