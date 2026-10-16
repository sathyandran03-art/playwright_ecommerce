import { Locator, Page } from '@playwright/test';

export class ProductPage {
  private readonly page: Page;

  // Locators
  private readonly productHeading: Locator;
  private readonly productPrice: Locator;
  private readonly quantityInput: Locator;
  private readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.productHeading = page.getByRole('heading', { level: 1 });
    this.productPrice = page.getByRole('heading', { level: 2 });
    this.quantityInput = page.getByRole('textbox', { name: 'Qty' });
    this.addToCartButton = page.getByRole('button', { name: 'Add to Cart', exact: true });
  }

  /**
   * Checks whether the requested product details are displayed.
   * @param productName - Product to verify
   * @returns Whether the product heading matches
   */
  async isProductVisible(productName: string): Promise<boolean> {
    return this.productHeading.getByText(productName, { exact: true }).isVisible();
  }

  /**
   * Reads the displayed product price.
   * @returns Product price text
   */
  async getProductPrice(): Promise<string> {
    return this.productPrice.innerText();
  }

  /**
   * Sets the requested quantity and adds the product to the cart.
   * @param quantity - Quantity to add
   */
  async addToCart(quantity: string): Promise<void> {
    await this.quantityInput.fill(quantity);
    await this.addToCartButton.click();
  }

  /**
   * Checks whether the store confirms that the product was added.
   * @returns Whether the add-to-cart confirmation is visible
   */
  async isAddToCartConfirmationVisible(): Promise<boolean> {
    const confirmation = this.page.getByText('Success: You have added', { exact: false });
    await confirmation.waitFor({ state: 'visible' });
    return confirmation.isVisible();
  }

  /**
   * Opens the shopping cart from the add-to-cart confirmation.
   */
  async openShoppingCart(): Promise<void> {
    await this.page.getByRole('link', { name: 'shopping cart', exact: true }).click();
  }
}