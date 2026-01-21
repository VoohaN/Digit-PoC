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

test("Create & edit a new item price list", async ({ page }) => {
  const priceListPage = new PriceListPage(page);
  const priceListName = "Test Price List " + Date.now();
  const updatedPriceListName = `Updated - ${priceListName}`;
  const items = ["0000__", "00000000"];
  const updatedItems = ["0000__", "00000000", "0000 Penny"];

  // Create a new price list
  await priceListPage.clickNewPriceList();
  await priceListPage.fillPriceListDetails({ priceListName: priceListName, items: items });
  await priceListPage.verifyItemsAdded(items);
  await priceListPage.adjustPrice("10");
  await priceListPage.clickSave();

  // Verify price list details in the table
  await priceListPage.verifyPriceListDetailsInTable(priceListName, {
    itemCount: items.length, customerCount: 0,
  });

  // Update the price list
  await priceListPage.openPriceList(priceListName);
  await priceListPage.fillPriceListDetails({ priceListName: updatedPriceListName, items: ["0000 Penny"] });
  await priceListPage.verifyItemsAdded(updatedItems);
  await priceListPage.adjustPrice("20");
  await priceListPage.clickSave();

  // Verify updated price list details in the table
  await priceListPage.verifyPriceListDetailsInTable(updatedPriceListName, {
    itemCount: updatedItems.length,
  });

  // Verify updated details in the price list view
  await priceListPage.openPriceList(updatedPriceListName);
  await priceListPage.verifyItemsAdded(updatedItems);
  await priceListPage.verifyAdjustedPrice("20");
});

test("Create & edit a new customer price list", async ({ page }) => {
  const priceListPage = new PriceListPage(page);
  const priceListName = "Test Customer Price List " + Date.now();
  const updatedPriceListName = `Updated - ${priceListName}`;
  const customers = ["Adidas", "Alan Robison"];
  const updatedCustomers = ["Adidas", "Alan Robison", "Amazon"];

  // Create a new price list
  await priceListPage.clickNewPriceList();
  await priceListPage.fillPriceListDetails({ priceListName: priceListName, customers: customers });
  await priceListPage.verifyCustomersAdded(customers);
  await priceListPage.clickSave();

  // Verify customer price list details in the table
  await priceListPage.verifyPriceListDetailsInTable(
    priceListName, { itemCount: 0, customerCount: customers.length }
  );

    // Update the customer price list
    await priceListPage.openPriceList(priceListName);
    await priceListPage.fillPriceListDetails({ priceListName: updatedPriceListName, customers: ['Amazon'] });
    await priceListPage.verifyCustomersAdded(updatedCustomers);
    await priceListPage.clickSave();

    // Verify updated customer price list details in the table
    await priceListPage.verifyPriceListDetailsInTable(
      updatedPriceListName, { itemCount: 0, customerCount: updatedCustomers.length }
    );

    // Verify updated details in the customer price list view
    await priceListPage.openPriceList(updatedPriceListName);
    await priceListPage.verifyCustomersAdded(updatedCustomers);
});
