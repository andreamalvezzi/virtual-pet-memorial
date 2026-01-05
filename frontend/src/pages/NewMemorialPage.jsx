import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMemorial } from "../api/memorials";
import PetImageUpload from "../components/PetImageUpload";
import "./NewMemorialPage.css";

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

  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* =========================
     FORM HANDLERS
     ========================= */
  function handleChange(e) {
    if (loading) return; // 🔒 blocca modifiche durante submit

    const { name, value, type, checked } = e.target;

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

    if (loading) return; // 🔒 guard doppio submit

    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Devi essere autenticato per creare un memoriale");
      return;
    }

    try {
      setLoading(true);

      const memorial = await createMemorial(
        { ...form, imageUrl },
        token
      );

      navigate(`/memorials/${memorial.slug}`);
    } catch (err) {
      setError(err.message || "Errore durante la creazione del memoriale");
      setLoading(false);
    }
  }

  /* =========================
     RENDER
     ========================= */
  return (
    <div className="create-memorial-container">
      <h1>Crea un memoriale</h1>

      <form
        className="create-memorial-form"
        onSubmit={handleSubmit}
      >
        {/* IMMAGINE */}
        <PetImageUpload
          onUpload={setImageUrl}
          disabled={loading}
        />

        <div className="form-group">
          <label>Nome del pet</label>
          <input
            type="text"
            name="petName"
            value={form.petName}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Specie</label>
          <input
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
          <label>Data di scomparsa</label>
          <input
            type="date"
            name="deathDate"
            value={form.deathDate}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Epitaffio</label>
          <textarea
            name="epitaph"
            value={form.epitaph}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-checkbox">
          <input
            type="checkbox"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleChange}
            disabled={loading}
          />
          <span>Memoriale pubblico</span>
        </div>

        {error && (
          <p className="form-error">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={loading ? "loading" : ""}
        >
          {loading
            ? "Creazione in corso… ⏳"
            : "Crea memoriale"}
        </button>
      </form>
    </div>
  );
}
