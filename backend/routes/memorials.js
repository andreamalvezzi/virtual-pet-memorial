import express from "express";
import prisma from "../prisma/client.js";
import slugify from "slugify";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authenticateTokenOptional } from "../middleware/authOptional.js";
import { PLAN_LIMITS, normalizePlan, countWords } from "../utils/limits.js";

const router = express.Router();

/* ======================================================
   UTILS
   ====================================================== */

function generateSlug(petName, deathDate) {
  const year = new Date(deathDate).getFullYear();
  const random = Math.random().toString(36).substring(2, 6);
  return `${slugify(petName, { lower: true })}-${year}-${random}`;
}

function tierAllowed(userPlan, graveTier) {
  // GraveTier: FREE | MEDIUM | PLUS
  if (graveTier === "FREE") return true;
  if (graveTier === "MEDIUM") return userPlan === "MEDIUM" || userPlan === "PLUS";
  if (graveTier === "PLUS") return userPlan === "PLUS";
  return false;
}

/* ======================================================
   POST /api/memorials
   Crea memoriale
   ====================================================== */
router.post("/", authenticateToken, async (req, res) => {
  try {
    if (!req.user.emailVerified) {
      return res.status(403).json({
        error: "Devi verificare la tua email prima di creare un memoriale.",
      });
    }

    const plan = normalizePlan(req.user.plan);
    const limits = PLAN_LIMITS[plan];

    // Limite memoriali per account
    const currentCount = await prisma.memorial.count({
      where: { userId: req.user.userId },
    });

    if (currentCount >= limits.maxMemorials) {
      return res.status(403).json({
        error: `Hai raggiunto il limite di memoriali del piano ${plan} (${limits.maxMemorials}).`,
      });
    }

    const {
      petName,
      species,
      deathDate,
      epitaph,
      isPublic = false,
      imageUrl,

      // nuovi (opzionali)
      graveStyleKey,
      galleryImages,
      videoUrls,
    } = req.body;

    if (!petName || !species || !deathDate || !epitaph) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Epitaffio: limite in PAROLE
    const words = countWords(epitaph);
    if (words > limits.maxEpitaphWords) {
      return res.status(400).json({
        error: `Epitaffio troppo lungo (max ${limits.maxEpitaphWords} parole per il piano ${plan}).`,
      });
    }

    // Validazione lapide
    const chosenKey = String(graveStyleKey || "classic");
    const style = await prisma.graveStyle.findUnique({
      where: { key: chosenKey },
    });

    if (!style || !style.isActive) {
      return res.status(400).json({ error: "Stile lapide non valido" });
    }

    if (!tierAllowed(plan, style.tier)) {
      return res.status(403).json({
        error: `Lo stile lapide selezionato richiede un piano superiore.`,
      });
    }

    // Immagini: totale (cover + gallery) <= maxImagesPerMemorial
    const galleryArr = Array.isArray(galleryImages) ? galleryImages.filter(Boolean) : [];
    const coverCount = imageUrl ? 1 : 0;
    const totalImages = coverCount + galleryArr.length;

    if (totalImages > limits.maxImagesPerMemorial) {
      return res.status(400).json({
        error: `Troppe immagini: max ${limits.maxImagesPerMemorial} per memoriale nel piano ${plan} (cover inclusa).`,
      });
    }

    // Video: solo PLUS
    const videosArr = Array.isArray(videoUrls) ? videoUrls.filter(Boolean) : [];
    if (videosArr.length > 0 && limits.maxVideosPerMemorial === 0) {
      return res.status(403).json({ error: "I video sono disponibili solo con il piano PLUS." });
    }
    if (videosArr.length > limits.maxVideosPerMemorial) {
      return res.status(400).json({
        error: `Troppi video: max ${limits.maxVideosPerMemorial} per memoriale nel piano ${plan}.`,
      });
    }

    const slug = generateSlug(petName, deathDate);

    const memorial = await prisma.memorial.create({
      data: {
        petName,
        species,
        deathDate: new Date(deathDate),
        epitaph,
        isPublic,
        imageUrl: imageUrl || null,
        slug,
        userId: req.user.userId,
        graveStyleKey: chosenKey,

        images: {
          create: galleryArr.map((url) => ({ imageUrl: String(url) })),
        },
        videos: {
          create: videosArr.map((url) => ({ videoUrl: String(url) })),
        },
      },
      include: {
        images: true,
        videos: true,
        graveStyle: true,
      },
    });

    res.status(201).json(memorial);
  } catch (err) {
    console.error("CREATE MEMORIAL ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ======================================================
   GET /api/memorials/my
   Memoriali dell’utente
   ====================================================== */
router.get("/my", authenticateToken, async (req, res) => {
  try {
    const memorials = await prisma.memorial.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" },
      include: { graveStyle: true },
    });

    res.json(memorials);
  } catch (err) {
    console.error("MY MEMORIALS ERROR:", err);
    res.status(500).json({ error: "Errore nel recupero memoriali" });
  }
});

/* ======================================================
   GET /api/memorials/public
   Memoriali pubblici + SEARCH + PAGINATION
   ====================================================== */
router.get("/public", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 6, 50);
    const search = req.query.search?.trim();
    const skip = (page - 1) * limit;

    const where = {
      isPublic: true,
      ...(search && {
        OR: [
          { petName: { contains: search, mode: "insensitive" } },
          { species: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [items, totalItems] = await Promise.all([
      prisma.memorial.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
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
      prisma.memorial.count({ where }),
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
   GET /api/memorials/id/:id
   Memoriale singolo (EDIT)
   ====================================================== */
router.get("/id/:id", authenticateToken, async (req, res) => {
  const memorialId = Number(req.params.id);

  if (isNaN(memorialId)) {
    return res.status(400).json({ error: "ID non valido" });
  }

  try {
    const memorial = await prisma.memorial.findUnique({
      where: { id: memorialId },
      include: { images: true, videos: true, graveStyle: true },
    });

    if (!memorial) return res.status(404).json({ error: "Memoriale non trovato" });
    if (memorial.userId !== req.user.userId) return res.status(403).json({ error: "Accesso negato" });

    res.json(memorial);
  } catch (err) {
    console.error("GET MEMORIAL BY ID ERROR:", err);
    res.status(500).json({ error: "Errore server" });
  }
});

/* ======================================================
   GET /api/memorials/:slug
   Pubblico / privato (owner)
   ====================================================== */
router.get("/:slug", authenticateTokenOptional, async (req, res) => {
  try {
    const { slug } = req.params;

    const memorial = await prisma.memorial.findUnique({
      where: { slug },
      include: { images: true, videos: true, graveStyle: true },
    });

    if (!memorial) return res.status(404).json({ error: "Memoriale non trovato" });

    if (memorial.isPublic) return res.json(memorial);
    if (req.user && req.user.userId === memorial.userId) return res.json(memorial);

    return res.status(404).json({ error: "Memoriale non trovato" });
  } catch (err) {
    console.error("GET MEMORIAL ERROR:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ======================================================
   PATCH /api/memorials/:id
   Aggiorna memoriale
   ====================================================== */
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const memorialId = Number(req.params.id);
    if (isNaN(memorialId)) return res.status(400).json({ error: "ID non valido" });

    const memorial = await prisma.memorial.findUnique({
      where: { id: memorialId },
    });

    if (!memorial) return res.status(404).json({ error: "Memoriale non trovato" });
    if (memorial.userId !== req.user.userId) return res.status(403).json({ error: "Accesso negato" });

    const plan = normalizePlan(req.user.plan);
    const limits = PLAN_LIMITS[plan];

    const {
      petName,
      species,
      deathDate,
      epitaph,
      isPublic,
      imageUrl,
      graveStyleKey,
    } = req.body;

    // epitaffio parole
    if (typeof epitaph === "string") {
      const words = countWords(epitaph);
      if (words > limits.maxEpitaphWords) {
        return res.status(400).json({
          error: `Epitaffio troppo lungo (max ${limits.maxEpitaphWords} parole per il piano ${plan}).`,
        });
      }
    }

    // grave style validate (se viene cambiato)
    if (graveStyleKey) {
      const chosenKey = String(graveStyleKey);
      const style = await prisma.graveStyle.findUnique({ where: { key: chosenKey } });
      if (!style || !style.isActive) return res.status(400).json({ error: "Stile lapide non valido" });
      if (!tierAllowed(plan, style.tier)) {
        return res.status(403).json({ error: "Lo stile lapide selezionato richiede un piano superiore." });
      }
    }

    const updated = await prisma.memorial.update({
      where: { id: memorialId },
      data: {
        petName,
        species,
        epitaph,
        isPublic,
        imageUrl,
        ...(deathDate && { deathDate: new Date(deathDate) }),
        ...(graveStyleKey && { graveStyleKey: String(graveStyleKey) }),
      },
      include: { images: true, videos: true, graveStyle: true },
    });

    res.json(updated);
  } catch (err) {
    console.error("UPDATE MEMORIAL ERROR:", err);
    res.status(500).json({ error: "Errore aggiornamento memoriale" });
  }
});

/* ======================================================
   DELETE /api/memorials/:id
   Elimina memoriale
   ====================================================== */
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const memorialId = Number(req.params.id);
    if (isNaN(memorialId)) return res.status(400).json({ error: "ID non valido" });

    const memorial = await prisma.memorial.findUnique({ where: { id: memorialId } });
    if (!memorial) return res.status(404).json({ error: "Memoriale non trovato" });
    if (memorial.userId !== req.user.userId) return res.status(403).json({ error: "Accesso negato" });

    await prisma.memorial.delete({ where: { id: memorialId } });

    res.json({ message: "Memoriale eliminato con successo" });
  } catch (err) {
    console.error("DELETE MEMORIAL ERROR:", err);
    res.status(500).json({ error: "Errore eliminazione memoriale" });
  }
});

export default router;
