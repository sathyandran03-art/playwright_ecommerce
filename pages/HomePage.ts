import { Locator, Page } from '@playwright/test';

export class HomePage {
  private readonly page: Page;

  // Locators
  private readonly accountNavigation: Locator;
  private readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.accountNavigation = page.getByRole('navigation').first();
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
  }

  /**
   * Opens the customer registration page.
   */
  async openRegistrationPage(): Promise<void> {
    await this.accountNavigation.getByRole('link', { name: /My Account/ }).click();
    await this.page.getByRole('link', { name: 'Register', exact: true }).click();
  }

  /**
   * Opens the customer login page.
   */
  async openLoginPage(): Promise<void> {
    await this.accountNavigation.getByRole('link', { name: /My Account/ }).click();
    await this.page.getByRole('link', { name: 'Login', exact: true }).click();
  }

  /**
   * Checks whether the store homepage is displayed.
   * @returns Whether the store logo is visible
   */
  async isHomePageVisible(): Promise<boolean> {
    return this.page.getByRole('img', { name: 'Your Store' }).isVisible();
  }

  /**
   * Checks whether registration and login options are available while logged out.
   * @returns Whether both account options are visible
   */
  async areLoggedOutAccountOptionsVisible(): Promise<boolean> {
    await this.accountNavigation.getByRole('link', { name: /My Account/ }).click();
    const registerVisible = this.accountNavigation.getByRole('link', { name: 'Register', exact: true }).isVisible();
    const loginVisible = this.accountNavigation.getByRole('link', { name: 'Login', exact: true }).isVisible();
    const [isRegisterVisible, isLoginVisible] = await Promise.all([registerVisible, loginVisible]);
    return isRegisterVisible && isLoginVisible;
  }

  /**
   * Searches the store for a product.
   * @param productName - Product to search for
   */
  async searchForProduct(productName: string): Promise<void> {
    await this.searchInput.fill(productName);
    await this.searchInput.press('Enter');
  }
}