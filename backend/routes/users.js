import express from "express";
import prisma from "../prisma/client.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { PLAN_LIMITS, PLAN_PRICES, normalizePlan } from "../utils/limits.js";

const router = express.Router();

// GET /api/users/me
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const plan = normalizePlan(req.user.plan);
    const limits = PLAN_LIMITS[plan];
    const price = PLAN_PRICES[plan];

    const memorialCount = await prisma.memorial.count({
      where: { userId: req.user.userId },
    });

    res.json({
      id: req.user.userId,
      email: req.user.email,
      plan,
      emailVerified: req.user.emailVerified,
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

export default router;
