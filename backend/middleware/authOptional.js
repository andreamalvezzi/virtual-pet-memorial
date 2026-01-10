import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

export async function authenticateTokenOptional(req, _res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, plan: true, emailVerified: true, role: true },
    });

    req.user = user
      ? { userId: user.id, email: user.email, plan: user.plan, emailVerified: user.emailVerified, role: user.role }
      : null;

    return next();
  } catch {
    req.user = null;
    return next();
  }
}

