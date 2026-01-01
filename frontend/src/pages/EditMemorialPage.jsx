import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateMemorial, getMyMemorials } from "../api/memorials";
import PetImageUpload from "../components/PetImageUpload";

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
        const memorial = memorials.find((m) => m.id === Number(id));

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
      } catch (err) {
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

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
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

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
      <h1>Modifica memoriale</h1>

      <form onSubmit={handleSubmit}>
        {/* IMMAGINE ATTUALE + UPLOAD */}
        <PetImageUpload onUpload={setImageUrl} />

        <input
          name="petName"
          value={form.petName}
          onChange={handleChange}
          placeholder="Nome del pet"
          required
        />

        <input
          name="species"
          value={form.species}
          onChange={handleChange}
          placeholder="Specie"
          required
        />

        <input
          type="date"
          name="deathDate"
          value={form.deathDate}
          onChange={handleChange}
          required
        />

        <textarea
          name="epitaph"
          value={form.epitaph}
          onChange={handleChange}
          required
        />

        <label style={{ display: "block", marginTop: 10 }}>
          <input
            type="checkbox"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleChange}
          />{" "}
          Memoriale pubblico
        </label>

        {/* MESSAGGIO SUCCESSO */}
        {success && (
          <p style={{ color: "green", marginTop: 10 }}>
            ✔ Memoriale aggiornato con successo
          </p>
        )}

        <button type="submit" disabled={saving} style={{ marginTop: 20 }}>
          {saving ? "Salvataggio…" : "Salva modifiche"}
        </button>
      </form>
    </div>
  );
}
