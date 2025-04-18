/*
  Warnings:

  - You are about to drop the `_AnimeGenres` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AnimeGenres" DROP CONSTRAINT "_AnimeGenres_A_fkey";

-- DropForeignKey
ALTER TABLE "_AnimeGenres" DROP CONSTRAINT "_AnimeGenres_B_fkey";

-- DropTable
DROP TABLE "_AnimeGenres";

-- CreateTable
CREATE TABLE "AnimeGenre" (
    "id" SERIAL NOT NULL,
    "animeId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,

    CONSTRAINT "AnimeGenre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnimeGenre_animeId_genreId_key" ON "AnimeGenre"("animeId", "genreId");

-- AddForeignKey
ALTER TABLE "AnimeGenre" ADD CONSTRAINT "AnimeGenre_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeGenre" ADD CONSTRAINT "AnimeGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
