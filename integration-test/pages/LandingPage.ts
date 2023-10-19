import {expect, type Locator, type Page} from '@playwright/test';
import i18next from 'i18next';

export class LandingPage {
  readonly page: Page;
  readonly getAnncmnt: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getAnncmnt = page.getByRole('button', {
      name: i18next.t('ANNOUNCEMENT_MODAL.OK_BUTTON') as string,
    });
  }

  async goto() {
    await this.page.goto('./');
    await expect.soft(this.page).toHaveTitle(/TideBit DeFi/);
  }

  // Info: click the button to close the announcement modal
  async clickAnncmnt() {
    if (this.getAnncmnt) {
      await this.getAnncmnt.click();
    }
  }
}
