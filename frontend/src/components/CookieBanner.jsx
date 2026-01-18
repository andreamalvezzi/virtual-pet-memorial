import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CookieBanner.css";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite">
      <p>
        Questo sito utilizza esclusivamente cookie tecnici necessari
        al corretto funzionamento del servizio.{" "}
        <Link to="/cookie-policy">
          Scopri di più
        </Link>
        .
      </p>

      <button onClick={acceptCookies}>
        Accetta
      </button>
    </div>
  );
}
