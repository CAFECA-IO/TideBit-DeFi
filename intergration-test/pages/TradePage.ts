import { expect, type Locator, type Page, type BrowserContext } from "@playwright/test";
import i18next from "i18next";

export class TradePage {
  readonly page: Page;
  readonly getAnncmnt: Locator;
  readonly context: BrowserContext;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.getAnncmnt = page.getByRole("button", { name: i18next.t("ANNOUNCEMENT_MODAL.OK_BUTTON") });
    this.context = context;
  }

  async goto() {
    await this.page.goto("./trade/cfd/eth-usdt");
    await expect.soft(this.page).toHaveTitle(/CFD/);
  }

  async gotoBTC() {
    await this.page.goto("./trade/cfd/btc-usdt");
    await expect.soft(this.page).toHaveTitle(/CFD/);
  }

  async clickAnncmnt() {
    if (this.getAnncmnt) {
      await this.getAnncmnt.click();
    }
  }
  async inputAmount(amount ="0.01") {
    await this.page.getByPlaceholder("amount input").fill(amount);
  }

  async openLongPosition(extensionId) {
    const pagePromise = this.context.newPage();
    await this.page.getByRole('button', { name: i18next.t("TRADE_PAGE.TRADE_TAB_LONG_BUTTON") }).click();
    await this.page.getByRole('button', { name: i18next.t("POSITION_MODAL.CONFIRM_BUTTON") }).click();
    const newPage = await pagePromise;
    await newPage.goto(
      "chrome-extension://" + extensionId + "/popup.html"
    );
    await newPage.getByTestId("signature-request-scroll-button").click();
    await newPage.getByTestId("page-container-footer-next").click();
    await this.page.locator("#__next > div > div:nth-child(11) > div > div > div > div > button > span > svg").click();
    newPage.close();
  }
  async openShortPosition(extensionId) {
    const pagePromise = this.context.newPage();
    await this.page.getByRole('button', { name: i18next.t("TRADE_PAGE.TRADE_TAB_SHORT_BUTTON") }).click();
    await this.page.getByRole('button', { name: i18next.t("POSITION_MODAL.CONFIRM_BUTTON") }).click();
    const newPage = await pagePromise;
    await newPage.goto(
      "chrome-extension://" + extensionId + "/popup.html"
    );
    await newPage.getByTestId("signature-request-scroll-button").click();
    await newPage.getByTestId("page-container-footer-next").click();
    await this.page.locator("#__next > div > div:nth-child(11) > div > div > div > div > button > span > svg").click();
    newPage.close();
  }

  // number="1" means the last position
  async updatePosition(extensionId ,number = "1") {
    await this.page.getByRole('button', { name: i18next.t("TRADE_PAGE.POSITION_TAB") }).click();
    await this.page.locator("#__next > div > main > div > div:nth-child(3) > div > div > div > div > div:nth-last-child("+number+")").click();
    await this.page.locator('.bg-white').first().click();
    await this.page.locator("#__next > div > div:nth-child(11) > div > div > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > input").check();
    const pagePromise = this.context.newPage();
    await this.page.getByRole('button', { name: i18next.t("POSITION_MODAL.UPDATE_POSITION_TITLE") }).click();
    await this.page.getByRole('button', { name: i18next.t("POSITION_MODAL.CONFIRM_BUTTON") }).click();
    const newPage = await pagePromise;
    await newPage.goto(
      "chrome-extension://" + extensionId + "/popup.html"
    );
    await newPage.getByTestId("signature-request-scroll-button").click();
    await newPage.getByTestId("page-container-footer-next").click();
    await this.page.locator("#__next > div > div:nth-child(11) > div > div > div > div > button > span > svg").click();
    newPage.close();
  }
  async closePosition(extensionId ,number = "1") {
    await this.page.getByRole('button', { name: i18next.t("TRADE_PAGE.POSITION_TAB") }).click();
    await this.page.locator("#__next > div > main > div > div:nth-child(3) > div > div > div > div > div:nth-last-child("+number+") > div > div:nth-child(4) > div:nth-child(3)").click();
    const pagePromise = this.context.newPage();
    await this.page.getByRole('button', { name: i18next.t("POSITION_MODAL.CONFIRM_BUTTON") }).click();
    // await this.page.waitForTimeout(2000);
    const newPage = await pagePromise;
    await newPage.goto(
      "chrome-extension://" + extensionId + "/popup.html"
    );
    await newPage.getByTestId("signature-request-scroll-button").click();
    await newPage.getByTestId("page-container-footer-next").click();
    await this.page.locator("#__next > div > div:nth-child(11) > div > div > div > div > button > span > svg").click();
    newPage.close();
  }
}
