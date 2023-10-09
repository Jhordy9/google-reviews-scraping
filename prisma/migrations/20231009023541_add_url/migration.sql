/*
  Warnings:

  - Added the required column `url` to the `franchises` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "franchises" ADD COLUMN     "url" TEXT NOT NULL;
