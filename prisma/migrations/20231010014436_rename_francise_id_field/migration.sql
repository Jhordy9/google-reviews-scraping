/*
  Warnings:

  - You are about to drop the column `franchiseId` on the `reviews` table. All the data in the column will be lost.
  - Added the required column `franchise_id` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_franchiseId_fkey";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "franchiseId",
ADD COLUMN     "franchise_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_franchise_id_fkey" FOREIGN KEY ("franchise_id") REFERENCES "franchises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
