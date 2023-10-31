import { launchBrowser } from './puppeteer/puppeteerSetup';
import {
  getAllReviewsFromPage,
  getPlaceData,
} from './puppeteer/dataExtraction';
import { LocalPlaceInfoParams, LocalPlaceReviewsParams } from './types';
import { RatingSchema, ReviewsSchemaResponse } from './types/schema';
import { ZodError } from 'zod';
import { ReviewsType, LocalPlaceInfoType } from './types/types';

/**
 * Fetches reviews from a specified local place on Google Maps.
 *
 * @param placeUrl - The URL of the reviews page for the local place on Google Maps.
 *   It should be navigated directly to the reviews section/tab.
 * @param options - Options for fetching reviews.
 *   - `navigationTimeout` (optional): The maximum time to wait for navigation, in milliseconds. Default is 6000.
 *   - `lastCursor` (optional): A string representing the cursor position for paginated reviews fetching.
 * @returns An object containing the reviews, the count of reviews, and a cursor to the last review.
 *
 * @example
 * const reviewsData = await getLocalPlaceReviews('https://www.google.com.br/maps/place/Starbucks/@-26.9198174,-49.0715915,17z/data=!4m8!3m7!1s0x94df1907d7f5662f:0xf797f04b7b7520c5!8m2!3d-26.9198222!4d-49.0690166!9m1!1b1!16s%2Fg%2F11k3mqtmjl?entry=ttu');
 */
export const getLocalPlaceReviews = async ({
  placeUrl,
  options,
}: LocalPlaceReviewsParams): Promise<ReviewsType> => {
  const browser = await launchBrowser();

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(options?.navigationTimeout ?? 6000);
  await page.goto(placeUrl);
  await new Promise((r) => setTimeout(r, 2000));

  const orderSelector = "button[aria-label='Classificar avaliações']";
  const orderButtonSelector = "div[role='menuitemradio'][data-index='1']";

  await page.waitForSelector(orderSelector);
  await page.click(orderSelector);

  await page.waitForSelector(orderButtonSelector);
  await page.click(orderButtonSelector);

  await new Promise((r) => setTimeout(r, 5000));
  await page.waitForSelector('.fontBodyMedium');

  try {
    const { lastCursor, reviews } = await getAllReviewsFromPage(
      page,
      options?.lastCursor
    );

    const parsedReviews = ReviewsSchemaResponse.parse({ lastCursor, reviews });

    await browser.close();

    return parsedReviews;
  } catch (err) {
    await browser.close();

    if (err instanceof ZodError) {
      console.error(err.issues);
      throw new Error(
        `Error while trying to parse reviews, maybe the scraper is broken, err: ${err.message}`
      );
    }
    throw err;
  }
};

/**
 * Retrieves information about a local place based on the provided URL.
 *
 * @param placeUrl - The URL of the local place on Google Maps.
 * @param options - Options for fetching information, such as navigation timeout.
 *   - `navigationTimeout` (optional): The maximum time to wait for navigation, in milliseconds. Default is 6000.
 * @returns An object containing the local place information.
 *
 * @example
 * const placeInfo = await getLocalPlaceInfo('https://www.google.com.br/maps/place/Starbucks/@-26.9198174,-49.0715915,17z/data=!4m8!3m7!1s0x94df1907d7f5662f:0xf797f04b7b7520c5!8m2!3d-26.9198222!4d-49.0690166!9m1!1b1!16s%2Fg%2F11k3mqtmjl?entry=ttu');
 */
export const getLocalPlaceInfo = async ({
  placeUrl,
  options,
}: LocalPlaceInfoParams): Promise<LocalPlaceInfoType> => {
  const browser = await launchBrowser();

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(options?.navigationTimeout ?? 6000);
  await page.goto(placeUrl);
  await new Promise((r) => setTimeout(r, 2000));

  try {
    const data = await getPlaceData(page);

    const parsedData = RatingSchema.parse(data);

    await browser.close();

    return parsedData;
  } catch (err) {
    await browser.close();
    if (err instanceof ZodError) {
      console.error(err.issues);
      throw new Error(
        `Error while trying to parse place info, maybe the scraper is broken, err: ${err.message}`
      );
    }

    throw err;
  }
};
