import {expect, type Locator, type Page, type BrowserContext} from '@playwright/test';
import i18next from 'i18next';

export class TradePage {
  readonly page: Page;
  readonly getAnncmnt: Locator;
  readonly context: BrowserContext;

  constructor(page: Page, context: BrowserContext) {
    const ANNOUCEMENT_MODAL_OK_BUTTON = i18next.t('ANNOUNCEMENT_MODAL.OK_BUTTON');
    this.page = page;
    this.getAnncmnt = page.getByRole('button', {
      name: ANNOUCEMENT_MODAL_OK_BUTTON,
    });
    this.context = context;
  }

  async goto() {
    await this.page.goto('./trade/cfd/eth-usdt?trading_view=hidden&open_line_graph=hidden');
    await expect.soft(this.page).toHaveTitle(/CFD/);
  }

  async gotoBTC() {
    await this.page.goto('./trade/cfd/btc-usdt?trading_view=hidden&open_line_graph=hidden');
    await expect.soft(this.page).toHaveTitle(/CFD/);
  }

  async clickAnncmnt() {
    if (this.getAnncmnt) {
      await this.getAnncmnt.click();
    }
  }
  // Info: (20231013 - Jacky) open position amount can be changed
  async inputAmount(amount = '0.03') {
    await this.page.getByPlaceholder('amount input').fill(amount);
  }

  async openLongPosition(extensionId: string) {
    const TRADE_TAB_LONG_BUTTON = i18next.t('TRADE_PAGE.TRADE_TAB_LONG_BUTTON');
    const CONFIRM_BUTTON = i18next.t('POSITION_MODAL.CONFIRM_BUTTON');
    const pagePromise = this.context.newPage();
    await this.page.getByRole('button', {name: TRADE_TAB_LONG_BUTTON}).click();
    await this.page.getByRole('button', {name: CONFIRM_BUTTON}).click();
    const newPage = await pagePromise;
    await newPage.goto('chrome-extension://' + extensionId + '/popup.html');
    await newPage.getByTestId('signature-request-scroll-button').click();
    await newPage.getByTestId('page-container-footer-next').click();
    await this.page
      .locator('#__next > div > div:nth-child(11) > div > div > div.flex > button ')
      .click();
    newPage.close();
  }
  async openShortPosition(extensionId: string) {
    const TRADE_TAB_SHORT_BUTTON = i18next.t('TRADE_PAGE.TRADE_TAB_SHORT_BUTTON');
    const CONFIRM_BUTTON = i18next.t('POSITION_MODAL.CONFIRM_BUTTON');
    const pagePromise = this.context.newPage();
    await this.page.getByRole('button', {name: TRADE_TAB_SHORT_BUTTON}).click();
    await this.page.getByRole('button', {name: CONFIRM_BUTTON}).click();
    const newPage = await pagePromise;
    await newPage.goto('chrome-extension://' + extensionId + '/popup.html');
    await newPage.getByTestId('signature-request-scroll-button').click();
    await newPage.getByTestId('page-container-footer-next').click();
    await this.page
      .locator('#__next > div > div:nth-child(11) > div > div > div.flex > button > svg')
      .click();
    newPage.close();
  }

  // Info: (20231013 - Jacky) number="1" means the last position
  async updatePosition(extensionId: string, number = '1') {
    const positionTab = {name: i18next.t('TRADE_PAGE.POSITION_TAB')};
    const updatePostion = {name: i18next.t('POSITION_MODAL.UPDATE_POSITION_TITLE')};
    const confirmButton = {name: i18next.t('POSITION_MODAL.CONFIRM_BUTTON')};
    await this.page.getByRole('button', positionTab).click();
    await this.page
      .locator(
        '#__next > div > main > div > div:nth-child(3) > div > div > div > div > div:nth-last-child(' +
          number +
          ')'
      )
      .click();
    await this.page
      .locator(
        '#__next > div > div:nth-child(11) > div > div > div.flex-col.items-center.text-xs > div.mt-3.flex-col.leading-relaxed.text-lightWhite > div.mb-2.h-50px > div.flex.items-center.justify-between > div:nth-child(3) > div > div'
      )
      .click();
    await this.page
      .locator(
        '#__next > div > div:nth-child(11) > div > div > div.flex-col.items-center.text-xs > div.mt-3.flex-col.leading-relaxed.text-lightWhite > div.mb-5.h-70px > div:nth-child(3) > div > input'
      )
      .check();
    if (this.page.locator('body > vercel-live-feedback')) {
      await this.page.$eval('vercel-live-feedback', el => el.remove());
    }
    await this.page.getByRole('button', updatePostion).click();
    await this.page.getByRole('button', confirmButton).click();
    const pagePromise = this.context.newPage();
    const newPage = await pagePromise;
    await newPage.goto('chrome-extension://' + extensionId + '/popup.html');
    await newPage.getByTestId('signature-request-scroll-button').click();
    await newPage.getByTestId('page-container-footer-next').click();
    await this.page
      .locator('#__next > div > div:nth-child(11) > div > div > div.flex > button > svg')
      .click();
    newPage.close();
  }

  // Info: (20231013 - Jacky) number="1" means the last position
  async closePosition(extensionId: string, number = '1') {
    const POSITION_TAB = {name: i18next.t('TRADE_PAGE.POSITION_TAB')};
    const CLOSE_POSITION_TITLE = {name: i18next.t('POSITION_MODAL.CLOSE_POSITION_TITLE')};
    await this.page.getByRole('button', POSITION_TAB).click();
    await this.page
      .locator(
        '#__next > div > main > div > div.pointer-events-none.fixed.right-0.top-82px.z-10.flex.overflow-x-hidden.overflow-y-hidden.outline-none > div > div > div > div > div:nth-last-child(' +
          number +
          ') > div > div:nth-child(3) > div:nth-child(3)'
      )
      .click();
    const pagePromise = this.context.newPage();
    await this.page.getByRole('button', CLOSE_POSITION_TITLE).click();
    // await this.page.waitForTimeout(2000);
    const newPage = await pagePromise;
    await newPage.goto('chrome-extension://' + extensionId + '/popup.html');
    await newPage.getByTestId('signature-request-scroll-button').click();
    await newPage.getByTestId('page-container-footer-next').click();
    await this.page
      .locator('#__next > div > div:nth-child(11) > div > div > div.flex > button > svg')
      .click();
    newPage.close();
  }
}
