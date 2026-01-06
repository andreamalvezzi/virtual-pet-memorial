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
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [videoUrls, setVideoUrls] = useState(["", "", ""]); // 👈 E5
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limits = PLAN_LIMITS[plan];
  const epitaphLimit = limits.maxEpitaph;
  const galleryLimit = limits.maxGalleryImages;
  const videoLimit = limits.maxVideos;

  /* =========================
     FORM HANDLERS
     ========================= */
  function handleChange(e) {
    if (loading) return;

    const { name, value, type, checked } = e.target;

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

  function handleGallerySelect(e) {
    const files = Array.from(e.target.files || []);
    const merged = [...galleryFiles, ...files].slice(0, galleryLimit);
    setGalleryFiles(merged);
  }

  function handleVideoChange(index, value) {
    const next = [...videoUrls];
    next[index] = value;
    setVideoUrls(next);
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
        { ...form, imageUrl }, // galleria e video NON inviati (voluto)
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
      <Helmet>
        <title>Crea un memoriale – Virtual Pet Memorial</title>
        <meta
          name="description"
          content="Crea un memoriale digitale per il tuo animale domestico."
        />
      </Helmet>

      <h1>Crea un memoriale</h1>

      {/* ===== SELEZIONE PIANO ===== */}
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
            <span>Più spazio ai ricordi</span>
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
      </section>

      <form
        className="create-memorial-form"
        onSubmit={handleSubmit}
        aria-busy={loading}
      >
        {/* IMMAGINE PRINCIPALE */}
        <PetImageUpload onUpload={setImageUrl} disabled={loading} />

        {/* DATI BASE */}
        <div className="form-group">
          <label>Nome del pet</label>
          <input
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

        {/* EPITAFFIO */}
        <div className="form-group">
          <label>Epitaffio</label>
          <textarea
            name="epitaph"
            value={form.epitaph}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <div className="epitaph-meta">
            {form.epitaph.length} / {epitaphLimit} caratteri
          </div>
        </div>

        {/* GALLERIA IMMAGINI */}
        <section className="form-group">
          <label>Galleria immagini</label>

          {galleryLimit === 0 ? (
            <p className="locked-text">
              Disponibile con <strong>Medium</strong>
            </p>
          ) : (
            <>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGallerySelect}
                disabled={loading}
              />
              <p className="counter">
                Immagini: {galleryFiles.length} / {galleryLimit}
              </p>

              <div className="gallery-preview">
                {galleryFiles.map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt={`gallery-${idx}`}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* ===== VIDEO (E5) ===== */}
        <section className="form-group">
          <label>Video</label>

          {videoLimit === 0 ? (
            <p className="locked-text">
              Disponibile con <strong>Plus</strong>
            </p>
          ) : (
            <>
              <p className="helper">
                Puoi aggiungere fino a <strong>{videoLimit}</strong> video
                (link)
              </p>

              {videoUrls.slice(0, videoLimit).map((url, index) => (
                <input
                  key={index}
                  type="url"
                  placeholder="Incolla link video (YouTube, Vimeo…) "
                  value={url}
                  onChange={(e) =>
                    handleVideoChange(index, e.target.value)
                  }
                  disabled={loading}
                />
              ))}
            </>
          )}
        </section>

        {/* PUBBLICO */}
        <div className="form-checkbox">
          <input
            type="checkbox"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleChange}
            disabled={loading}
          />
          <label>Memoriale pubblico</label>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creazione in corso…" : "Crea memoriale"}
        </button>
      </form>
    </div>
  );
}
