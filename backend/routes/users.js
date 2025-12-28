import express from "express";
import prisma from "../prisma/client.js";
import bcrypt from "bcrypt";

const router = express.Router();

// POST /api/users
router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e password obbligatorie" });
  }

  try {
    // 🔐 Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // ❌ non rimandiamo la password (neanche hash)
    const { password: _, ...userSafe } = user;

    res.status(201).json(userSafe);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Email già registrata" });
    }

    console.error(error);
    res.status(500).json({ error: "Errore server" });
  }
});

export default router;
