import {expect, type Locator, type Page, type BrowserContext} from '@playwright/test';
import {t} from 'i18next';

export class TradePage {
  readonly page: Page;
  readonly getAnncmnt: Locator;
  readonly context: BrowserContext;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.getAnncmnt = page.locator('#AnnouncementModalOkButton');
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
    const TRADE_TAB_LONG_BUTTON = t('TRADE_PAGE.TRADE_TAB_LONG_BUTTON');
    const CONFIRM_BUTTON = t('POSITION_MODAL.CONFIRM_BUTTON');
    const pagePromise = this.context.newPage();
    await this.page.getByRole('button', {name: TRADE_TAB_LONG_BUTTON}).click();
    await this.page.getByRole('button', {name: CONFIRM_BUTTON}).click();
    const newPage = await pagePromise;
    await newPage.goto('chrome-extension://' + extensionId + '/popup.html');
    await newPage.getByTestId('signature-request-scroll-button').click();
    await newPage.getByTestId('page-container-footer-next').click();
    await this.page.locator('#UpdateFormCloseButton').click();
    newPage.close();
  }
  async openShortPosition(extensionId: string) {
    const TRADE_TAB_SHORT_BUTTON = t('TRADE_PAGE.TRADE_TAB_SHORT_BUTTON');
    const CONFIRM_BUTTON = t('POSITION_MODAL.CONFIRM_BUTTON');
    const pagePromise = this.context.newPage();
    await this.page.getByRole('button', {name: TRADE_TAB_SHORT_BUTTON}).click();
    await this.page.getByRole('button', {name: CONFIRM_BUTTON}).click();
    const newPage = await pagePromise;
    await newPage.goto('chrome-extension://' + extensionId + '/popup.html');
    await newPage.getByTestId('signature-request-scroll-button').click();
    await newPage.getByTestId('page-container-footer-next').click();
    await this.page.locator('#UpdateFormCloseButton').click();
    newPage.close();
  }

  // Info: (20231013 - Jacky) number="1" means the last position
  async updatePosition(extensionId: string, number = '1') {
    await this.page.waitForTimeout(10000);
    await this.page.locator('#PositionTabButton').click();
    await this.page
      .locator(
        '#__next > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div:nth-last-child(' +
          number +
          ')'
      )
      .click();
    const pagePromise = this.context.newPage();
    await this.page.locator('#UpdateFormTpToggle').click();
    await this.page.locator('#UpdateFormSlToggle').click();
    await this.page.locator('#UpdateFormGslCheckbox').check();
    if ((await this.page.locator('vercel-live-feedback').count()) > 0) {
      await this.page.$eval('vercel-live-feedback', el => el.remove());
    }
    await this.page.locator('#UpdateFormButton').click();
    await this.page.locator('#UpdateSubmitButton').click();
    const newPage = await pagePromise;
    await newPage.goto('chrome-extension://' + extensionId + '/popup.html');
    await newPage.getByTestId('signature-request-scroll-button').click();
    await newPage.getByTestId('page-container-footer-next').click();
    await this.page.locator('#UpdateFormCloseButton').click();
    newPage.close();
  }

  // Info: (20231013 - Jacky) number="1" means the last position
  async closePosition(extensionId: string, number = '1') {
    await this.page.locator('#PositionTabButton').click();
    await this.page
      .locator(
        '#__next > div > main > div > div:nth-child(2) > div:nth-child(2) > div > div > div > div > div:nth-last-child(' +
          number +
          ') > div > div:nth-child(3) > div:nth-child(3) > div:nth-child(1)'
      )
      .click();
    const pagePromise = this.context.newPage();
    await this.page.locator('#ClosePositionButton').click();
    const newPage = await pagePromise;
    await newPage.goto('chrome-extension://' + extensionId + '/popup.html');
    await newPage.getByTestId('signature-request-scroll-button').click();
    await newPage.getByTestId('page-container-footer-next').click();
    await this.page.locator('#HistoryModalCloseButton').click();
    newPage.close();
  }
}
