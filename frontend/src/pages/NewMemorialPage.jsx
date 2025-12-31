import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMemorial } from "../api/memorials";
import PetImageUpload from "../components/PetImageUpload"; // 👈 AGGIUNTO

export default function NewMemorialPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    petName: "",
    species: "",
    deathDate: "",
    epitaph: "",
    isPublic: true,
  });

  const [imageUrl, setImageUrl] = useState(null); // 👈 AGGIUNTO
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Devi essere autenticato per creare un memoriale");
      return;
    }

    try {
      setLoading(true);

      const memorial = await createMemorial(
        {
          ...form,
          imageUrl, // 👈 AGGIUNTO
        },
        token
      );

      navigate(`/memorials/${memorial.slug}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "40px auto" }}>
      <h1>Crea un memoriale</h1>

      <form onSubmit={handleSubmit}>
        {/* UPLOAD IMMAGINE */}
        <PetImageUpload onUpload={setImageUrl} />

        <div>
          <label>Nome del pet</label>
          <input
            type="text"
            name="petName"
            value={form.petName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Specie</label>
          <input
            type="text"
            name="species"
            value={form.species}
            onChange={handleChange}
            placeholder="Cane, Gatto, Coniglio..."
            required
          />
        </div>

        <div>
          <label>Data di scomparsa</label>
          <input
            type="date"
            name="deathDate"
            value={form.deathDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Epitaffio</label>
          <textarea
            name="epitaph"
            value={form.epitaph}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>
            <input
              type="checkbox"
              name="isPublic"
              checked={form.isPublic}
              onChange={handleChange}
            />{" "}
            Memoriale pubblico
          </label>
        </div>

        {error && (
          <p style={{ color: "red", marginTop: 10 }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: 20 }}
        >
          {loading ? "Salvataggio..." : "Crea memoriale"}
        </button>
      </form>
    </div>
  );
}
