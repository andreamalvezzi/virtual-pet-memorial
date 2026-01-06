-- CreateEnum
CREATE TYPE "MemorialPlan" AS ENUM ('FREE', 'MEDIUM', 'PLUS');

-- AlterTable
ALTER TABLE "Memorial" ADD COLUMN     "galleryImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "graveStyle" TEXT NOT NULL DEFAULT 'classic',
ADD COLUMN     "plan" "MemorialPlan" NOT NULL DEFAULT 'FREE',
ADD COLUMN     "videoUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
