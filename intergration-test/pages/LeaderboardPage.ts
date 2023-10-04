import { expect, type Locator, type Page } from "@playwright/test";
import i18next from "i18next";

export class LeaderboardPage {
  readonly page: Page;
  readonly getAnncmnt: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getAnncmnt = page.getByRole("button", {
      name: i18next.t("ANNOUNCEMENT_MODAL.OK_BUTTON"),
    });
  }

  async goto() {
    await this.page.goto("./leaderboard");
  }

  async clickAnncmnt() {
    if (this.getAnncmnt) {
        await this.getAnncmnt.click();
      }
  }
}