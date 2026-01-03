import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateMemorial, getMyMemorials } from "../api/memorials";
import PetImageUpload from "../components/PetImageUpload";
import "./NewMemorialPage.css"; // 🔁 RIUSO

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const memorials = await getMyMemorials();
        const memorial = memorials.find(
          (m) => m.id === Number(id)
        );

        if (!memorial) {
          setError("Memoriale non trovato");
          return;
        }

        setForm({
          petName: memorial.petName,
          species: memorial.species,
          deathDate: memorial.deathDate.slice(0, 10),
          epitaph: memorial.epitaph,
          isPublic: memorial.isPublic,
        });

        setImageUrl(memorial.imageUrl || null);
      } catch {
        setError("Errore caricamento memoriale");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

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

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setDirty(true);
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await updateMemorial(id, {
        ...form,
        imageUrl,
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return <p className="form-loading">Caricamento…</p>;

  if (error)
    return <p className="form-error">{error}</p>;

  return (
    <div className="create-memorial-container">
      <h1>Modifica memoriale</h1>

      <form
        className="create-memorial-form"
        onSubmit={handleSubmit}
      >
        <PetImageUpload onUpload={setImageUrl} />

        <div className="form-group">
          <input
            name="petName"
            value={form.petName}
            onChange={handleChange}
            placeholder="Nome del pet"
            required
          />
        </div>

        <div className="form-group">
          <input
            name="species"
            value={form.species}
            onChange={handleChange}
            placeholder="Specie"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="date"
            name="deathDate"
            value={form.deathDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <textarea
            name="epitaph"
            value={form.epitaph}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-checkbox">
          <input
            type="checkbox"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleChange}
          />
          <span>Memoriale pubblico</span>
        </div>

        {success && (
          <p className="form-success">
            ✔ Memoriale aggiornato con successo
          </p>
        )}

        <button type="submit" disabled={saving}>
          {saving ? "Salvataggio…" : "Salva modifiche"}
        </button>
      </form>
    </div>
  );
}
