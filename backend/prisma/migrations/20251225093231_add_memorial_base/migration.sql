-- CreateTable
CREATE TABLE "Memorial" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Memorial_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Memorial" ADD CONSTRAINT "Memorial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
