/*
  Warnings:

  - A unique constraint covering the columns `[animeId,userId]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Rating_animeId_userId_key" ON "Rating"("animeId", "userId");
