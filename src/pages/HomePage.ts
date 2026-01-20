import { expect, type Locator, type Page } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly scoreCardButton: Locator;
  readonly priceListOption: Locator;

  constructor(page: Page) {
    this.page = page;
    this.scoreCardButton = page.getByRole("button", { name: "Scorecard" });
    this.priceListOption = page.getByRole("button", { name: "Price lists" });
  }

  async goto() {
    await this.page.goto("/scorecard");
  }

  async verifyHomePageLoaded() {
    await expect(this.page).toHaveURL(/scorecard/);
    await expect(this.scoreCardButton).toBeVisible();
  }

  async clickPriceList() {
    await this.priceListOption.click();
  }
}
