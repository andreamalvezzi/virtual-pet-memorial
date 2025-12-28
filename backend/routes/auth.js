import express from "express";
import prisma from "../prisma/client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Credenziali mancanti" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ error: "Credenziali non valide" });
  }

  const passwordOk = await bcrypt.compare(password, user.password);

  if (!passwordOk) {
    return res.status(401).json({ error: "Credenziali non valide" });
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
});
/* ======================================================
   POST /api/auth/register
   ====================================================== */
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e password obbligatorie" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "La password deve avere almeno 6 caratteri" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Utente già registrato" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "USER", // coerente col login JWT
      },
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

export default router;
