import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateMemorial, getMemorialById } from "../api/memorials";
import PetImageUpload from "../components/PetImageUpload";
import "./NewMemorialPage.css";

import PlanInfoTooltip from "../components/PlanInfoTooltip";

import graveStandard from "../assets/graves/grave-standard.png";
import graveClassic from "../assets/graves/grave-classic.png";
import graveModern from "../assets/graves/grave-modern.png";
import graveNature from "../assets/graves/grave-nature.png";
import graveCelestial from "../assets/graves/grave-celestial.png";
import graveNight from "../assets/graves/grave-night.png";
import graveMonument from "../assets/graves/grave-monument.png";
import graveFlower from "../assets/graves/grave-flower.png";
import graveCandle from "../assets/graves/grave-candle.png";
import graveEternal from "../assets/graves/grave-eternal.png";


/* ======================================================
   EDIT MEMORIAL PAGE
   ====================================================== */

export default function EditMemorialPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    petName: "",
    species: "",
    deathDate: "",
    epitaph: "",
    isPublic: false,
  });

  const [imageUrl, setImageUrl] = useState(null);

  const [epitaphLimit, setEpitaphLimit] = useState(100);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dirty, setDirty] = useState(false);

  /* =========================
     LOAD MEMORIAL
     ========================= */
  useEffect(() => {
    async function load() {
      try {
        const memorial = await getMemorialById(id);

        setForm({
          petName: memorial.petName || "",
          species: memorial.species || "",
          deathDate: memorial.deathDate
            ? memorial.deathDate.slice(0, 10)
            : "",
          epitaph: memorial.epitaph || "",
          isPublic: memorial.isPublic ?? false,
        });

        setImageUrl(memorial.imageUrl || null);

        // limite epitaffio → dal backend (fallback safe)
        setEpitaphLimit(memorial._limits?.maxEpitaphChars ?? 100);
      } catch {
        setError("Errore nel caricamento del memoriale");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  /* =========================
     DIRTY WARNING
     ========================= */
  useEffect(() => {
    function handleBeforeUnload(e) {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  /* =========================
     HANDLERS
     ========================= */
  function handleChange(e) {
    if (saving) return;

    const { name, value, type, checked } = e.target;
    setDirty(true);

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

  async function handleSubmit(e) {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);

    try {
      await updateMemorial(id, {
        ...form,
        imageUrl,
      });

      setSuccess(true);
      setDirty(false);

      setTimeout(() => {
        navigate("/memorials");
      }, 1000);
    } catch (err) {
      setError(err?.message || "Errore durante il salvataggio");
      setSaving(false);
    }
  }

  /* =========================
     STATES
     ========================= */
  if (loading) {
    return <p className="form-loading">Caricamento memoriale…</p>;
  }

  if (error) {
    return <p className="form-error">{error}</p>;
  }

  /* =========================
     RENDER
     ========================= */
  return (
    <div className="create-memorial-container">
      <h1>Modifica memoriale</h1>

      <form className="create-memorial-form" onSubmit={handleSubmit}>
        {/* IMMAGINE */}
        <PetImageUpload
          onUpload={setImageUrl}
          initialImage={imageUrl}
          disabled={saving}
        />

        <div className="form-group">
          <input
            name="petName"
            value={form.petName}
            onChange={handleChange}
            placeholder="Nome del pet"
            required
            disabled={saving}
          />
        </div>

        <div className="form-group">
          <input
            name="species"
            value={form.species}
            onChange={handleChange}
            placeholder="Specie"
            required
            disabled={saving}
          />
        </div>

        <div className="form-group">
          <input
            type="date"
            name="deathDate"
            value={form.deathDate}
            onChange={handleChange}
            required
            disabled={saving}
          />
        </div>

        <div className="form-group">
          <textarea
            name="epitaph"
            value={form.epitaph}
            onChange={handleChange}
            placeholder="Epitaffio"
            required
            disabled={saving}
          />
          <div className="epitaph-meta">
            {form.epitaph.length} / {epitaphLimit} caratteri
          </div>
        </div>

        {/* ===== GALLERIA IMMAGINI ===== */}
        <section className="form-group locked">
          <label>
            Galleria immagini
            <PlanInfoTooltip title="Funzionalità avanzata">
              La galleria immagini è una funzionalità attualmente
              in fase di sviluppo.
            </PlanInfoTooltip>
          </label>

          <p className="locked-text">
            Questa funzionalità non è ancora disponibile.
          </p>
        </section>

        {/* ===== VIDEO ===== */}
        <section className="form-group locked">
          <label>
            Video
            <PlanInfoTooltip title="Funzionalità avanzata">
              I video commemorativi saranno disponibili in futuro.
            </PlanInfoTooltip>
          </label>

          <p className="locked-text">
            Funzionalità avanzata non ancora disponibile.
          </p>
        </section>

        {/* ===== STILE LAPIDE ===== */}
        <div className="form-group">
          <label>
            Stile lapide
            <PlanInfoTooltip title="Funzionalità di base">
              Al momento è disponibile la lapide standard.
              Gli altri stili sono funzionalità avanzate in sviluppo.
            </PlanInfoTooltip>
          </label>

          <div className="grave-grid">
            <div className="grave-card selected">
              <img src={graveStandard} alt="Lapide standard" />
              <span>Standard</span>
            </div>

            <div className="grave-card locked">
              <img src={graveClassic} alt="Lapide classica" />
              <span>Classica</span>
            </div>

            <div className="grave-card locked">
              <img src={graveModern} alt="Lapide moderna" />
              <span>Moderna</span>
            </div>

            <div className="grave-card locked">
              <img src={graveNature} alt="Lapide naturale" />
              <span>Naturale</span>
            </div>

            <div className="grave-card locked">
              <img src={graveCelestial} alt="Lapide celeste" />
              <span>Celeste</span>
            </div>

            <div className="grave-card locked">
              <img src={graveNight} alt="Lapide notturna" />
              <span>Notturna</span>
            </div>

            <div className="grave-card locked">
              <img src={graveMonument} alt="Lapide monumentale" />
              <span>Monumentale</span>
            </div>

            <div className="grave-card locked">
              <img src={graveFlower} alt="Lapide memoriale" />
              <span>Memoriale</span>
            </div>

            <div className="grave-card locked">
              <img src={graveCandle} alt="Lapide ricordo" />
              <span>Ricordo</span>
            </div>

            <div className="grave-card locked">
              <img src={graveEternal} alt="Lapide eterna" />
              <span>Eterna</span>
            </div>
          </div>

          <p className="locked-text">
            Gli stili avanzati saranno disponibili in futuro.
          </p>
        </div>

        {/* ===== VISIBILITÀ ===== */}
        <div className="form-checkbox">
          <input
            type="checkbox"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleChange}
            disabled={saving}
          />
          <span>Memoriale pubblico</span>
        </div>        

        {success && (
          <p className="form-success">
            ✔ Memoriale aggiornato con successo
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className={saving ? "loading" : ""}
        >
          {saving ? "Salvataggio in corso…" : "Salva modifiche"}
        </button>
      </form>
    </div>
  );
}
