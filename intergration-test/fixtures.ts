import { test as base , chromium, type BrowserContext } from '@playwright/test';
import path from 'path';


export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({ }, use) => {
    const pathToExtension = path.join(__dirname, 'metamask-chrome-11.0.0');
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--headless=new`,
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
});
export const expect = test.expect;