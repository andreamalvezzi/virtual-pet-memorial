import { useState, useEffect } from "react";
import "./PetImageUpload.css";

export default function PetImageUpload({ onUpload, initialImage }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialImage || null);
  const [isLocalPreview, setIsLocalPreview] = useState(false);

  /* =========================
     HANDLE FILE CHANGE
     ========================= */
  async function handleFileChange(e) {
    if (loading) return;

    const file = e.target.files[0];
    if (!file) return;

    // 👉 preview locale immediata
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    setIsLocalPreview(true);

    setLoading(true);
    setError(null);

    try {
      // 1️⃣ firma Cloudinary
      const sigRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/cloudinary/signature`
      );

      if (!sigRes.ok) {
        throw new Error("Errore nel recupero della firma");
      }

      const sigData = await sigRes.json();

      // 2️⃣ upload signed
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", sigData.folder);
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", sigData.timestamp);
      formData.append("signature", sigData.signature);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok || !data.secure_url) {
        throw new Error(data.error?.message || "Upload fallito");
      }

      // 3️⃣ notifica parent
      onUpload(data.secure_url);
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      setError(err.message || "Errore upload immagine");
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     SYNC INITIAL IMAGE (EDIT)
     ========================= */
  useEffect(() => {
    if (initialImage) {
      setPreviewUrl(initialImage);
      setIsLocalPreview(false);
    }
  }, [initialImage]);

  /* =========================
     CLEANUP OBJECT URL
     ========================= */
  useEffect(() => {
    return () => {
      if (previewUrl && isLocalPreview) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, isLocalPreview]);

  /* =========================
     RENDER
     ========================= */
  return (
    <div className="pet-upload">
      {previewUrl ? (
        <div className="pet-upload-preview">
          <img
            src={previewUrl}
            alt="Anteprima pet"
            className={loading ? "loading" : ""}
          />

          {loading && (
            <div className="pet-upload-overlay">
              Caricamento…
            </div>
          )}
        </div>
      ) : (
        <div className="pet-upload-placeholder">
          Nessuna immagine selezionata
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
      />

      {error && (
        <p className="pet-upload-error">{error}</p>
      )}
    </div>
  );
}
