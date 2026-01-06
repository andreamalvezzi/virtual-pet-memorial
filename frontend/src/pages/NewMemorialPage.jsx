import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { createMemorial } from "../api/memorials";
import PetImageUpload from "../components/PetImageUpload";
import "./NewMemorialPage.css";
import { PLAN, PLAN_LIMITS } from "../config/plans";
import GalleryImageUpload from "../components/GalleryImageUpload";


/* ======================================================
   NEW MEMORIAL PAGE — G3
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

  const [galleryImages, setGalleryImages] = useState([]);

  const [videoUrls, setVideoUrls] = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limits = PLAN_LIMITS[plan];
  const epitaphLimit = limits.maxEpitaph;
  const galleryLimit = limits.maxGalleryImages;
  const videoLimit = limits.maxVideos;

  /* =========================
     G3.1 — preview gallery
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
    if (tier === "DEFAULT") return true;
    if (tier === "MEDIUM") return plan !== PLAN.FREE;
    if (tier === "PLUS") return plan === PLAN.PLUS;
    return false;
  }


  /* =========================
     HANDLERS
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
     SUBMIT — G3
     ========================= */
  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const memorial = await createMemorial({
        ...form,
        imageUrl,

        // ===== G3: ORA REALI =====
        plan,
        graveStyle,

        // TODO: galleryFiles devono essere uploadati (Cloudinary) prima del submit

        galleryImages: galleryFiles.map((f) => f.secure_url).filter(Boolean),
        videoUrls: videoUrls.filter(Boolean),
      });

      navigate(`/memorials/${memorial.slug}`);
    } catch (err) {
      setError(
        err?.message ||
          "Errore durante la creazione del memoriale."
      );
      setLoading(false);
    }
  }

  /* =========================
     RENDER
     ========================= */
  return (
    <div className="create-memorial-container" aria-busy={loading}>
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
            >
              <strong>{p}</strong>
            </button>
          ))}
        </div>
      </section>

      <form className="create-memorial-form" onSubmit={handleSubmit}>
        <PetImageUpload onUpload={setImageUrl} disabled={loading} />

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
          <div className="epitaph-meta">
            {form.epitaph.length} / {epitaphLimit}
          </div>
        </div>

        {/* ===== GALLERIA ===== */}
        <section className={`form-group ${galleryLimit === 0 ? "locked" : ""}`}>
          <label>Galleria immagini</label>

          {galleryLimit === 0 ? (
            <p className="locked-text">Disponibile con Plus</p>
          ) : (
            <GalleryImageUpload
              maxImages={galleryLimit}
              onChange={setGalleryImages}
              disabled={loading}
            />
          )}
        </section>

        {/* ===== VIDEO ===== */}
        <section className={`form-group ${videoLimit === 0 ? "locked" : ""}`}>
          <label>Video</label>

          {videoLimit === 0 ? (
            <p className="locked-text">Disponibile con Plus</p>
          ) : (
            videoUrls.slice(0, videoLimit).map((url, i) => (
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
            ))
          )}
        </section>

        {/* ===== STILE LAPIDE ===== */}
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
                >
                  <span>{style.label}</span>
                </button>
              );
            })}
          </div>
        </section>

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
