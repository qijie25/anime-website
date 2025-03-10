/*
  Warnings:

  - You are about to drop the column `profile_img` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profile_img",
ADD COLUMN     "profile_imgs" TEXT[] DEFAULT ARRAY[]::TEXT[];
