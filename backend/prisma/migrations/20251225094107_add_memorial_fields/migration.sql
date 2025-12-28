/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Memorial` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deathDate` to the `Memorial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `epitaph` to the `Memorial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `petName` to the `Memorial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Memorial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `species` to the `Memorial` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Memorial" ADD COLUMN     "deathDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "epitaph" TEXT NOT NULL,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "petName" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "species" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Memorial_slug_key" ON "Memorial"("slug");
