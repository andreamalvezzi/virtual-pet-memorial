export const PLAN = {
  FREE: "FREE",
  MEDIUM: "MEDIUM",
  PLUS: "PLUS",
};

export const PLAN_PRICES = {
  FREE: 0,
  MEDIUM: 2.99,
  PLUS: 5.99,
};

export const PLAN_LIMITS = {
  FREE: {
    maxMemorials: 1,
    maxImagesPerMemorial: 1, // totale immagini (cover inclusa)
    maxVideosPerMemorial: 0,
    maxEpitaphWords: 100,
    allowedGraveTier: PLAN.FREE,
  },
  MEDIUM: {
    maxMemorials: 3,
    maxImagesPerMemorial: 5,
    maxVideosPerMemorial: 0,
    maxEpitaphWords: 300,
    allowedGraveTier: PLAN.MEDIUM,
  },
  PLUS: {
    maxMemorials: 6,
    maxImagesPerMemorial: 10,
    maxVideosPerMemorial: 3,
    maxEpitaphWords: 1000,
    allowedGraveTier: PLAN.PLUS,
  },
};

export function normalizePlan(plan) {
  const p = String(plan || "FREE").toUpperCase();
  if (p === "MEDIUM" || p === "PLUS") return p;
  return "FREE";
}

export function countWords(text) {
  if (!text) return 0;
  return String(text)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
