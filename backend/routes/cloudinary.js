import express from "express";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

/* ======================================================
   CLOUDINARY CONFIG
   ====================================================== */
// Usa CLOUDINARY_URL se presente
if (process.env.CLOUDINARY_URL) {
  cloudinary.config(process.env.CLOUDINARY_URL);
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/* ======================================================
   POST /api/cloudinary/signature
   ====================================================== */
router.post("/signature", (req, res) => {
  try {
    const cfg = cloudinary.config();

    if (!cfg.api_secret || !cfg.api_key || !cfg.cloud_name) {
      return res.status(500).json({
        error: "Configurazione Cloudinary mancante",
      });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "pets";

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      cfg.api_secret
    );

    res.json({
      timestamp,
      signature,
      folder,
      cloudName: cfg.cloud_name,
      apiKey: cfg.api_key,
    });
  } catch (err) {
    console.error("CLOUDINARY SIGNATURE ERROR:", err);
    res.status(500).json({ error: "Errore firma Cloudinary" });
  }
});

export default router;
