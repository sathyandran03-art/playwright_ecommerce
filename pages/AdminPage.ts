import { Locator, Page } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export class AdminPage {
  private readonly page: Page;

  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly customersMenuToggle: Locator;
  private readonly customersSubMenu: Locator;
  private readonly customerListHeading: Locator;
  private readonly emailFilterInput: Locator;
  private readonly filterButton: Locator;
  private readonly customerRows: Locator;
  private readonly editCustomerHeading: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly statusSelect: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.customersMenuToggle = page.locator('a[href="#collapse5"]');
    this.customersSubMenu = page.locator('#collapse5');
    this.customerListHeading = page.getByRole('heading', { name: 'Customers', level: 1 });
    this.emailFilterInput = page.getByRole('textbox', { name: 'E-Mail' });
    this.filterButton = page.getByRole('button', { name: 'Filter' });
    this.customerRows = page.locator('table tbody tr');
    this.editCustomerHeading = page.getByRole('heading', { name: 'Edit Customer' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.emailInput = page.getByRole('textbox', { name: 'E-Mail' });
    this.statusSelect = page.getByRole('combobox', { name: 'Status' });
  }

  /**
   * Opens the OpenCart admin login page.
   */
  async openAdminPortal(): Promise<void> {
    const appUrl = process.env.WEB_APP_URL?.trim() || 'http://localhost/opencart/';
    const adminUrl = `${appUrl.replace(/\/?$/, '/')}admin/index.php`;
    await this.page.goto(adminUrl);
  }

  /**
   * Logs into the OpenCart admin portal.
   * @param username - Administrator username
   * @param password - Administrator password
   */
  async login(username: string, password: string): Promise<void> {
    await this.openAdminPortal();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForURL(/route=common\/dashboard/);
  }

  /**
   * Navigates to Customers → Customers in the admin navigation.
   */
  async openCustomers(): Promise<void> {
    await this.customersMenuToggle.click();
    await this.customersSubMenu.getByRole('link', { name: 'Customers' }).click();
    await this.customerListHeading.waitFor();
  }

  /**
   * Filters the customer list by e-mail address.
   * @param email - Customer e-mail address to search for
   */
  async searchCustomerByEmail(email: string): Promise<void> {
    await this.emailFilterInput.fill(email);
    await this.filterButton.click();
  }

  /**
   * Returns the customer list row matching the supplied e-mail address.
   * @param email - Customer e-mail address
   * @returns The matching table row locator
   */
  getCustomerRow(email: string): Locator {
    return this.customerRows.filter({ hasText: email });
  }

  /**
   * Opens the details of the customer matching the supplied e-mail address.
   * @param email - Customer e-mail address
   */
  async openCustomerDetails(email: string): Promise<void> {
    await this.getCustomerRow(email).getByRole('link').first().click();
    await this.editCustomerHeading.waitFor();
  }

  /**
   * Reads the first name from the open customer record.
   * @returns The customer first name
   */
  async getFirstName(): Promise<string> {
    return this.firstNameInput.inputValue();
  }

  /**
   * Reads the last name from the open customer record.
   * @returns The customer last name
   */
  async getLastName(): Promise<string> {
    return this.lastNameInput.inputValue();
  }

  /**
   * Reads the e-mail address from the open customer record.
   * @returns The customer e-mail address
   */
  async getCustomerEmail(): Promise<string> {
    return this.emailInput.inputValue();
  }

  /**
   * Reads the selected status label from the open customer record.
   * @returns The customer status label
   */
  async getStatus(): Promise<string> {
    return this.statusSelect.locator('option:checked').innerText();
  }
}
