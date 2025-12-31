import { useState, useEffect } from "react";

export default function PetImageUpload({ onUpload }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    // 👉 PREVIEW IMMEDIATA
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

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
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
  <div style={{ marginBottom: "1rem" }}>
    {/* PREVIEW */}
    {previewUrl ? (
      <div style={{ position: "relative", marginBottom: 10 }}>
        <img
          src={previewUrl}
          alt="Anteprima pet"
          style={{
            width: "100%",
            maxHeight: 250,
            objectFit: "cover",
            borderRadius: 8,
            opacity: loading ? 0.6 : 1,
          }}
        />

        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              background: "rgba(255,255,255,0.4)",
            }}
          >
            Caricamento…
          </div>
        )}
      </div>
    ) : (
      <div
        style={{
          height: 250,
          background: "#f3f4f6",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666",
          marginBottom: 10,
        }}
      >
        Nessuna immagine selezionata
      </div>
    )}

    <input type="file" accept="image/*" onChange={handleFileChange} />

    {error && <p style={{ color: "red" }}>{error}</p>}
  </div>
);
}
