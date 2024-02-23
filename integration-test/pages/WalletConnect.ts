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
    this.extensionId = '';
  }

  async getMetamaskId() {
    await this.page.goto('chrome://extensions/');
    await this.page.locator('#devMode').click();
    this.extensionId = ((await this.page.locator('#extension-id').textContent()) as string)
      .substring(3)
      .trim();
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
    await this.page.waitForTimeout(1500);
    await this.page.getByTestId('popover-close').click();
  }
  async connectWallet() {
    const okButton = {name: i18next.t('ANNOUNCEMENT_MODAL.OK_BUTTON')};
    const walletConnectButton = {name: i18next.t('NAV_BAR.WALLET_CONNECT')};
    await this.page.goto('./');
    this.page.getByRole('button', okButton).click();
    const pagePromise = this.context.newPage();
    await this.page.getByRole('button', walletConnectButton).click();
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
    const requestsButton = {
      name: i18next.t('WALLET_PANEL.SEND_REQUESTS_BUTTON'),
    };
    const doneButton = {name: i18next.t('WALLET_PANEL.DONE_BUTTON')};
    const pagePromise = this.context.newPage();
    await this.page.getByRole('button', requestsButton).click();
    const newPage = await pagePromise;
    await newPage.goto('chrome-extension://' + this.extensionId + '/popup.html');
    await newPage.getByTestId('signature-request-scroll-button').click();
    await newPage.getByTestId('page-container-footer-next').click();
    await this.page.getByRole('button', doneButton).click();
    await newPage.close();
  }
  async deposit() {
    const maxButton = {name: i18next.t('D_W_MODAL.MAX')};
    const okButton = {name: i18next.t('ANNOUNCEMENT_MODAL.OK_BUTTON')};
    const viewOnButton = {name: i18next.t('POSITION_MODAL.VIEW_ON_BUTTON')};
    await this.page.locator('#TotalBalanceShowButton').click();
    const navAvailable = await this.page
      .locator(
        '#__next > div > div.fixed.inset-x-0.top-0.z-40.bg-black > nav > div > div > div.flex.items-center > div > div > div > div.flex.justify-between.w-full.space-x-3.flex-1 > div:nth-child(1) > p'
      )
      .textContent();
    const navAvailableNum = (navAvailable as string).substring(
      0,
      (navAvailable as string).length - 4
    );
    await this.page.locator('#UserAvatarButton').click();
    await this.page.locator('#UserDeposit').click();
    await this.page.getByRole('button', maxButton).click();
    await this.page.locator('#DepositButton').click();
    const hasDeposit = await this.page.getByRole('button', viewOnButton).isVisible();
    if (hasDeposit) {
      this.page.reload();
      this.page.getByRole('button', okButton).click();
      // profile button
      await this.page.locator('#UserAvatarButton').click();
      await this.page.locator('#UserMyAssets').click();
      await this.page.getByRole('button', okButton).click();
      await this.page.locator('#ShowBalanceButton').click();
      const assetsAvailable = await this.page
        .locator(
          '#__next > div > div:nth-child(6) > main > div > div > div.pt-10 > div:nth-child(2) > div:nth-child(3) > span:nth-child(1)'
        )
        .textContent();
      let expectedNavAvailable = Number(assetsAvailable);
      expectedNavAvailable = expectedNavAvailable - 100;
      expect(navAvailableNum).toBe(expectedNavAvailable);
    }
  }
}
