import { z } from 'zod';

export const TransformedObjectRating = z.record(z.number());

export const RatingSchema = z.object({
  placeName: z.string(),
  rating: TransformedObjectRating,
  averageRating: z.number(),
  totalReviews: z.number(),
});

const ReviewsSchema = z.object({
  userName: z.string(),
  userAvatarUrl: z.string().nullable(),
  rating: z.number(),
  date: z.string(),
  comment: z.string().optional(),
  images: z.array(z.string()),
  reviewId: z.string(),
});

export const ReviewsSchemaResponse = z.object({
  reviews: z.array(ReviewsSchema),
  lastCursor: z.string().optional(),
});
