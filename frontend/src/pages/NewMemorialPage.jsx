import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { createMemorial } from "../api/memorials";
import PetImageUpload from "../components/PetImageUpload";
import "./NewMemorialPage.css";
import { PLAN, PLAN_LIMITS } from "../config/plans";

/* ======================================================
   NEW MEMORIAL PAGE
   ====================================================== */

const GRAVE_STYLES = [
  { id: "classic", label: "Classica", tier: "DEFAULT" },
  { id: "simple", label: "Semplice", tier: "MEDIUM" },
  { id: "heart", label: "Cuore", tier: "MEDIUM" },
  { id: "stone", label: "Pietra", tier: "MEDIUM" },
  { id: "modern", label: "Moderna", tier: "MEDIUM" },
  { id: "angel", label: "Ali", tier: "PLUS" },
  { id: "gold", label: "Dorata", tier: "PLUS" },
  { id: "nature", label: "Natura", tier: "PLUS" },
];

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
  const [graveStyle, setGraveStyle] = useState("classic");
  const [imageUrl, setImageUrl] = useState(null);

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [videoUrls, setVideoUrls] = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limits = PLAN_LIMITS[plan];
  const epitaphLimit = limits.maxEpitaph;
  const galleryLimit = limits.maxGalleryImages;
  const videoLimit = limits.maxVideos;

  /* =========================
     F1 — Gallery preview cleanup
     ========================= */
  useEffect(() => {
    if (!galleryFiles.length) {
      setGalleryPreviews([]);
      return;
    }

    const previews = galleryFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setGalleryPreviews(previews);

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [galleryFiles]);

  function canUseStyle(tier) {
    if (plan === PLAN.PLUS) return true;
    if (plan === PLAN.MEDIUM) return tier !== "PLUS";
    return tier === "DEFAULT";
  }

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
    if (galleryLimit === 0 || loading) return;

    const files = Array.from(e.target.files || []);
    setGalleryFiles((prev) =>
      [...prev, ...files].slice(0, galleryLimit)
    );
  }

  function handleVideoChange(index, value) {
    if (videoLimit === 0 || loading) return;

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
        { ...form, imageUrl },
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
    <div
      className="create-memorial-container"
      aria-busy={loading}
    >
      <Helmet>
        <title>Crea un memoriale – Virtual Pet Memorial</title>
      </Helmet>

      <h1>Crea un memoriale</h1>

      {/* ===== PIANO ===== */}
      <section className="plan-selector">
        <h2>Piano memoriale</h2>
        <div className="plan-options">
          {[PLAN.FREE, PLAN.MEDIUM, PLAN.PLUS].map((p) => (
            <button
              key={p}
              type="button"
              className={plan === p ? "active" : ""}
              onClick={() => setPlan(p)}
              disabled={loading}
              aria-disabled={loading}
            >
              <strong>{p}</strong>
            </button>
          ))}
        </div>
      </section>

      <form
        className="create-memorial-form"
        onSubmit={handleSubmit}
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

        {/* GALLERIA */}
        <section
          className={`form-group ${
            galleryLimit === 0 ? "locked" : ""
          }`}
        >
          <label>Galleria immagini</label>

          {galleryLimit === 0 ? (
            <p className="locked-text">
              Disponibile con piano <strong>Medium</strong>
            </p>
          ) : (
            <>
              <input
                type="file"
                multiple
                onChange={handleGallerySelect}
                disabled={loading}
              />

              {galleryFiles.length === 0 ? (
                <p className="empty-text">
                  Puoi aggiungere fino a{" "}
                  <strong>{galleryLimit}</strong> immagini.
                </p>
              ) : (
                <>
                  <p>
                    {galleryFiles.length} / {galleryLimit} immagini
                  </p>
                  <div className="gallery-preview">
                    {galleryPreviews.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`gallery-${idx}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </section>

        {/* VIDEO */}
        <section
          className={`form-group ${
            videoLimit === 0 ? "locked" : ""
          }`}
        >
          <label>Video</label>

          {videoLimit === 0 ? (
            <p className="locked-text">
              Disponibile con piano <strong>Plus</strong>
            </p>
          ) : (
            <>
              {videoUrls.slice(0, videoLimit).every((v) => !v) && (
                <p className="empty-text">
                  Puoi aggiungere fino a{" "}
                  <strong>{videoLimit}</strong> video tramite link.
                </p>
              )}

              {videoUrls.slice(0, videoLimit).map((url, i) => (
                <input
                  key={i}
                  type="url"
                  value={url}
                  placeholder="Link video"
                  onChange={(e) =>
                    handleVideoChange(i, e.target.value)
                  }
                  disabled={loading}
                />
              ))}
            </>
          )}
        </section>

        {/* STILE LAPIDE */}
        <section className="form-group">
          <label>Stile della lapide</label>

          <div className="grave-grid">
            {GRAVE_STYLES.map((style) => {
              const locked = !canUseStyle(style.tier);

              return (
                <button
                  key={style.id}
                  type="button"
                  className={`grave-card ${
                    graveStyle === style.id ? "selected" : ""
                  } ${locked ? "locked" : ""}`}
                  onClick={() => !locked && setGraveStyle(style.id)}
                  disabled={locked || loading}
                  aria-disabled={locked}
                >
                  <div className="grave-preview" />
                  <span>{style.label}</span>
                  {locked && (
                    <span className="badge">
                      {style.tier === "PLUS" ? "Plus" : "Medium"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
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
