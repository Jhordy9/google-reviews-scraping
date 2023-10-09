/*
  Warnings:

  - A unique constraint covering the columns `[url]` on the table `franchises` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "franchises_url_key" ON "franchises"("url");
