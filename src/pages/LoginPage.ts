import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole("textbox", {
      name: "Email address or username",
    });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.continueButton = page.getByRole("button", {
      name: "Continue",
      exact: true,
    });
  }

  async goto() {
    await this.page.goto("/sign-in");
  }

  async signIn(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.continueButton.click();
  }

  async signInWith(
    email: string = process.env.USEREMAIL!,
    password: string = process.env.PASSWORD!,
  ) {
    await this.goto();
    await this.emailInput.fill(email);
    await this.continueButton.click();
    await this.passwordInput.fill(password);
    await this.continueButton.click();

    await this.page.waitForURL(/scorecard/);
  }

  async verifyLoginPageLoaded() {
    await expect(this.page).toHaveURL(/sign-in/);
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.continueButton).toBeVisible();
  }
}
