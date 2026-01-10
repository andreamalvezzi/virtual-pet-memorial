export const PLAN = {
  FREE: "FREE",
  MEDIUM: "MEDIUM",
  PLUS: "PLUS",
};

export const PLAN_LIMITS = {
  [PLAN.FREE]:   { maxGalleryImages: 0,  maxVideos: 0, maxEpitaph: 100,  gravestoneTier: "DEFAULT" },
  [PLAN.MEDIUM]: { maxGalleryImages: 5,  maxVideos: 0, maxEpitaph: 300,  gravestoneTier: "MEDIUM"  },
  [PLAN.PLUS]:   { maxGalleryImages: 10, maxVideos: 3, maxEpitaph: 1000, gravestoneTier: "ALL"     },
};

export function clampText(text, max) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) : text;
}
