import { z } from 'zod';
import { Reviews } from '../utils/dataExtraction';
import {
  RatingSchema,
  ReviewsSchemaResponse,
  TransformedObjectRating,
} from './schema';

export type PromiseDataType<U extends (...args: any) => any> =
  ReturnType<U> extends Promise<infer T> ? T : never;

export type FetchReviewsOptions = {
  navigationTimeout?: number;
};

export type ReviewsType = z.infer<typeof ReviewsSchemaResponse>;
export type RatingType = z.infer<typeof RatingSchema>;
export type TransformedObjectRatingType = z.infer<
  typeof TransformedObjectRating
>;
