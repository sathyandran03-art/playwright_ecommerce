import { Locator, Page } from '@playwright/test';

export class CartPage {
  private readonly page: Page;
  private readonly cartHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.cartHeading = page.getByRole('heading', { name: /Shopping Cart/ });
  }

  /**
   * Checks whether the shopping cart is displayed.
   * @returns Whether the cart heading is visible
   */
  async isCartVisible(): Promise<boolean> {
    return this.cartHeading.isVisible();
  }

  /**
   * Checks whether a product is present in the cart.
   * @param productName - Product to find
   * @returns Whether the product link is visible in the cart
   */
  async isProductInCart(productName: string): Promise<boolean> {
    return this.getProductRow(productName)
      .getByRole('cell')
      .nth(1)
      .getByRole('link', { name: productName, exact: true })
      .isVisible();
  }

  /**
   * Reads the quantity for a product in the cart.
   * @param productName - Product whose quantity to read
   * @returns Quantity displayed in the cart
   */
  async getProductQuantity(productName: string): Promise<string> {
    return this.getProductRow(productName).getByRole('textbox').inputValue();
  }

  /**
   * Reads the unit price for a product in the cart.
   * @param productName - Product whose unit price to read
   * @returns Unit price displayed in the cart
   */
  async getProductUnitPrice(productName: string): Promise<string> {
    return this.getProductRow(productName).getByRole('cell').nth(4).innerText();
  }

  /**
   * Reads the cart's grand total.
   * @returns Total shown in the cart summary
   */
  async getCartTotal(): Promise<string> {
    return this.page
      .getByRole('row')
      .filter({ has: this.page.getByText('Total:', { exact: true }) })
      .getByRole('cell')
      .nth(1)
      .innerText();
  }

  private getProductRow(productName: string): Locator {
    return this.page.getByRole('row').filter({
      has: this.page.getByRole('link', { name: productName, exact: true }),
    });
  }
}