import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./WelcomePage.css";

export default function WelcomePage() {
  const navigate = useNavigate();
  const [visibleSteps, setVisibleSteps] = useState(0);

  const handleStart = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    const token = localStorage.getItem("token");
    navigate(token ? "/dashboard" : "/login", { replace: true });
  };

  const handleSkip = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleSteps(1), 600),
      setTimeout(() => setVisibleSteps(2), 1400),
      setTimeout(() => setVisibleSteps(3), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const stepClass = (step) =>
    `welcome-step ${visibleSteps >= step ? "visible" : ""}`;

  return (
    <div className="welcome">
      {/* HERO */}
      <section className="welcome-hero">
        <div className="welcome-hero-inner">
          <h1>
            Un luogo per ricordare chi ci ha accompagnato
          </h1>

          <p>
            Virtual Pet Memorial è uno spazio digitale dedicato agli animali
            che hanno fatto parte della nostra vita. Qui puoi custodire il
            loro ricordo, con semplicità e rispetto.
          </p>

          <div className="welcome-actions">
            <button className="button" onClick={handleStart}>
              ✨ Inizia
            </button>
            <button
              className="button secondary"
              onClick={handleSkip}
            >
              Salta
            </button>
          </div>
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section className="welcome-how">
        <h2>Come funziona</h2>

        <div className="welcome-steps">
          <div className={stepClass(1)}>
            <div className="icon">🕯️</div>
            <h3>Crea un memoriale</h3>
            <p>
              Inserisci il nome del tuo animale e una breve frase per ricordarlo.
            </p>
          </div>

          <div className={stepClass(2)}>
            <div className="icon">🐾</div>
            <h3>Custodisci il ricordo</h3>
            <p>
              Puoi modificare o aggiornare il memoriale ogni volta che lo desideri.
            </p>
          </div>

          <div className={stepClass(3)}>
            <div className="icon">💙</div>
            <h3>Condividi, se vuoi</h3>
            <p>
              Decidi se tenere il memoriale privato o renderlo visibile a chi ha il link.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="welcome-footer">
        <p>Ogni ricordo merita uno spazio.</p>
        <button className="button" onClick={handleStart}>
          ✨ Entra in Virtual Pet Memorial
        </button>
      </section>
    </div>
  );
}
