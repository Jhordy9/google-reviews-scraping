import { Page } from 'puppeteer';
import { scrollFullPage, scrollPage } from './scrollUtils';
import { PromiseDataType, TransformedObjectRatingType } from '../types';

export type Reviews = PromiseDataType<typeof getReviewsFromPage>['reviews'];

export const getReviewsFromPage = async (
  page: Page,
  lastCursor?: string | null
) => {
  const reviews = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        'div[jsaction="mouseover:pane.review.in; mouseout:pane.review.out"]'
      )
    ).map((el) => {
      const getFirstElementChild = el.firstElementChild;
      const nameElement =
        getFirstElementChild?.children[1].children[1].children[0].children[0]
          .children[0];
      const userAvatarUrl = getFirstElementChild?.children[0]
        .querySelector('button > img')
        ?.getAttribute('src');

      const reviewElement = getFirstElementChild?.children[3];
      const ratingElement = reviewElement?.children[0];

      const getImagesElement = reviewElement?.children[2]
        ? Array.from(reviewElement.children[2].querySelectorAll('button'))
        : [];

      return {
        userName: nameElement?.textContent?.trim(),
        userAvatarUrl,
        rating: ratingElement?.children[0].childElementCount,
        date: ratingElement?.children[1].textContent?.trim()
          ? ratingElement.children[1].textContent.trim()
          : null,
        comment: reviewElement?.children[1]
          .querySelector('span')
          ?.textContent?.trim(),
        images: getImagesElement.flatMap((button) => {
          const style = button.getAttribute('style');
          const regex = /(?<=background-image: url\(").+?(?="\))/;
          const match = style?.match(regex);
          return match ?? [];
        }),
        reviewId: el.getAttribute('data-review-id'),
      };
    });
  });

  const findLastCursor = reviews.findIndex(
    (review) => review?.reviewId === lastCursor
  );
  const removeOldReviews =
    findLastCursor !== -1 ? reviews.slice(0, findLastCursor) : reviews;

  return {
    reviews: removeOldReviews,
    afterCursor: removeOldReviews[0]?.reviewId,
    beforeCursor: lastCursor,
  };
};

export const getAllReviewsFromPage = async (
  page: Page,
  oldBeforeCursor?: string | null
) => {
  let currentCursor = oldBeforeCursor;
  let newBeforeCursor = oldBeforeCursor;

  const accAllReviews: Reviews = [];

  if (!currentCursor) {
    await scrollFullPage(page);

    const { afterCursor, reviews: allReviews } = await getReviewsFromPage(
      page,
      currentCursor
    );

    return { reviews: allReviews, lastCursor: afterCursor };
  }

  do {
    await scrollPage(page);

    const { reviews, afterCursor, beforeCursor } = await getReviewsFromPage(
      page,
      currentCursor
    );

    accAllReviews.push(...reviews);

    currentCursor = afterCursor as string | undefined;

    if (newBeforeCursor) {
      newBeforeCursor = beforeCursor;
    }
  } while (currentCursor);

  return { reviews: accAllReviews, lastCursor: newBeforeCursor };
};

export const getPlaceData = async (page: Page) => {
  const placeData = await page.evaluate(() => {
    const mainContainer = document.querySelector('div[role="main"]');
    const infoContainer = mainContainer?.children[1].children[1].children[0];

    const AllRatingInfoContainer = infoContainer?.children[0];
    const averageInfoContainer = infoContainer?.children[1];

    const rating = Array.from(
      AllRatingInfoContainer?.querySelectorAll('tr') ?? []
    )
      .map((t) => t.getAttribute('aria-label'))
      .filter((r): r is string => r !== null);

    const transformRatingData = rating.reduce(
      (acc: TransformedObjectRatingType, item: string | null) => {
        if (!item) return acc;
        let [starsStr, reviewsStr] = item.split(',');
        const stars = parseInt(starsStr.split(' ')[0]);
        const reviews = parseInt(reviewsStr.match(/\d+/)![0], 10);
        acc[String(stars)] = reviews;
        return acc;
      },
      {}
    );

    return {
      placeName: mainContainer?.getAttribute('aria-label'),
      rating: transformRatingData,
      averageRating: parseFloat(
        averageInfoContainer?.children[0].textContent
          ?.trim()
          .replace(',', '.') ?? '0'
      ),
      totalReviews: parseInt(
        averageInfoContainer?.children[2].textContent
          ?.trim()
          .match(/\d+/)![0] ?? '0',
        10
      ),
    };
  });

  return placeData;
};
