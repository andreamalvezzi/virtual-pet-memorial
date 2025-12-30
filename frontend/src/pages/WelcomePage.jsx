import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

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

  const getStepStyle = (step) => ({
    opacity: visibleSteps >= step ? 1 : 0,
    transform: visibleSteps >= step ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 600ms ease, transform 600ms ease",
  });

  return (
    <main>
      {/* HERO FULL WIDTH */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.title}>
            Un luogo per ricordare chi ci ha accompagnato
          </h1>

          <p style={styles.subtitle}>
            Virtual Pet Memorial è uno spazio digitale dedicato agli animali che
            hanno fatto parte della nostra vita. Qui puoi custodire il loro
            ricordo, con semplicità e rispetto.
          </p>

          <div style={styles.heroActions}>
            <button style={styles.primaryButton} onClick={handleStart}>
              ✨ Inizia
            </button>
            <button style={styles.secondaryButton} onClick={handleSkip}>
              Salta
            </button>
          </div>
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section style={styles.howItWorks}>
        <h2 style={styles.sectionTitle}>Come funziona</h2>

        <div style={styles.steps}>
          <div style={{ ...styles.stepCard, ...getStepStyle(1) }}>
            <div style={styles.icon}>🕯️</div>
            <h3 style={styles.stepTitle}>Crea un memoriale</h3>
            <p style={styles.stepText}>
              Inserisci il nome del tuo animale e una breve frase per ricordarlo.
            </p>
          </div>

          <div style={{ ...styles.stepCard, ...getStepStyle(2) }}>
            <div style={styles.icon}>🐾</div>
            <h3 style={styles.stepTitle}>Custodisci il ricordo</h3>
            <p style={styles.stepText}>
              Puoi modificare o aggiornare il memoriale ogni volta che lo desideri.
            </p>
          </div>

          <div style={{ ...styles.stepCard, ...getStepStyle(3) }}>
            <div style={styles.icon}>💙</div>
            <h3 style={styles.stepTitle}>Condividi, se vuoi</h3>
            <p style={styles.stepText}>
              Decidi se tenere il memoriale privato o renderlo visibile a chi ha il link.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={styles.footer}>
        <p style={styles.footerText}>Ogni ricordo merita uno spazio.</p>
        <button style={styles.primaryButton} onClick={handleStart}>
          ✨ Entra in Virtual Pet Memorial
        </button>
      </section>
    </main>
  );
}

/* ---------------- STYLES ---------------- */
const styles = {
  hero: {
    width: "100%",
    background: "linear-gradient(180deg, #1f2937 0%, #111827 100%)",
    padding: "4rem 1.5rem",
  },
  heroInner: {
    maxWidth: "1200px",//era 900
    margin: "0 auto",
    textAlign: "center",
  },
  title: {
    fontSize: "2.4rem",
    fontWeight: 600,
    color: "#e5e7eb",
    marginBottom: "1rem",
  },
  subtitle: {
    fontSize: "1.05rem",
    color: "#9ca3af",
    maxWidth: "620px",
    margin: "0 auto 2rem",
    lineHeight: 1.6,
  },
  heroActions: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },
  primaryButton: {
    padding: "0.85rem 1.75rem",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "#334155",
    color: "#fff",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "0.75rem 1.5rem",
    borderRadius: "999px",
    border: "1px solid #9ca3af",
    background: "transparent",
    color: "#e5e7eb",
    cursor: "pointer",
  },
  howItWorks: {
    padding: "4rem 1.5rem",
    textAlign: "center",
    maxWidth: "1200px",//aggiunto
    margin: "0 auto",//aggiunto
  },
  sectionTitle: {
    fontSize: "1.7rem",
    fontWeight: 600,
    marginBottom: "3rem",
  },
  steps: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    flexWrap: "wrap",
    maxWidth: "1200px",//era 1100
    margin: "0 auto",
  },
  stepCard: {
    backgroundColor: "#fafafa",
    borderRadius: "18px",
    padding: "2rem",
    maxWidth: "360px",//era 320
    textAlign: "center",
    color: "#1f2937",
  },
  stepTitle: {
    fontWeight: 600,
    marginBottom: "0.5rem",
  },
  stepText: {
    fontSize: "0.95rem",
    color: "#4b5563",
    lineHeight: 1.5,
  },
  icon: {
    fontSize: "2.2rem",
    marginBottom: "0.75rem",
  },
  footer: {
    textAlign: "center",
    padding: "3rem 1.5rem",
  },
  footerText: {
    fontSize: "1.2rem",
    marginBottom: "1rem",
  },
};
