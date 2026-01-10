import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  updateMemorial,
  getMemorialById,
} from "../api/memorials";
import PetImageUpload from "../components/PetImageUpload";
import { PLAN_LIMITS } from "../config/plans";
import "./NewMemorialPage.css"; // riuso stile form

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
    plan: "FREE",
  });

  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dirty, setDirty] = useState(false);

  /* =========================
     LOAD MEMORIAL (BY ID)
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
          isPublic: memorial.isPublic,
          plan: memorial.plan || "FREE",
        });

        setImageUrl(memorial.imageUrl || null);
      } catch (err) {
        setError("Errore nel caricamento del memoriale");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  /* =========================
     PLAN LIMITS
     ========================= */
  const epitaphLimit =
    PLAN_LIMITS[form.plan]?.maxEpitaph ?? 100;

  /* =========================
     DIRTY STATE WARNING
     ========================= */
  useEffect(() => {
    function handleBeforeUnload(e) {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
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
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      setError(
        err.message || "Errore durante il salvataggio"
      );
      setSaving(false);
    }
  }

  /* =========================
     STATES
     ========================= */
  if (loading) {
    return (
      <p className="form-loading">
        Caricamento memoriale…
      </p>
    );
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

      <form
        className="create-memorial-form"
        onSubmit={handleSubmit}
      >
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
            {form.epitaph.length} / {epitaphLimit}
          </div>
        </div>

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
          {saving
            ? "Salvataggio in corso… ⏳"
            : "Salva modifiche"}
        </button>
      </form>
    </div>
  );
}
