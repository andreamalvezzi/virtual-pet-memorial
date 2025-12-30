import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();

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


  return (
    <main style={styles.page}>
      {/* HERO */}
      <section style={styles.hero}>
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
      <section style={styles.howItWorks}>
        <h2 style={styles.sectionTitle}>Come funziona</h2>

        <div style={styles.steps}>
          <div style={styles.stepCard}>
            <div style={styles.icon}>🕯️</div>
            <h3>Crea un memoriale</h3>
            <p>
              Inserisci il nome del tuo animale e una breve frase per
              ricordarlo.
            </p>
          </div>

          <div style={styles.stepCard}>
            <div style={styles.icon}>🐾</div>
            <h3>Custodisci il ricordo</h3>
            <p>
              Puoi modificare o aggiornare il memoriale ogni volta che lo
              desideri.
            </p>
          </div>

          <div style={styles.stepCard}>
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

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    gap: "4rem",
    padding: "3rem 1.5rem",
    maxWidth: "900px",
    margin: "0 auto",
    fontFamily: "system-ui, sans-serif",
  },
  hero: {
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  title: {
    fontSize: "2.2rem",
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#555",
    maxWidth: "600px",
    margin: "0 auto",
  },
  heroActions: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "1rem",
  },
  primaryButton: {
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "#222",
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
    gap: "2rem",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: "1.6rem",
  },
  steps: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.5rem",
  },
  stepCard: {
    padding: "1.5rem",
    borderRadius: "12px",
    border: "1px solid #eee",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  icon: {
    fontSize: "2rem",
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
