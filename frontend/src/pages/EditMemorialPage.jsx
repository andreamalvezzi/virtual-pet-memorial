import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateMemorial, getMyMemorials } from "../api/memorials";

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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        // riusiamo i dati già dell’utente
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
      } catch (err) {
        setError("Errore caricamento memoriale");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await updateMemorial(id, form);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p>Caricamento...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h1>Modifica memoriale</h1>

      <form onSubmit={handleSubmit}>
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

        <label>
          <input
            type="checkbox"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleChange}
          />
          Memoriale pubblico
        </label>

        <button type="submit">Salva modifiche</button>
      </form>
    </div>
  );
}
