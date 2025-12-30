import express from "express";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// usa automaticamente CLOUDINARY_URL
cloudinary.config(process.env.CLOUDINARY_URL);

router.get("/signature", (req, res) => {
  const timestamp = Math.round(Date.now() / 1000);

  const paramsToSign = {
    timestamp,
    folder: "pets",
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    cloudinary.config().api_secret
  );

  res.json({
    timestamp,
    signature,
    folder: "pets",
    cloudName: cloudinary.config().cloud_name,
    apiKey: cloudinary.config().api_key,
  });
});

export default router;
