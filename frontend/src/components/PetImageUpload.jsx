import { useState } from "react";

export default function PetImageUpload({ onUpload }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  setLoading(true);
  setError(null);

  try {
    // 1️⃣ Chiedi la firma al backend
    const sigRes = await fetch("/api/cloudinary/signature");
    if (!sigRes.ok) {
      throw new Error("Errore nel recupero della firma");
    }

    const sigData = await sigRes.json();

    // 2️⃣ Prepara il form per Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", sigData.folder); // 👈 QUI
    formData.append("api_key", sigData.apiKey);
    formData.append("timestamp", sigData.timestamp);
    formData.append("signature", sigData.signature);

    // 3️⃣ Upload signed
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "Upload fallito");
    }

    if (!data.secure_url) {
      throw new Error("secure_url mancante");
    }

    onUpload(data.secure_url);
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
  return (
    <div style={{ marginBottom: "1rem" }}>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {loading && <p>Caricamento immagine…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
