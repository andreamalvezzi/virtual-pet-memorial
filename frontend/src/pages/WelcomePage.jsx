import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function WelcomePage() {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [visibleSteps, setVisibleSteps] = useState(0);

  /* ---------------- HANDLERS ---------------- */
  const handleStart = () => {
    localStorage.setItem("hasSeenWelcome", "true");

    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  };

  const handleSkip = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    navigate("/login", { replace: true });
  };

  /* ---------------- EFFECTS ---------------- */
  useEffect(() => {
    const timers = [];

    timers.push(setTimeout(() => setVisibleSteps(1), 600));
    timers.push(setTimeout(() => setVisibleSteps(2), 1400));
    timers.push(setTimeout(() => setVisibleSteps(3), 2200));

    return () => timers.forEach(clearTimeout);
  }, []);

  /* ---------------- ANIMATION STYLE ---------------- */
  const getStepStyle = (stepIndex) => ({
    opacity: visibleSteps >= stepIndex ? 1 : 0,
    transform: visibleSteps >= stepIndex
      ? "translateY(0)"
      : "translateY(20px)",
    transition: "opacity 600ms ease, transform 600ms ease",
  });

  /* ---------------- RENDER ---------------- */
  return (
    <main style={styles.page}>
      {/* HERO */}
      <section style={{ ...styles.hero, ...styles.content }}>
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
      </section>

      {/* COME FUNZIONA */}
      <section style={{ ...styles.howItWorks, ...styles.content }}>
        <h2 style={styles.sectionTitle}>Come funziona</h2>
        <div style={styles.steps}>
          <div style={{ ...styles.stepCard, ...getStepStyle(1) }}>
            <div style={styles.icon}>🕯️</div>
            <h3>Crea un memoriale</h3>
            <p>
              Inserisci il nome del tuo animale e una breve frase per
              ricordarlo.
            </p>
          </div>

          <div style={{ ...styles.stepCard, ...getStepStyle(2) }}>
            <div style={styles.icon}>🐾</div>
            <h3>Custodisci il ricordo</h3>
            <p>
              Puoi modificare o aggiornare il memoriale ogni volta che lo
              desideri.
            </p>
          </div>

          <div style={{ ...styles.stepCard, ...getStepStyle(3) }}>
            <div style={styles.icon}>💙</div>
            <h3>Condividi, se vuoi</h3>
            <p>
              Decidi se tenere il memoriale privato o renderlo visibile a chi ha
              il link.
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
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    gap: "4rem",
    padding: "3.5rem 1.5rem",
    maxWidth: "1100px",
    margin: "0 auto",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif",
    color: "#1f2937",
  },
  content: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
  },
  hero: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  title: {
    fontSize: "2.4rem",
    lineHeight: 1.25,
    fontWeight: 600,
    letterSpacing: "-0.02em",
    color: "#e5e7eb",
  },
  subtitle: {
    fontSize: "1.05rem",
    color: "#9ca3af",
    maxWidth: "620px",
    margin: "0 auto",
    lineHeight: 1.6,
  },
  heroActions: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "1rem",
  },
  primaryButton: {
    padding: "0.85rem 1.75rem",
    fontSize: "0.95rem",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "#334155",
    color: "#fff",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    borderRadius: "999px",
    border: "1px solid #ccc",
    backgroundColor: "transparent",
    cursor: "pointer",
  },
  howItWorks: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2.5rem",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: "1.7rem",
    fontWeight: 600,
    color: "#c7d2fe",
  },
  steps: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "2rem",
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
  },
  stepCard: {
    padding: "2rem",
    borderRadius: "18px",
    backgroundColor: "#fafafa",
    border: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  icon: {
    fontSize: "2.2rem",
    marginBottom: "0.25rem",
  },
  footer: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  footerText: {
    fontSize: "1.2rem",
  },
};
