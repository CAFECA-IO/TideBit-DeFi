import {type Locator, type Page} from '@playwright/test';
import {t} from 'i18next';

export class LeaderboardPage {
  readonly page: Page;
  readonly getAnncmnt: Locator;

  constructor(page: Page) {
    const okButton = {name: t('ANNOUNCEMENT_MODAL.OK_BUTTON')};
    this.page = page;
    this.getAnncmnt = page.getByRole('button', okButton);
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
