import { test } from "@playwright/test";
import { PriceListPage } from "../pages/priceListPage";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  // Navigate to Price List page
  await loginPage.signInWith();
  await homePage.verifyHomePageLoaded();
  await homePage.clickPriceList();
});

test.only("Create & edit a new item price list", async ({ page }) => {
  const priceListPage = new PriceListPage(page);
  const priceListName = "Test Price List " + Date.now();
  const updatedPriceListName = `Updated - ${priceListName}`;
  const items = ["0000__", "00000000"];  
  const updatedItems = ["0000__", "00000000", "0000 Penny"];

  // Create a new price list
  await priceListPage.clickNewPriceList();
  await priceListPage.fillPriceListDetails(priceListName, items);
  await priceListPage.verifyItemsAdded(items);
  await priceListPage.adjustPrice("10");
  await priceListPage.clickSave();

  // Verify price list details in the table
  await priceListPage.verifyPriceListDetailsInTable(
    priceListName,
    items.length,
  );

  // Update the price list
  await priceListPage.openPriceList(priceListName);
  await priceListPage.fillPriceListDetails(updatedPriceListName, [
    "0000 Penny",
  ]);
  await priceListPage.verifyItemsAdded(updatedItems);
  await priceListPage.adjustPrice("20");
  await priceListPage.clickSave();

  // Verify updated price list details in the table
  await priceListPage.verifyPriceListDetailsInTable(
    updatedPriceListName,
    updatedItems.length,
  );

  // Verify updated details in the price list view
  await priceListPage.openPriceList(updatedPriceListName);
  await priceListPage.verifyItemsAdded(updatedItems);
  await priceListPage.verifyAdjustedPrice("20");
});
