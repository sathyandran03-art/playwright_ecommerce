import { Locator, Page } from '@playwright/test';

export class RegisterPage {
  private readonly page: Page;

  // Locators
  private readonly registerHeading: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly telephoneInput: Locator;
  private readonly passwordInput: Locator;
  private readonly passwordConfirmInput: Locator;
  private readonly privacyPolicyCheckbox: Locator;
  private readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.registerHeading = page.getByRole('heading', { name: 'Register Account', exact: true });
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.emailInput = page.getByPlaceholder('E-Mail');
    this.telephoneInput = page.getByPlaceholder('Telephone');
    this.passwordInput = page.getByPlaceholder('Password', { exact: true });
    this.passwordConfirmInput = page.getByPlaceholder('Password Confirm');
    this.privacyPolicyCheckbox = page.getByRole('checkbox');
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
  }

  /**
   * Checks whether the registration form is displayed.
   * @returns Whether the registration form is visible
   */
  async isRegisterPageVisible(): Promise<boolean> {
    return this.registerHeading.isVisible();
  }

  /**
   * Creates a customer account with the supplied details.
   * @param firstName - Customer first name
   * @param lastName - Customer last name
   * @param email - Customer email address
   * @param telephone - Customer telephone number
   * @param password - Customer password
   */
  async registerCustomer(
    firstName: string,
    lastName: string,
    email: string,
    telephone: string,
    password: string,
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.telephoneInput.fill(telephone);
    await this.passwordInput.fill(password);
    await this.passwordConfirmInput.fill(password);
    await this.privacyPolicyCheckbox.check();
    await this.continueButton.click();
  }

  /**
   * Checks whether account creation succeeded.
   * @returns Whether the account-created heading is visible
   */
  async isAccountCreated(): Promise<boolean> {
    return this.page.getByRole('heading', { name: 'Your Account Has Been Created!', exact: true }).isVisible();
  }

  /**
   * Opens the authenticated account dashboard from the confirmation page.
   */
  async openAccountDashboard(): Promise<void> {
    await this.page.getByRole('complementary').getByRole('link', { name: 'My Account', exact: true }).click();
  }
}