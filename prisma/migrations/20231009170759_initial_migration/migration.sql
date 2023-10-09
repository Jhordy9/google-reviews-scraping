-- CreateTable
CREATE TABLE "franchises" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "name" TEXT,
    "rating" JSONB,
    "total_reviews" INTEGER,
    "average_rating" DOUBLE PRECISION,
    "url" TEXT NOT NULL,
    "last_fetched_at" TIMESTAMP(3),
    "last_cursor" TEXT,

    CONSTRAINT "franchises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "user_name" TEXT,
    "user_avatar_url" TEXT,
    "rating" INTEGER,
    "date" TIMESTAMP(3),
    "comment" TEXT,
    "images" TEXT[],
    "reviewId" TEXT NOT NULL,
    "franchiseId" TEXT,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "franchises_url_key" ON "franchises"("url");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_reviewId_key" ON "reviews"("reviewId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_franchiseId_fkey" FOREIGN KEY ("franchiseId") REFERENCES "franchises"("id") ON DELETE SET NULL ON UPDATE CASCADE;
