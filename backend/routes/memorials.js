import express from "express";
import prisma from "../prisma/client.js";
import slugify from "slugify";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

function generateSlug(petName, deathDate) {
  const year = new Date(deathDate).getFullYear();
  const random = Math.random().toString(36).substring(2, 6);
  return `${slugify(petName, { lower: true })}-${year}-${random}`;
}
/* ======================================================
   POST /api/memorials (creazione)
   ====================================================== */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { petName, species, deathDate, epitaph, isPublic = false } = req.body;

    if (!petName || !species || !deathDate || !epitaph) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const slug = generateSlug(petName, deathDate);

    const memorial = await prisma.memorial.create({
      data: {
        petName,
        species,
        deathDate: new Date(deathDate),
        epitaph,
        isPublic,
        slug,
        userId: req.user.userId,
      },
    });

    res.status(201).json(memorial);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
/* ======================================================
   GET /api/memorials/my  (DASHBOARD UTENTE) ✅
   ====================================================== */
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const memorials = await prisma.memorial.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.json(memorials);
  } catch (err) {
    console.error("MY MEMORIALS ERROR:", err);
    res.status(500).json({ error: "Errore nel recupero memoriali" });
  }
});
/* ======================================================
   DELETE /api/memorials/:id
   ====================================================== */
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const memorialId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    if (isNaN(memorialId)) {
      return res.status(400).json({ error: "ID non valido" });
    }

    const memorial = await prisma.memorial.findUnique({
      where: { id: memorialId },
    });

    if (!memorial) {
      return res.status(404).json({ error: "Memoriale non trovato" });
    }

    if (memorial.userId !== userId) {
      return res.status(403).json({ error: "Accesso negato" });
    }

    await prisma.memorial.delete({
      where: { id: memorialId },
    });

    res.json({ message: "Memoriale eliminato con successo" });
  } catch (err) {
    console.error("DELETE MEMORIAL ERROR:", err);
    res.status(500).json({ error: "Errore eliminazione memoriale" });
  }
});
/* ======================================================
   PATCH /api/memorials/:id
   ====================================================== */
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const memorialId = parseInt(req.params.id, 10);
    const userId = req.user.userId;

    if (isNaN(memorialId)) {
      return res.status(400).json({ error: "ID non valido" });
    }

    const memorial = await prisma.memorial.findUnique({
      where: { id: memorialId },
    });

    if (!memorial) {
      return res.status(404).json({ error: "Memoriale non trovato" });
    }

    if (memorial.userId !== userId) {
      return res.status(403).json({ error: "Accesso negato" });
    }

    const { petName, species, deathDate, epitaph, isPublic } = req.body;

    const updated = await prisma.memorial.update({
      where: { id: memorialId },
      data: {
        petName,
        species,
        deathDate: deathDate ? new Date(deathDate) : undefined,
        epitaph,
        isPublic,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("UPDATE MEMORIAL ERROR:", err);
    res.status(500).json({ error: "Errore aggiornamento memoriale" });
  }
});
/* ======================================================
   GET /api/memorials/:slug  (PUBBLICO)
   ====================================================== */
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const memorial = await prisma.memorial.findUnique({
      where: { slug },
      select: {
        id: true,
        petName: true,
        species: true,
        deathDate: true,
        epitaph: true,
        isPublic: true,
        slug: true,
        createdAt: true,
      },
    });

    if (!memorial) {
      return res.status(404).json({ error: "Memoriale non trovato" });
    }

    if (!memorial.isPublic) {
      return res.status(403).json({ error: "Memoriale privato" });
    }

    res.json(memorial);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
