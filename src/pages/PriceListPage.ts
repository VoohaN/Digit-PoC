import { expect, type Locator, type Page } from "@playwright/test";

export class PriceListPage {
  readonly page: Page;
  readonly newPriceListButton: Locator;
  readonly priceListNameInput: Locator;
  readonly itemsInput: Locator;
  readonly addItemsButton: Locator;
  readonly saveButton: Locator;
  readonly itemAvatar: Locator;
  readonly priceListNameCell: Locator;
  readonly adjustPriceInputField: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newPriceListButton = page.getByRole("button", {
      name: "New price list",
    });
    this.priceListNameInput = page.getByRole("textbox", { name: "Name" });
    this.itemsInput = page.getByRole("button", { name: "Search to add..." });
    this.addItemsButton = page.getByRole("button", { name: "Add items" });
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.itemAvatar = page.locator('[data-sentry-component="ItemAvatar"]');
    this.priceListNameCell = page.locator(
      'table tr [data-testid="InternalLink"]',
    );
    this.adjustPriceInputField = page
      .locator('div:has(h6:has-text("Adjust all"))')
      .getByRole("spinbutton");
  }

  async goto() {
    await this.page.goto("/sales/price-lists");
  }

  async clickNewPriceList() {
    await this.newPriceListButton.click();
  }

  async fillPriceListDetails(priceListName: string, items: string[]) {
    await this.priceListNameInput.fill(priceListName);
    await this.itemsInput.click();
    for (const item of items) {
      await this.page
        .getByRole("row", { name: `Toggle select row ${item}` })
        .first()
        .getByRole("checkbox")
        .check();
    }
    await this.addItemsButton.click();
  }

  async verifyItemsAdded(items: string[]) {
    for (const item of items) {
      const itemLocator = this.itemAvatar.filter({ hasText: item }).first();
      await expect(itemLocator).toBeVisible();
    }
  }

  async clickSave() {
    await this.saveButton.click();
    await expect(this.page.locator("h3")).toHaveText("Update price list");
  }

  async verifyPriceListDetailsInTable(
    priceListName: string,
    itemCount: number,
  ) {
    await this.goto();

    const priceListRow = this.page
      .getByRole("table")
      .locator(
        `tr:has([data-testid="InternalLink"]:has-text("${priceListName}"))`,
      );
    await expect(priceListRow).toBeVisible();

    const priceListStatus = priceListRow.locator('[data-testid="pill"]');
    await expect(priceListStatus).toHaveText("Active");

    const itemCountLocator = priceListRow.locator(`[data-index="2"]`);
    await expect(itemCountLocator).toHaveText(itemCount.toString());
  }

  async openPriceList(priceListName: string) {
    const priceListLink = this.priceListNameCell.filter({
      hasText: priceListName,
    });
    await priceListLink.click();
  }

  async adjustPrice(price: string) {
    await this.adjustPriceInputField.fill(price);
  }

  async verifyAdjustedPrice(price: string) {
    await expect(this.adjustPriceInputField).toHaveValue(price);
  }
}
