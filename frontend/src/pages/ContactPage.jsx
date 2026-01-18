import { Helmet } from "react-helmet-async";

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contatti – Virtual Pet Memorial</title>
      </Helmet>

      <section className="legal-page">
        <h1>Contattaci</h1>

        <p>
          Questo progetto è in fase iniziale.
          Se desideri maggiori informazioni o sei interessato
          a funzionalità future, puoi contattarci utilizzando
          il modulo qui sotto.
        </p>

        <form className="contact-form">
          <label>
            Email
            <input type="email" required />
          </label>

          <label>
            Messaggio
            <textarea rows="5" required />
          </label>

          <label className="contact-checkbox">
            <input type="checkbox" />
            Sono interessato a funzionalità avanzate
          </label>

          <button type="submit" disabled>
            Invio disabilitato (in arrivo)
          </button>
        </form>

        <p className="contact-note">
          I dati inviati verranno utilizzati esclusivamente
          per rispondere alla richiesta.
        </p>
      </section>
    </>
  );
}
