import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import usersRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import memorialsRouter from "./routes/memorials.js";

import { authenticateToken } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
app.disable("etag");

app.use(cors());
app.use(express.json());

// 🔴 DISABILITA CACHE PER LE API
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.get("/", (req, res) => {
  res.json({ status: "backend ok" });
});

app.use("/api/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/memorials", memorialsRouter);

app.get("/api/protected", authenticateToken, (req, res) => {
  res.json({
    message: "Accesso consentito 🎉",
    user: req.user,
  });
});

// Catch API non esistenti
app.use("/api", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
