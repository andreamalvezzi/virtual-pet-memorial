import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

export async function authenticateToken(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Token mancante" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // carichiamo user aggiornato dal DB per avere plan/emailVerified sempre coerenti
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, plan: true, emailVerified: true, role: true },
    });

    if (!user) return res.status(401).json({ error: "Utente non valido" });

    req.user = {
      userId: user.id,
      email: user.email,
      plan: user.plan,
      emailVerified: user.emailVerified,
      role: user.role,
    };

    next();
  } catch (err) {
    return res.status(403).json({ error: "Token non valido" });
  }
}
