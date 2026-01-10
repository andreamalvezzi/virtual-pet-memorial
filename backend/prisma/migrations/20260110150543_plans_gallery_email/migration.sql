/*
  Warnings:

  - You are about to drop the column `galleryImages` on the `Memorial` table. All the data in the column will be lost.
  - You are about to drop the column `graveStyle` on the `Memorial` table. All the data in the column will be lost.
  - You are about to drop the column `plan` on the `Memorial` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrls` on the `Memorial` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailVerifyToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "GraveTier" AS ENUM ('FREE', 'MEDIUM', 'PLUS');

-- AlterTable
ALTER TABLE "Memorial" DROP COLUMN "galleryImages",
DROP COLUMN "graveStyle",
DROP COLUMN "plan",
DROP COLUMN "videoUrls",
ADD COLUMN     "graveStyleKey" TEXT NOT NULL DEFAULT 'classic';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailVerifyExpiry" TIMESTAMP(3),
ADD COLUMN     "emailVerifyToken" TEXT,
ADD COLUMN     "plan" "MemorialPlan" NOT NULL DEFAULT 'FREE';

-- CreateTable
CREATE TABLE "MemorialImage" (
    "id" SERIAL NOT NULL,
    "memorialId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemorialImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemorialVideo" (
    "id" SERIAL NOT NULL,
    "memorialId" INTEGER NOT NULL,
    "videoUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemorialVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GraveStyle" (
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "tier" "GraveTier" NOT NULL DEFAULT 'FREE',
    "previewUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "GraveStyle_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "MemorialImage_memorialId_idx" ON "MemorialImage"("memorialId");

-- CreateIndex
CREATE INDEX "MemorialVideo_memorialId_idx" ON "MemorialVideo"("memorialId");

-- CreateIndex
CREATE INDEX "Memorial_userId_idx" ON "Memorial"("userId");

-- CreateIndex
CREATE INDEX "Memorial_createdAt_idx" ON "Memorial"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_emailVerifyToken_key" ON "User"("emailVerifyToken");

-- AddForeignKey
ALTER TABLE "Memorial" ADD CONSTRAINT "Memorial_graveStyleKey_fkey" FOREIGN KEY ("graveStyleKey") REFERENCES "GraveStyle"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemorialImage" ADD CONSTRAINT "MemorialImage_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "Memorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemorialVideo" ADD CONSTRAINT "MemorialVideo_memorialId_fkey" FOREIGN KEY ("memorialId") REFERENCES "Memorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;
