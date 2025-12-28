import slugify from "slugify";

export function generateSlug(text) {
  const base = slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });

  const random = Math.random().toString(36).substring(2, 6);
  return `${base}-${random}`;
}
