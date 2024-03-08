import {type Locator, type Page} from '@playwright/test';
import {t} from 'i18next';

export class LeaderboardPage {
  readonly page: Page;
  readonly getAnncmnt: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getAnncmnt = page.locator('#AnnouncementModalOkButton');
  }

  async goto() {
    await this.page.goto('./leaderboard');
  }
  // Info: click the button to close the announcement modal
  async clickAnncmnt() {
    if (this.getAnncmnt) {
      await this.getAnncmnt.click();
    }
  }
}
