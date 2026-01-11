import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { createMemorial } from "../api/memorials";
import { getMe } from "../api/users";
import PetImageUpload from "../components/PetImageUpload";
import GalleryImageUpload from "../components/GalleryImageUpload";
import PlanInfoTooltip from "../components/PlanInfoTooltip";
import "./NewMemorialPage.css";

export default function NewMemorialPage() {
  const navigate = useNavigate();

  const [me, setMe] = useState(null);
  const [loadingMe, setLoadingMe] = useState(true);

  const [form, setForm] = useState({
    petName: "",
    species: "",
    deathDate: "",
    epitaph: "",
    isPublic: true,
    graveStyleKey: "classic",
  });

  const [imageUrl, setImageUrl] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [videoUrls, setVideoUrls] = useState(["", "", ""]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* =========================
     LOAD ACCOUNT INFO
     ========================= */
  useEffect(() => {
    async function load() {
     setLoadingMe(true);
      try {
        const data = await getMe();
        setMe(data);
     } catch {
       setMe(null);
     } finally {
       setLoadingMe(false);
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (me && me.emailVerified) {
      // account aggiornato correttamente
      setError(null);
    }
  }, [me]);



  const limits = me?.limits;
  const plan = me?.plan;

  /* =========================
     EPITAPH (CHAR COUNT)
     ========================= */
  const epitaphCount = useMemo(
    () => form.epitaph.length,
    [form.epitaph]
  );

  const epitaphLimit = limits?.maxEpitaphWords ?? 100; // ora = caratteri

  const maxImagesTotal = limits?.maxImagesPerMemorial ?? 1;
  const maxVideos = limits?.maxVideosPerMemorial ?? 0;

  const coverCount = imageUrl ? 1 : 0;
  const maxGalleryRemaining = Math.max(maxImagesTotal - coverCount, 0);

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

  function handleVideoChange(index, value) {
    if (maxVideos === 0 || loading) return;
    const next = [...videoUrls];
    next[index] = value;
    setVideoUrls(next);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setError(null);

    if (!me) {
      setError("Sessione non valida. Effettua di nuovo il login.");
      return;
    }

    if (!me.emailVerified) {
      setError("Devi verificare la tua email prima di creare un memoriale.");
      return;
    }

    if (epitaphCount > epitaphLimit) {
      setError(
        `Epitaffio troppo lungo: max ${epitaphLimit} caratteri per il piano ${plan}.`
      );
      return;
    }

    const totalImages =
      (imageUrl ? 1 : 0) + (galleryImages?.length || 0);

    if (totalImages > maxImagesTotal) {
      setError(
        `Troppe immagini: max ${maxImagesTotal} per memoriale (cover inclusa).`
      );
      return;
    }

    const videosClean = videoUrls
      .map((v) => v.trim())
      .filter(Boolean);

    if (videosClean.length > maxVideos) {
      setError(`Troppi video: max ${maxVideos} per memoriale.`);
      return;
    }

    setLoading(true);

    try {
      const memorial = await createMemorial({
        petName: form.petName,
        species: form.species,
        deathDate: form.deathDate,
        epitaph: form.epitaph,
        isPublic: form.isPublic,
        imageUrl,
        graveStyleKey: form.graveStyleKey,
        galleryImages,
        videoUrls: videosClean,
      });

      navigate(`/memorials/${memorial.slug}`);
    } catch (err) {
  const msg = err?.message || "";

  if (
    msg.includes("limite") ||
    msg.includes("FREE") ||
    msg.includes("memoriali")
  ) {
    setError(
      "⚠️ Il tuo piano FREE consente un solo memoriale.\n\n" +
      "Se desideri creare altri spazi per ricordare i tuoi animali, " +
      "i piani Plus e Premium ti permettono di custodire più ricordi " +
      "e arricchirli nel tempo."
      );
    } else {
      setError(
        "Errore durante la creazione del memoriale. Riprova più tardi."
      );
    }

    setLoading(false);
    }
  }

  /* =========================
     STATES
     ========================= */
  if (loadingMe) {
    return <p className="dashboard-loading">Caricamento…</p>;
  }

  if (!me) {
    return (
      <p className="dashboard-error">
        Impossibile caricare i dati account. Fai login e riprova.
      </p>
    );
  }

  const planTitle =
    plan === "FREE"
      ? "Piano FREE – 0€"
      : plan === "MEDIUM"
      ? "Piano MEDIUM – 2,99€ / memoriale"
      : "Piano PLUS – 5,99€ / memoriale";

  const planText =
    plan === "FREE"
      ? "1 memoriale, 1 foto (cover), lapide standard, epitaffio fino a 100 caratteri."
      : plan === "MEDIUM"
      ? "Fino a 3 memoriali, 5 immagini per memoriale, 6 lapidi, epitaffio fino a 300 caratteri."
      : "Fino a 6 memoriali, 10 immagini per memoriale, 3 video, tutte le lapidi, epitaffio fino a 1000 caratteri.";

  /* =========================
     RENDER
     ========================= */
  return (
    <div className="create-memorial-container" aria-busy={loading}>
      <Helmet>
        <title>Crea un memoriale – Virtual Pet Memorial</title>
      </Helmet>

      <h1>
        Crea un memoriale
        <PlanInfoTooltip title={planTitle}>
          {planText}
        </PlanInfoTooltip>
      </h1>

      {!me.emailVerified && (
        <p className="form-error">
          ⚠️ Email non verificata. Verifica l’email per creare memoriali.
        </p>
      )}

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
            {epitaphCount} / {epitaphLimit} caratteri
          </div>
        </div>

        {/* GALLERIA */}
        <section
          className={`form-group ${
            maxGalleryRemaining === 0 ? "locked" : ""
          }`}
        >
          <label>
            Galleria immagini
            <PlanInfoTooltip title={planTitle}>
              Immagini totali per memoriale (cover inclusa):{" "}
              {maxImagesTotal}.
            </PlanInfoTooltip>
          </label>

          {maxGalleryRemaining === 0 ? (
            <p className="locked-text">
              Non puoi aggiungere immagini extra con il tuo piano.
            </p>
          ) : (
            <GalleryImageUpload
              maxImages={maxGalleryRemaining}
              onChange={setGalleryImages}
              disabled={loading}
            />
          )}
        </section>

        {/* VIDEO */}
        <section
          className={`form-group ${maxVideos === 0 ? "locked" : ""}`}
        >
          <label>Video</label>

          {maxVideos === 0 ? (
            <p className="locked-text">Disponibile con Plus</p>
          ) : (
            videoUrls.slice(0, maxVideos).map((url, i) => (
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

        {/* LAPIDE */}
        <div className="form-group">
          <label>Stile lapide (test)</label>
          <input
            name="graveStyleKey"
            value={form.graveStyleKey}
            onChange={handleChange}
            disabled={loading}
          />
          <small>
            Per ora è un input di test: poi lo trasformiamo in
            selettore con card.
          </small>
        </div>

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

        <button
          type="submit"
          disabled={loading || !me.emailVerified}
        >
          {loading ? "Creazione in corso…" : "Crea memoriale"}
        </button>
      </form>
    </div>
  );
}
