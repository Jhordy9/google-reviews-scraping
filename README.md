# Google Reviews Scraper
Fetch reviews and information about local places from Google Maps using Puppeteer.

## Installation

```bash
npm install google-reviews-scraping
```

## Usage

This package provides two main functions:

- `getLocalPlaceReviews`: Fetches reviews from a specified local place on Google Maps.
- `getLocalPlaceInfo`: Retrieves information about a local place based on the provided URL.

### Fetching Reviews from a Local Place

```typescript
import { getLocalPlaceReviews } from 'google-reviews-scraping';

const reviewsData = await getLocalPlaceReviews({
  placeUrl: 'https://www.google.com.br/maps/place/Starbucks/[...]',
  options: {
    navigationTimeout: 7000, // Optional
    lastCursor: '[CURSOR]', // Optional
  },
});

console.log(reviewsData);
```

### Fetching Information About a Local Place

```typescript
import { getLocalPlaceInfo } from 'google-reviews-scraping';

const placeInfo = await getLocalPlaceInfo({
  placeUrl: 'https://www.google.com.br/maps/place/Starbucks/[...]',
  options: {
    navigationTimeout: 7000, // Optional
  },
});

console.log(placeInfo);
```

## API

### getLocalPlaceReviews

**Parameters**
- `placeUrl`: The URL of the reviews page for the local place on Google Maps.
- `options`:
  - `navigationTimeout` (optional): The maximum time to wait for navigation, in milliseconds. Default is 6000.
  - `lastCursor` (optional): A string representing the cursor position for paginated reviews fetching.

**Returns**
An object containing the reviews, the count of reviews, and a cursor to the last review.
```typescript
{
    reviews: {
        date: string;
        userName: string;
        userAvatarUrl: string | null;
        rating: number;
        images: string[];
        reviewId: string;
        comment?: string | undefined;
    }[];
    lastCursor?: string | undefined;
}
```

### getLocalPlaceInfo

**Parameters**
- `placeUrl`: The URL of the local place on Google Maps.
- `options`:
  - `navigationTimeout` (optional): The maximum time to wait for navigation, in milliseconds. Default is 6000.

**Returns**
An object containing the local place information.
```typescript
{
    rating: Record<string, number>;
    placeName: string;
    averageRating: number;
    totalReviews: number;
}
```

## License

This project is licensed under the MIT License.
