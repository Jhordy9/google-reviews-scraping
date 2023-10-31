import { FetchReviewsOptions } from './common';
import { getLocalPlaceInfo, getLocalPlaceReviews } from '../index';

export type LocalPlaceInfoParams = {
  placeUrl: string;
  options?: FetchReviewsOptions;
};

export type LocalPlaceReviewsParams = {
  placeUrl: string;
  options?: FetchReviewsOptions & { lastCursor?: string | null };
};

export { getLocalPlaceInfo, getLocalPlaceReviews };
