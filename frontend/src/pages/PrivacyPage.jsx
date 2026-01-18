import { Helmet } from "react-helmet-async";

export default function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy – Virtual Pet Memorial</title>
      </Helmet>

      <section className="legal-page">
        <h1>Privacy Policy</h1>

        <p>
          Questo sito è un progetto personale e indipendente.
          La presente informativa descrive come vengono trattati
          i dati personali degli utenti.
        </p>

        <h2>Dati raccolti</h2>
        <ul>
          <li>Dati di registrazione (email)</li>
          <li>Contenuti inseriti dall’utente (memoriali, testi, immagini)</li>
          <li>Messaggi inviati tramite il modulo di contatto</li>
        </ul>

        <h2>Immagini</h2>
        <p>
          Le immagini caricate vengono archiviate tramite un servizio
          di hosting esterno (Cloudinary) esclusivamente per consentire
          la visualizzazione del memoriale.
        </p>

        <h2>Finalità del trattamento</h2>
        <p>
          I dati vengono utilizzati unicamente per fornire il servizio
          e rispondere alle richieste degli utenti.
        </p>

        <h2>Cancellazione dei dati</h2>
        <p>
          L’utente può richiedere in qualsiasi momento la cancellazione
          del proprio account e dei dati associati direttamente
          dall’area personale.
        </p>

        <h2>Condivisione dei dati</h2>
        <p>
          I dati non vengono ceduti a terzi né utilizzati per finalità
          commerciali o di profilazione.
        </p>
      </section>
    </>
  );
}
