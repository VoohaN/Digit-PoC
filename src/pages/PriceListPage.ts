import { expect, type Locator, type Page } from "@playwright/test";

type FillPriceListOptions = {
  priceListName?: string;
  items?: string[];
  customers?: string[];
};

type PriceListVerificationOptions = {
  itemCount?: number;
  customerCount?: number;
  status?: "Active" | "Inactive";
};

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
  readonly customerTab: Locator;
  readonly addCustomersButton: Locator;

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
    this.customerTab = page.getByRole("tab", { name: "Customers" });
    this.addCustomersButton = page.getByRole("button", {
      name: "Add customers",
    });
  }

  async goto() {
    await this.page.goto("/sales/price-lists");
  }

  async clickNewPriceList() {
    await this.newPriceListButton.click();
  }

  async fillPriceListName(priceListName: string) {
    await this.priceListNameInput.fill(priceListName);
  }

  async fillPriceListDetails(options: FillPriceListOptions = {}) {
    const { priceListName, items, customers } = options;

    if (priceListName) {
      await this.fillPriceListName(priceListName);
    }

    if (items?.length) {
      await this.addItems(items);
    }
    if (customers?.length) {
      await this.addCustomers(customers);
    }
  }

  async addItems(items: string[]) {
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

  async addCustomers(customers: string[]) {
    await this.customerTab.click();
    await this.itemsInput.click();

    for (const customer of customers) {
      await this.page
        .getByRole("row", { name: `Toggle select row ${customer}` })
        .first()
        .getByRole("checkbox")
        .check();
    }

    await this.addCustomersButton.click();
  }

  async verifyItemsAdded(items: string[]) {
    for (const item of items) {
      const itemLocator = this.itemAvatar.filter({ hasText: item }).first();
      await expect(itemLocator).toBeVisible();
    }
  }

  async verifyCustomersAdded(customers: string[]) {
    for (const customer of customers) {
      const customerLocator = this.page.locator(`[aria-label="${customer}"]`);
      await expect(customerLocator).toBeVisible();
    }
  }

  async clickSave() {
    await expect(this.saveButton).toBeVisible();
    await expect(this.saveButton).toBeEnabled();
    await this.saveButton.scrollIntoViewIfNeeded();
    await this.saveButton.click({ force: true });
    await this.page.waitForLoadState("networkidle");
    await expect(this.page.locator("h3")).toHaveText("Update price list");
  }

  async verifyPriceListDetailsInTable(
    priceListName: string,
    options: PriceListVerificationOptions = {},
  ) {
    const { itemCount, customerCount, status = "Active" } = options;

    await this.goto();

    const priceListRow = this.page
      .getByRole("table")
      .locator(
        `tr:has([data-testid="InternalLink"]:has-text("${priceListName}"))`,
      );
    await expect(priceListRow).toBeVisible();

    const priceListStatus = priceListRow.locator('[data-testid="pill"]');
    await expect(priceListStatus).toHaveText(status);

    if (itemCount !== undefined) {
      await expect(priceListRow.locator('[data-index="2"]')).toHaveText(
        itemCount.toString(),
      );
    }

    if (customerCount !== undefined) {
      await expect(priceListRow.locator('[data-index="3"]')).toHaveText(
        customerCount.toString(),
      );
    }
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
