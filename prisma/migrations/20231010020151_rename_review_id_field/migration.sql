/*
  Warnings:

  - You are about to drop the column `reviewId` on the `reviews` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[review_id]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `review_id` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "reviews_reviewId_key";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "reviewId",
ADD COLUMN     "review_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reviews_review_id_key" ON "reviews"("review_id");
