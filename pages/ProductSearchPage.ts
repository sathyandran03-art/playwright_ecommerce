import { Locator, Page } from '@playwright/test';

export class ProductSearchPage {
  private readonly page: Page;

  // Locators
  private readonly resultsHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators with CSS selectors
    this.resultsHeading = page.getByRole('heading', { name: 'Products meeting the search criteria', exact: true });
  }

  /**
   * Checks whether product search results are displayed.
   * @returns Whether the results heading is visible
   */
  async areSearchResultsVisible(): Promise<boolean> {
    return this.resultsHeading.isVisible();
  }

  /**
   * Checks whether a product appears in the search results.
   * @param productName - Product to find
   * @returns Whether the product link is visible
   */
  async isProductVisible(productName: string): Promise<boolean> {
    return this.page
      .getByRole('heading', { name: productName, exact: true })
      .getByRole('link', { name: productName, exact: true })
      .isVisible();
  }

  /**
   * Opens a product from the search results.
   * @param productName - Product to open
   */
  async openProduct(productName: string): Promise<void> {
    await this.page
      .getByRole('heading', { name: productName, exact: true })
      .getByRole('link', { name: productName, exact: true })
      .click();
  }
}