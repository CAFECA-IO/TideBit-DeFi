import {expect, type Locator, type Page} from '@playwright/test';
import {t} from 'i18next';

export class LandingPage {
  readonly page: Page;
  readonly getAnncmnt: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getAnncmnt = page.locator('#AnnouncementModalOkButton');
  }

  async goto() {
    await this.page.goto('./');
    await expect.soft(this.page).toHaveTitle(/TideBit DeFi/);
  }

  async clickAnncmnt() {
    if (this.getAnncmnt) {
      await this.getAnncmnt.click();
    }
  }
}
