import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { createMemorial } from "../api/memorials";
import PetImageUpload from "../components/PetImageUpload";
import "./NewMemorialPage.css";
import { PLAN, PLAN_LIMITS } from "../config/plans";

/* ======================================================
   NEW MEMORIAL PAGE
   ====================================================== */

export default function NewMemorialPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    petName: "",
    species: "",
    deathDate: "",
    epitaph: "",
    isPublic: true,
  });

  const [plan, setPlan] = useState(PLAN.FREE);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const epitaphLimit = PLAN_LIMITS[plan].maxEpitaph;

  /* =========================
     FORM HANDLERS
     ========================= */
  function handleChange(e) {
    if (loading) return;

    const { name, value, type, checked } = e.target;

    // Epitaffio: clamp per piano
    if (name === "epitaph") {
      setForm((prev) => ({
        ...prev,
        epitaph: value.slice(0, epitaphLimit),
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  /* =========================
     SUBMIT
     ========================= */
  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Devi essere autenticato per creare un memoriale.");
      setLoading(false);
      return;
    }

    try {
      const memorial = await createMemorial(
        { ...form, imageUrl }, // plan NON inviato (voluto)
        token
      );

      navigate(`/memorials/${memorial.slug}`);
    } catch (err) {
      setError(
        err?.message ||
          "Errore durante la creazione del memoriale. Riprova."
      );
      setLoading(false);
    }
  }

  /* =========================
     RENDER
     ========================= */
  return (
    <div className="create-memorial-container">
      {/* ===== SEO (pagina privata) ===== */}
      <Helmet>
        <title>Crea un memoriale – Virtual Pet Memorial</title>
        <meta
          name="description"
          content="Crea un memoriale digitale per il tuo animale domestico. Inserisci una foto, una dedica e scegli se renderlo pubblico."
        />
      </Helmet>

      <h1>Crea un memoriale</h1>

      {/* ===== SELEZIONE PIANO (frontend-only) ===== */}
      <section className="plan-selector">
        <h2>Piano memoriale</h2>

        <div className="plan-options">
          <button
            type="button"
            className={plan === PLAN.FREE ? "active" : ""}
            onClick={() => setPlan(PLAN.FREE)}
          >
            <strong>Free</strong>
            <span>Essenziale e sobrio</span>
          </button>

          <button
            type="button"
            className={plan === PLAN.MEDIUM ? "active" : ""}
            onClick={() => setPlan(PLAN.MEDIUM)}
          >
            <strong>Medium</strong>
            <span>Più spazio per immagini e parole</span>
          </button>

          <button
            type="button"
            className={plan === PLAN.PLUS ? "active" : ""}
            onClick={() => setPlan(PLAN.PLUS)}
          >
            <strong>Plus</strong>
            <span>Memoriale completo</span>
          </button>
        </div>

        <p className="plan-helper">
          {plan === PLAN.FREE && "Un memoriale semplice e rispettoso."}
          {plan === PLAN.MEDIUM && "Ideale per raccontare di più con immagini."}
          {plan === PLAN.PLUS && "Per conservare tutti i ricordi, anche video."}
        </p>
      </section>

      <form
        className="create-memorial-form"
        onSubmit={handleSubmit}
        aria-busy={loading}
      >
        {/* IMMAGINE PRINCIPALE */}
        <PetImageUpload onUpload={setImageUrl} disabled={loading} />

        <div className="form-group">
          <label htmlFor="petName">Nome del pet</label>
          <input
            id="petName"
            type="text"
            name="petName"
            value={form.petName}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="species">Specie</label>
          <input
            id="species"
            type="text"
            name="species"
            value={form.species}
            onChange={handleChange}
            placeholder="Cane, Gatto, Coniglio..."
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="deathDate">Data di scomparsa</label>
          <input
            id="deathDate"
            type="date"
            name="deathDate"
            value={form.deathDate}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        {/* ===== EPITAFIO (E3) ===== */}
        <div className="form-group">
          <label htmlFor="epitaph">Epitaffio</label>
          <textarea
            id="epitaph"
            name="epitaph"
            value={form.epitaph}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <div className="epitaph-meta">
            <span>
              {form.epitaph.length} / {epitaphLimit} caratteri
            </span>

            {plan === PLAN.FREE && form.epitaph.length >= 80 && (
              <span className="epitaph-hint">
                Con <strong>Medium</strong> puoi scrivere molto di più 🐾
              </span>
            )}

            {plan === PLAN.MEDIUM && form.epitaph.length >= 420 && (
              <span className="epitaph-hint">
                Con <strong>Plus</strong> puoi raccontare tutta la sua storia
              </span>
            )}

            {plan === PLAN.PLUS && (
              <span className="epitaph-hint">
                Hai tutto lo spazio necessario
              </span>
            )}
          </div>
        </div>

        <div className="form-checkbox">
          <input
            id="isPublic"
            type="checkbox"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleChange}
            disabled={loading}
          />
          <label htmlFor="isPublic">Memoriale pubblico</label>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={loading ? "loading" : ""}
        >
          {loading ? "Creazione in corso…" : "Crea memoriale"}
        </button>
      </form>
    </div>
  );
}
