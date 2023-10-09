import { z } from 'zod';

export const TransformedObjectRating = z.record(z.number());

export const RatingSchema = z.object({
  placeName: z.string().nullable().optional(),
  rating: TransformedObjectRating,
  averageRating: z.number(),
  totalReviews: z.number(),
});

const ReviewsSchema = z.object({
  userName: z.string().optional(),
  userAvatarUrl: z.string().nullable().optional(),
  rating: z.number().optional(),
  date: z.string().nullable(),
  comment: z.string().optional(),
  images: z.array(z.string()),
  reviewId: z.string().nullable(),
});

export const ReviewsSchemaResponse = z.object({
  reviews: z.array(ReviewsSchema),
  lastCursor: z.string().optional(),
});
