import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { createMemorial } from "../api/memorials";
import { getMe } from "../api/users";
import PetImageUpload from "../components/PetImageUpload";
import GalleryImageUpload from "../components/GalleryImageUpload";
import PlanInfoTooltip from "../components/PlanInfoTooltip";
import "./NewMemorialPage.css";

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

  if (msg.includes("limite") || msg.includes("memoriali")) {
    setError(
      "⚠️ Al momento è possibile creare un solo memoriale con le funzionalità di base.\n\n" +
      "Se desideri creare altri spazi o utilizzare funzionalità avanzate, " +
      "puoi contattarci per maggiori informazioni."
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
        <PlanInfoTooltip title="Funzionalità di base">
          La creazione del memoriale include un’immagine di copertina,
          lapide standard ed epitaffio breve.
          <br />
          Alcune funzionalità avanzate sono attualmente in sviluppo.
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

        {/* GALLERIA IMMAGINI */}
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

        {/* VIDEO */}
        <section
          className={`form-group ${maxVideos === 0 ? "locked" : ""}`}
        >
          <label>
            Video
            <PlanInfoTooltip title="Funzionalità avanzata">
              I video commemorativi saranno 
              disponibili in futuro.              
            </PlanInfoTooltip>            
          </label>

          {maxVideos === 0 ? (
            <p className="locked-text">Questa funzionalità non è ancora disponibile.</p>
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

        {/* VISIBILITÀ */}
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
