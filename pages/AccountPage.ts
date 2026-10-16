import { Locator, Page } from '@playwright/test';

export class AccountPage {
  private readonly page: Page;

  // Locators
  private readonly accountHeading: Locator;
  private readonly logoutHeading: Locator;
  private readonly sidebar: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.accountHeading = page.locator('#content').getByRole('heading', { name: 'My Account', exact: true });
    this.logoutHeading = page.getByRole('heading', { name: 'Account Logout', exact: true });
    this.sidebar = page.getByRole('complementary');
  }

  /**
   * Checks whether the authenticated account dashboard is displayed.
   * @returns Whether the account dashboard is visible
   */
  async isAccountDashboardVisible(): Promise<boolean> {
    return this.accountHeading.isVisible();
  }

  /**
   * Logs out the current customer.
   */
  async logout(): Promise<void> {
    await this.sidebar.getByRole('link', { name: 'Logout', exact: true }).click();
  }

  /**
   * Checks whether the logout confirmation is displayed.
   * @returns Whether the logout confirmation is visible
   */
  async isLogoutConfirmationVisible(): Promise<boolean> {
    return this.logoutHeading.isVisible();
  }

  /**
   * Continues from the logout confirmation page.
   */
  async continueAfterLogout(): Promise<void> {
    await this.page.getByRole('link', { name: 'Continue', exact: true }).click();
  }

  /**
   * Opens the login page from the logged-out account navigation.
   */
  async openLoginPage(): Promise<void> {
    await this.sidebar.getByRole('link', { name: 'Login', exact: true }).click();
  }
}