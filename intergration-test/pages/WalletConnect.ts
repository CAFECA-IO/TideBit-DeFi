import {expect} from '../fixtures';
import metamask from '../.auth/metamask.json';
import {type Page, type BrowserContext} from '@playwright/test';
import i18next from '../i18n';

export class WalletConnect {
  readonly page: Page;
  readonly context: BrowserContext;
  extensionId: string;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
    // this.extensionId = "";
    // this.getAnncmnt = page.getByRole('button', { name: 'OK' })
  }

  async getMetamaskId() {
    await this.page.goto('chrome://extensions/');
    await this.page.locator('#devMode').click();
    this.extensionId = (await this.page.locator('#extension-id').textContent()).substring(3).trim();
  }

  async connectMetamask() {
    await this.page.goto('chrome-extension://' + this.extensionId + '/home.html');
    await this.page.locator('#onboarding__terms-checkbox').click();
    await expect
      .soft(
        this.page.locator(
          '#app-content > div > div.mm-box.main-container-wrapper > div > div > div > ul > li:nth-child(3) > button'
        )
      )
      .toHaveText('Import an existing wallet');
    await this.page
      .locator(
        '#app-content > div > div.mm-box.main-container-wrapper > div > div > div > ul > li:nth-child(3) > button'
      )
      .click();
    await this.page.getByRole('button', {name: 'I agree'}).click();
    for (let i = 0; i < 12; i++) {
      await this.page.locator('#import-srp__srp-word-' + i).fill(metamask['srp-word'][i]);
    }
    await this.page.getByRole('button', {name: 'Confirm Secret Recovery Phrase'}).click();
    await this.page.getByTestId('create-password-new').fill(metamask['new-password']);
    await this.page.getByTestId('create-password-confirm').fill(metamask['new-password']);
    await this.page.getByTestId('create-password-terms').click();
    await this.page.getByRole('button', {name: 'Import My wallet'}).click();
    await this.page.getByRole('button', {name: 'Got it'}).click();
    await this.page.getByTestId('pin-extension-next').click();
    await this.page.getByTestId('pin-extension-done').click();
    await this.page.waitForTimeout(2000);
    await this.page.getByTestId('popover-close').click();
  }
  async connectWallet() {
    await this.page.goto('./');
    this.page.getByRole('button', {name: i18next.t('ANNOUNCEMENT_MODAL.OK_BUTTON')}).click();
    const pagePromise = this.context.newPage();
    await this.page.getByRole('button', {name: i18next.t('NAV_BAR.WALLET_CONNECT')}).click();
    await this.page.waitForTimeout(2000);
    await this.page
      .locator('div')
      .filter({hasText: /^MetaMask$/})
      .nth(1)
      .click();
    const newPage = await pagePromise;
    await newPage.goto('chrome-extension://' + this.extensionId + '/popup.html');
    await newPage.getByTestId('page-container-footer-next').click();
    await newPage.getByTestId('page-container-footer-next').click();
    await newPage.close();
  }
  async sendRequest() {
    const pagePromise = this.context.newPage();
    await this.page
      .getByRole('button', {
        name: i18next.t('WALLET_PANEL.SEND_REQUESTS_BUTTON'),
      })
      .click();
    const newPage = await pagePromise;
    await newPage.goto('chrome-extension://' + this.extensionId + '/popup.html');
    await newPage.getByTestId('signature-request-scroll-button').click();
    await newPage.getByTestId('page-container-footer-next').click();
    await this.page.getByRole('button', {name: i18next.t('WALLET_PANEL.DONE_BUTTON')}).click();
    await newPage.close();
  }
  async deposit() {
    // comfirm navAvailable
    const navAvailable = await this.page
      .locator(
        '#__next > div > div:nth-child(17) > nav > div > div > div.flex.items-center > div > div > div:nth-child(6) > div > div:nth-child(1) > div:nth-child(2)'
      )
      .textContent();
    const navAvailableNum = Number(navAvailable.substring(0, navAvailable.length - 4));
    // profile button
    await this.page
      .locator(
        '#__next > div > div.w-full.text-center> nav > div > div > div> div.mr-5.inline-flex > div > button'
      )
      .click();
    // deposit button
    await this.page.locator('#userDropdown > ul > li:nth-child(2) > button').click();
    // deposit process
    await this.page.getByRole('button', {name: i18next.t('D_W_MODAL.MAX')}).click();
    await this.page
      .locator(
        '#depositModal > div.relative.flex-auto.pt-0 > div > div > div:nth-child(4) > div > button'
      )
      .click();
    // deposit success or not
    const hasDeposit = await this.page
      .getByRole('button', {name: i18next.t('POSITION_MODAL.VIEW_ON_BUTTON')})
      .isVisible();
    if (hasDeposit) {
      this.page.reload();
      this.page.getByRole('button', {name: i18next.t('ANNOUNCEMENT_MODAL.OK_BUTTON')}).click();
      // profile button
      await this.page
        .locator(
          '#__next > div > div.w-full.text-center> nav > div > div > div> div.mr-5.inline-flex > div > button'
        )
        .click();
      // My assets button
      await this.page.locator('#userDropdown > ul > li:nth-child(1) > button > a').click();
      await this.page
        .getByRole('button', {
          name: i18next.t('ANNOUNCEMENT_MODAL.OK_BUTTON'),
        })
        .click();
      // click the eye
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
      let expectedNavAvailable = Number(assetsAvailable);
      expectedNavAvailable = expectedNavAvailable - 100;
      expect(navAvailableNum).toBe(expectedNavAvailable);
    }
  }
}
