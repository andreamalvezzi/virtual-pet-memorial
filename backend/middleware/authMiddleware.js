import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token mancante" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 carica dati utente reali dal DB (plan + emailVerified sempre aggiornati)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        plan: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Utente non valido" });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      plan: user.plan,
      emailVerified: user.emailVerified,
    };

    next();
  } catch (err) {
    return res.status(403).json({ error: "Token non valido" });
  }
}
