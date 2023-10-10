import { getLocalPlaceInfo, getLocalPlaceReviews } from './src';
import { Handler } from 'aws-lambda';
import { db } from './src/services/db';
import { subMinutes } from 'date-fns';
import { convertStringToDate } from './src/utils/convertStringToDate';

const lessThirtyMinutesAgo = subMinutes(new Date(), 30);

export const reviewPlaces: Handler = async () => {
  const franchisesCount = await db.franchise.count();
  const franchisesPercentage = Math.ceil(franchisesCount * 0.07);

  const franchisesToUpdate = await db.franchise.findMany({
    select: {
      id: true,
      url: true,
      lastFetchedAt: true,
      totalReviews: true,
      lastCursor: true,
    },
    where: {
      deletedAt: null,
      OR: [
        {
          lastFetchedAt: null,
        },
        {
          lastFetchedAt: { lte: lessThirtyMinutesAgo },
        },
      ],
    },
    // take: franchisesPercentage,
  });

  let countUpdatedFranchises = 0;

  for (const franchise of franchisesToUpdate) {
    const placeInfo = await getLocalPlaceInfo(franchise.url);

    if (placeInfo.totalReviews === franchise.totalReviews) {
      await db.franchise.update({
        where: { id: franchise.id },
        data: {
          lastFetchedAt: new Date(),
        },
      });
      continue;
    }

    const getReviews = await getLocalPlaceReviews(franchise.url, {
      lastCursor: franchise.lastCursor,
    });

    await db.franchise.update({
      where: {
        id: franchise.id,
      },
      data: {
        averageRating: placeInfo.averageRating,
        totalReviews: placeInfo.totalReviews,
        name: placeInfo.placeName,
        rating: placeInfo.rating,
        lastFetchedAt: new Date(),
        lastCursor: getReviews.lastCursor,
        reviews: {
          createMany: {
            data: getReviews.reviews.map((r) => ({
              comment: r.comment,
              date: convertStringToDate(r.date),
              images: r.images,
              reviewId: r?.reviewId ?? '',
              rating: r.rating,
              userAvatarUrl: r.userAvatarUrl,
              userName: r.userName,
            })),
          },
        },
      },
    });

    countUpdatedFranchises++;
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message:
          countUpdatedFranchises > 0
            ? `Franchises updated, count: ${countUpdatedFranchises}`
            : 'No franchises updated',
      },
      null,
      2
    ),
  };

  return response;
};
