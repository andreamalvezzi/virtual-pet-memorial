import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function NotFoundPage() {
  return (
    <div className="page-state">
      <Helmet>
        <title>Pagina non trovata – Virtual Pet Memorial</title>
        <meta
          name="description"
          content="La pagina che stai cercando non esiste. Torna alla home o esplora i memoriali pubblici."
        />
      </Helmet>

      <div className="page-state__card">
        <h1 className="page-state__title">Pagina non trovata</h1>

        <p className="page-state__message">
          La pagina che stai cercando non esiste oppure è stata spostata.
        </p>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link to="/home" className="cta-primary">
            Torna alla home
          </Link>

          <Link to="/memorials" className="cta-secondary">
            Esplora i memoriali
          </Link>
        </div>
      </div>
    </div>
  );
}
