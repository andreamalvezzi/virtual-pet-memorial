import express from "express";
import prisma from "../prisma/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const router = express.Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(email || "").trim());
}

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Credenziali mancanti" });
  }

  const user = await prisma.user.findUnique({
    where: { email: String(email).trim().toLowerCase() },
  });

  if (!user) {
    return res.status(401).json({ error: "Credenziali non valide" });
  }

  const passwordOk = await bcrypt.compare(password, user.password);
  if (!passwordOk) {
    return res.status(401).json({ error: "Credenziali non valide" });
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      plan: user.plan,
      emailVerified: user.emailVerified,
    },
  });
});

/* ======================================================
   POST /api/auth/register
   ====================================================== */
router.post("/register", async (req, res) => {
  try {
    const emailRaw = String(req.body.email || "");
    const email = emailRaw.trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e password obbligatorie" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Formato email non valido" });
    }

    if (String(password).length < 6) {
      return res
        .status(400)
        .json({ error: "La password deve avere almeno 6 caratteri" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Utente già registrato" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verifyToken = crypto.randomBytes(24).toString("hex");
    const verifyExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        plan: "FREE",
        emailVerified: false,
        emailVerifyToken: verifyToken,
        emailVerifyExpiry: verifyExpiry,
      },
    });

    const baseUrl =
      process.env.FRONTEND_BASE_URL || "http://localhost:5173";
    const verifyUrl = `${baseUrl}/#/verify-email?token=${verifyToken}`;

    res.status(201).json({
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      plan: user.plan,
      verifyUrl,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

/* ======================================================
   GET /api/auth/verify?token=...
   ====================================================== */
router.get("/verify", async (req, res) => {
  try {
    const token = String(req.query.token || "");
    console.log("🔍 VERIFY TOKEN RECEIVED:", token);

    if (!token) {
      return res.status(400).json({ error: "Token mancante" });
    }

    const user = await prisma.user.findFirst({
      where: {
        emailVerifyToken: token,
        emailVerifyExpiry: { gt: new Date() },
      },
    });

    console.log("🔍 VERIFY USER FOUND:", user);

    if (!user) {
      return res.status(400).json({ error: "Token non valido o scaduto" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifyToken: null,
        emailVerifyExpiry: null,
      },
    });

    console.log("✅ EMAIL VERIFIED FOR USER ID:", user.id);

    res.json({ message: "Email verificata con successo" });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
});


export default router;

