import {expect, type Locator, type Page} from '@playwright/test';
import i18next from 'i18next';

export class LandingPage {
  readonly page: Page;
  readonly getAnncmnt: Locator;

  constructor(page: Page) {
    const okButton = {name: i18next.t('ANNOUNCEMENT_MODAL.OK_BUTTON')};
    this.page = page;
    this.getAnncmnt = page.getByRole('button', okButton);
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
