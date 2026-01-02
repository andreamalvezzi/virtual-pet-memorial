import express from "express";
import prisma from "../prisma/client.js";
import slugify from "slugify";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authenticateTokenOptional } from "../middleware/authOptional.js";


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
    const {
      petName,
      species,
      deathDate,
      epitaph,
      isPublic = false,
      imageUrl, // 👈 AGGIUNTO
    } = req.body;

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
        imageUrl: imageUrl || null, // 👈 AGGIUNTO
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
   GET /api/memorials/my  (DASHBOARD UTENTE)
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
   GET /api/memorials/public  (HOME PUBBLICA)
   ====================================================== */
router.get("/public", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 6;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      prisma.memorial.findMany({
        where: { isPublic: true },
        orderBy: [
          { createdAt: "desc" },
          { id: "desc" },
        ],
        skip,
        take: limit,
        select: {
          id: true,
          slug: true,
          petName: true,
          species: true,
          imageUrl: true,
          createdAt: true,
        },
      }),
      prisma.memorial.count({
        where: { isPublic: true },
      }),
    ]);

    res.json({
      items,
      page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
  } catch (err) {
    console.error("PUBLIC MEMORIALS ERROR:", err);
    res.status(500).json({ error: "Errore caricamento memoriali pubblici" });
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

    const {
      petName,
      species,
      deathDate,
      epitaph,
      isPublic,
      imageUrl, // 👈 AGGIUNTO
    } = req.body;

    const updated = await prisma.memorial.update({
      where: { id: memorialId },
      data: {
        petName,
        species,
        deathDate: deathDate ? new Date(deathDate) : undefined,
        epitaph,
        isPublic,
        imageUrl, // 👈 AGGIUNTO (undefined = non modifica)
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("UPDATE MEMORIAL ERROR:", err);
    res.status(500).json({ error: "Errore aggiornamento memoriale" });
  }
});

/* ======================================================
   GET /api/memorials/:slug  (PUBBLICO + PRIVATO)
   ====================================================== */
router.get(
  "/:slug",
  authenticateTokenOptional,
  async (req, res) => {
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
          imageUrl: true,
          isPublic: true,
          slug: true,
          createdAt: true,
          userId: true, // 👈 NECESSARIO per verificare il proprietario
        },
      });

      // 1️⃣ Memoriale inesistente
      if (!memorial) {
        return res.status(404).json({ error: "Memoriale non trovato" });
      }

      // 2️⃣ Memoriale pubblico → OK
      if (memorial.isPublic) {
        return res.json(memorial);
      }

      // 3️⃣ Memoriale privato ma proprietario → OK
      if (req.user && req.user.userId === memorial.userId) {
        return res.json(memorial);
      }

      // 4️⃣ Memoriale privato e NON autorizzato → fingi che non esista
      return res.status(404).json({ error: "Memoriale non trovato" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);
export default router;
