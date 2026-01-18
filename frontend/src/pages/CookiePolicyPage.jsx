import { Helmet } from "react-helmet-async";

export default function CookiePolicyPage() {
  return (
    <>
      <Helmet>
        <title>Cookie Policy – Virtual Pet Memorial</title>
      </Helmet>

      <section className="legal-page">
        <h1>Cookie Policy</h1>

        <p>
          Questo sito utilizza esclusivamente cookie tecnici
          necessari al corretto funzionamento dell’applicazione.
        </p>

        <h2>Cookie tecnici</h2>
        <p>
          I cookie tecnici sono utilizzati per:
        </p>
        <ul>
          <li>Gestire l’autenticazione dell’utente</li>
          <li>Mantenere la sessione attiva</li>
          <li>Salvare le preferenze di consenso ai cookie</li>
        </ul>

        <h2>Cookie di profilazione</h2>
        <p>
          Non vengono utilizzati cookie di profilazione
          o strumenti di tracciamento a fini pubblicitari.
        </p>
      </section>
    </>
  );
}
