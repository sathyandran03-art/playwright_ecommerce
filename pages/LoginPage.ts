import { Locator, Page } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;

  // Locators
  private readonly returningCustomerHeading: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.returningCustomerHeading = page.getByRole('heading', { name: 'Returning Customer', exact: true });
    this.emailInput = page.getByRole('textbox', { name: 'E-Mail Address' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login', exact: true });
  }

  /**
   * Checks whether the returning-customer login form is displayed.
   * @returns Whether the login form is visible
   */
  async isLoginPageVisible(): Promise<boolean> {
    return this.returningCustomerHeading.isVisible();
  }

  /**
   * Checks whether the invalid-credentials warning is displayed.
   * @returns Whether the expected login warning is visible
   */
  async isInvalidCredentialsWarningVisible(): Promise<boolean> {
    return this.page
      .getByText('Warning: No match for E-Mail Address and/or Password.', { exact: false })
      .isVisible();
  }

  /**
   * Logs in with the supplied customer credentials.
   * @param email - Customer email address
   * @param password - Customer password
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}