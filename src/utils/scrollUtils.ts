import { Page } from 'puppeteer';
import { SCROLL_TIMEOUT } from './puppeteerSetup';

export const scrollFullPage = async (page: Page) => {
  await page.waitForSelector('.fontBodyMedium');

  async function getScrollHeight() {
    return await page.evaluate(() => {
      const container = document.querySelector('div[role="main"]')?.children[1];
      return container?.scrollHeight;
    });
  }

  let lastHeight = await getScrollHeight();

  while (true) {
    await page.evaluate(() => {
      const container = document.querySelector('div[role="main"]')?.children[1];
      if (container) {
        container.scrollTop = container?.scrollHeight;
      }
    });

    await new Promise((resolve) => setTimeout(resolve, SCROLL_TIMEOUT));

    let newHeight = await getScrollHeight();
    if (newHeight === lastHeight) break;

    lastHeight = newHeight;
  }
};

export const scrollPage = async (page: Page) => {
  // Set a fixed amount to scroll
  const SCROLL_INCREMENT = 600;

  // Execute the scroll operation once
  await page.evaluate((increment) => {
    const container = document.querySelector('div[role="main"]')?.children[1];
    if (container) {
      container.scrollTop += increment;
    }
  }, SCROLL_INCREMENT);

  // Wait for a moment to allow new content to load
  await new Promise((resolve) => setTimeout(resolve, SCROLL_TIMEOUT));
};
