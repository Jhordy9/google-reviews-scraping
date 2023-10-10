/*
  Warnings:

  - Made the column `user_name` on table `reviews` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating` on table `reviews` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `reviews` required. This step will fail if there are existing NULL values in that column.
  - Made the column `franchiseId` on table `reviews` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_franchiseId_fkey";

-- AlterTable
ALTER TABLE "reviews" ALTER COLUMN "user_name" SET NOT NULL,
ALTER COLUMN "rating" SET NOT NULL,
ALTER COLUMN "date" SET NOT NULL,
ALTER COLUMN "franchiseId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "franchises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
