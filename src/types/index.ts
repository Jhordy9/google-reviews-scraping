import { Reviews } from '../utils/dataExtraction';

export type PromiseDataType<U extends (...args: any) => any> =
  ReturnType<U> extends Promise<infer T> ? T : never;

export type FetchReviewsOptions = {
  navigationTimeout?: number;
};

export type ReviewData = {
  reviews: Reviews;
  count: number;
  lastCursor: string | undefined;
};

export type TransformedObjectRating = { [key: string]: number };

export type PlaceData = {
  placeName: string | null;
  rating: TransformedObjectRating;
  averageRating: number;
  totalReviews: number;
};
