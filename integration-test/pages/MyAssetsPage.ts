import {expect, type Locator, type Page} from '@playwright/test';
import {t} from 'i18next';

export class MyAssetsPage {
  readonly page: Page;
  readonly getAnncmnt: Locator;

  constructor(page: Page) {
    const okButton = {name: t('ANNOUNCEMENT_MODAL.OK_BUTTON')};
    this.page = page;
    this.getAnncmnt = page.getByRole('button', okButton);
  }

  // Info: (20231013 - Jacky) Use profile button to go to My Assets page
  async goto() {
    await this.page.goto('./');
    if (this.getAnncmnt) {
      await this.getAnncmnt.click();
    }
    await this.page.locator('#UserAvatarButton').click();
    await this.page.locator('#UserMyAssets').click();
    await expect.soft(this.page).toHaveTitle(/My Assets/);
    if (this.getAnncmnt) {
      await this.getAnncmnt.click();
    }
  }

  // Info: (20231013 - Jacky) Check balance higher than 20
  async checkBalance() {
    await this.page.locator('#ShowBalanceButton').click();
    const assetsAvailable = await this.page
      .locator(
        '#__next > div > div:nth-child(6) > main > div > div > div.pt-10 > div:nth-child(2) > div:nth-child(3) > span:nth-child(1)'
      )
      .textContent();
    expect(
      Number(
        (assetsAvailable as string)
          .substring(0, assetsAvailable.length - 4)
          .replace(',', '')
          .trim()
      )
    ).toBeGreaterThan(20);
  }

  async checkTradeLog() {
    await this.page.locator('#TradingTypeMenuButton').click();
    await this.page.locator('#TypeDepositButton').click();
    await expect
      .soft(
        this.page.locator(
          '#__next > div > div:nth-child(6) > main > div > div > div.pt-10 > div.p-4 > div:nth-child(2) > div > div > div > div > div > div:nth-child(2) > div:nth-child(1) > button'
        )
      )
      .toBeVisible();
    await this.page.locator('#TradingTypeMenuButton').click();
    await this.page.locator('#TypeOpenButton').click();
    await this.page
      .locator(
        '#__next > div > div:nth-child(6) > main > div > div > div.pt-10 > div.p-4 > div:nth-child(2) > div > div > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > button'
      )
      .click();
    if (await this.page.locator('#UpdateFormCloseButton').isVisible()) {
      await this.page.locator('#UpdateFormCloseButton').click();
    } else {
      await this.page.locator('#HistoryModalCloseButton').click();
    }
    await this.page.locator('#TradingTypeMenuButton').click();
    await this.page.locator('#TypeCloseButton').click();
    await this.page
      .locator(
        '#__next > div > div:nth-child(6) > main > div > div > div.pt-10 > div.p-4 > div:nth-child(2) > div > div > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(1) > button'
      )
      .click();
    await expect.soft(this.page.locator('#HistoryModalCloseButton')).toBeVisible();
  }
}
