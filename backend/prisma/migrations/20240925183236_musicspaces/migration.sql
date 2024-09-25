/*
  Warnings:

  - You are about to drop the `Song` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `musicId` to the `Queue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Queue` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_queueId_fkey";

-- AlterTable
ALTER TABLE "Queue" ADD COLUMN     "musicId" INTEGER NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Song";

-- CreateTable
CREATE TABLE "Music" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Music_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_musicId_fkey" FOREIGN KEY ("musicId") REFERENCES "Music"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
