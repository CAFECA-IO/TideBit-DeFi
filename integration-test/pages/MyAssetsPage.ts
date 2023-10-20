import {expect, type Locator, type Page} from '@playwright/test';
import i18next from 'i18next';

export class MyAssetsPage {
  readonly page: Page;
  readonly getAnncmnt: Locator;

  constructor(page: Page) {
    const okButton = {name: i18next.t('ANNOUNCEMENT_MODAL.OK_BUTTON')};
    this.page = page;
    this.getAnncmnt = page.getByRole('button', okButton);
  }

  // Info: (20231013 - Jacky) Use profile button to go to My Assets page
  async goto() {
    await this.page.goto('./');
    if (this.getAnncmnt) {
      await this.getAnncmnt.click();
    }
    await this.page
      .locator(
        '#__next > div > div.w-full.text-center> nav > div > div > div> div.mr-5.inline-flex > div > button'
      )
      .click();
    await this.page.locator('#userDropdown > ul > li:nth-child(1) > button > a').click();
    await expect.soft(this.page).toHaveTitle(/My Assets/);
    if (this.getAnncmnt) {
      await this.getAnncmnt.click();
    }
  }

  // Info: (20231013 - Jacky) Check balance higher than 20
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
    expect(Number((assetsAvailable as string).replace(',', '').trim())).toBeGreaterThan(20);
  }

  async checkTradeLog() {
    const titleButton = {name: i18next.t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_TITLE')};
    const depositButton = {name: i18next.t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_DEPOSIT')};
    const openButton = {name: i18next.t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_OPEN')};
    const updateButton = {
      name: i18next.t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_UPDATE'),
    };
    const closeButton = {name: i18next.t('MY_ASSETS_PAGE.RECEIPT_SECTION_TRADING_TYPE_CFD_CLOSE')};
    await this.page.getByRole('button', titleButton).click();
    await this.page
      .locator(
        '#__next > div > div:nth-child(17) > main > div > div > div.pt-10 > div:nth-child(4) > div > div.flex.flex-col.items-center> div > div.relative.mt-2.hidden.w-160px> div > button:nth-child(2)'
      )
      .click();
    await expect.soft(this.page.getByRole('button', depositButton).last()).toBeVisible();
    await this.page.getByRole('button', depositButton).nth(2).click();
    await this.page
      .locator(
        '#__next > div > div:nth-child(17) > main > div > div > div.pt-10 > div:nth-child(4) > div > div.flex.flex-col.items-center> div > div.relative.mt-2.hidden.w-160px> div > button:nth-child(4)'
      )
      .click();
    await expect.soft(this.page.getByRole('button', openButton).last()).toBeVisible();
    await expect.soft(this.page.getByRole('button', updateButton).last()).toBeVisible();
    await this.page.getByRole('button', openButton).first().click();
    await this.page
      .locator(
        '#__next > div > div:nth-child(17) > main > div > div > div.pt-10 > div:nth-child(4) > div > div.flex.flex-col.items-center> div > div.relative.mt-2.hidden.w-160px> div > button:nth-child(5)'
      )
      .click();
    await expect.soft(this.page.getByRole('button', closeButton).last()).toBeVisible();
  }
}