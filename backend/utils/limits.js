// backend/utils/limits.js

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

    // immagini
    maxGalleryImages: 0, // ❌ NO gallery
    maxVideos: 0,

    // epitaffio (CARATTERI, per ora)
    maxEpitaphChars: 100,

    allowedGraveTier: PLAN.FREE,
  },

  MEDIUM: {
    maxMemorials: 3,

    maxGalleryImages: 5,
    maxVideos: 0,

    maxEpitaphChars: 300,

    allowedGraveTier: PLAN.MEDIUM,
  },

  PLUS: {
    maxMemorials: 6,

    maxGalleryImages: 10,
    maxVideos: 3,

    maxEpitaphChars: 1000,

    allowedGraveTier: PLAN.PLUS,
  },
};

export function normalizePlan(plan) {
  const p = String(plan || PLAN.FREE).toUpperCase();
  return PLAN_LIMITS[p] ? p : PLAN.FREE;
}

export function clampText(text, maxChars) {
  if (!text) return "";
  return String(text).length > maxChars
    ? String(text).slice(0, maxChars)
    : String(text);
}
