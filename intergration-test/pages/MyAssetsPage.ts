import {expect, type Locator, type Page} from '@playwright/test';
import i18next from 'i18next';

export class MyAssetsPage {
  readonly page: Page;
  readonly getAnncmnt: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getAnncmnt = page.getByRole('button', {
      name: i18next.t('ANNOUNCEMENT_MODAL.OK_BUTTON'),
    });
  }

  async goto() {
    await this.page.goto('./');
    if (this.getAnncmnt) {
      await this.getAnncmnt.click();
    }
    // profile button
    await this.page
      .locator(
        '#__next > div > div.w-full.text-center> nav > div > div > div> div.mr-5.inline-flex > div > button'
      )
      .click();
    // My assets button
    await this.page.locator('#userDropdown > ul > li:nth-child(1) > button > a').click();
    await expect.soft(this.page).toHaveTitle(/My Assets/);
    if (this.getAnncmnt) {
      await this.getAnncmnt.click();
    }
  }

  async checkBalance() {
    await this.page
      .locator(
        '#__next > div > div:nth-child(17) > main > div > div > div.pt-10 > div:nth-child(1) > div > div > div.flex.items-center.justify-center.space-x-2.text-center > button'
      )
      .click();
    const assetsAvailable = await this.page
      .locator(
        '#__next > div > div:nth-child(17) > main > div > div > div.pt-10 > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(3) > div > span:nth-child(1)'
      )
      .textContent();
    const expectedNavAvailable = Number(assetsAvailable);
    expect(expectedNavAvailable).toBeGreaterThan(20);
  }
  async checkTradeLog() {
    await this.page
      .getByRole('button', {name: i18next.t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_TITLE')})
      .click();
    await this.page
      .locator(
        '#__next > div > div:nth-child(17) > main > div > div > div.pt-10 > div:nth-child(4) > div > div.flex.flex-col.items-center> div > div.relative.mt-2.hidden.w-160px> div > button:nth-child(2)'
      )
      .click();
    await expect
      .soft(
        this.page
          .getByRole('button', {
            name: i18next.t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_DEPOSIT'),
          })
          .last()
      )
      .toBeVisible();
    await this.page
      .getByRole('button', {name: i18next.t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_DEPOSIT')})
      .nth(2)
      .click();
    await this.page
      .locator(
        '#__next > div > div:nth-child(17) > main > div > div > div.pt-10 > div:nth-child(4) > div > div.flex.flex-col.items-center> div > div.relative.mt-2.hidden.w-160px> div > button:nth-child(4)'
      )
      .click();
    await expect
      .soft(
        this.page
          .getByRole('button', {
            name: i18next.t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_OPEN'),
          })
          .last()
      )
      .toBeVisible();
    await expect
      .soft(
        this.page
          .getByRole('button', {
            name: i18next.t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_UPDATE'),
          })
          .last()
      )
      .toBeVisible();
    await this.page
      .getByRole('button', {
        name: i18next.t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_OPEN'),
      })
      .first()
      .click();
    await this.page
      .locator(
        '#__next > div > div:nth-child(17) > main > div > div > div.pt-10 > div:nth-child(4) > div > div.flex.flex-col.items-center> div > div.relative.mt-2.hidden.w-160px> div > button:nth-child(5)'
      )
      .click();
    await expect
      .soft(
        this.page
          .getByRole('button', {
            name: i18next.t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_CLOSE'),
          })
          .last()
      )
      .toBeVisible();
  }
}
