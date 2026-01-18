import express from "express";
import prisma from "../prisma/client.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { PLAN_LIMITS, PLAN_PRICES, normalizePlan } from "../utils/limits.js";

const router = express.Router();

// GET /api/users/me
router.get("/me", authenticateToken, async (req, res) => {
  try {
    // 🔑 carica SEMPRE l'utente dal DB
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "Utente non trovato" });
    }

    const plan = normalizePlan(user.plan);
    const limits = PLAN_LIMITS[plan];
    const price = PLAN_PRICES[plan];

    const memorialCount = await prisma.memorial.count({
      where: { userId: user.id },
    });

    res.json({
      id: user.id,
      email: user.email,
      plan,
      emailVerified: user.emailVerified,
      price,
      limits,
      usage: {
        memorialsUsed: memorialCount,
      },
    });
  } catch (err) {
    console.error("ME ERROR:", err);
    res.status(500).json({ error: "Errore server" });
  }
});

// DELETE /api/users/me
// Elimina definitivamente account + memoriali (GDPR)
router.delete("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    await prisma.$transaction([
      prisma.memorial.deleteMany({
        where: { userId },
      }),
      prisma.user.delete({
        where: { id: userId },
      }),
    ]);

    // GDPR: nessun contenuto restituito
    return res.status(204).send();
  } catch (err) {
    console.error("DELETE ACCOUNT ERROR:", err);
    return res
      .status(500)
      .json({ error: "Errore durante l’eliminazione dell’account" });
  }
});


export default router;
