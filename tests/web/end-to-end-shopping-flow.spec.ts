import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';

test('End-to-End Shopping Flow @master @regression @e2e @web', async ({
  homePage,
  registerPage,
  accountPage,
  loginPage,
  productSearchPage,
  productPage,
  cartPage,
}) => {
  const { productName, productQuantity, totalPrice } = Helper.getProductDetails();
  const firstName = RandomDataUtil.getFirstName();
  const lastName = RandomDataUtil.getLastName();
  const email = RandomDataUtil.getEmail().replace('@', `.${Date.now()}@`);
  const telephone = RandomDataUtil.getPhoneNumber();
  const password = RandomDataUtil.getPassword(12);

  await test.step('1) Open the store and register a customer', async () => {
    await homePage.openRegistrationPage();
    expect(await registerPage.isRegisterPageVisible()).toBeTruthy();
    await registerPage.registerCustomer(firstName, lastName, email, telephone, password);
    expect(await registerPage.isAccountCreated()).toBeTruthy();
  });

  await test.step('2) Verify the account and log out', async () => {
    await registerPage.openAccountDashboard();
    expect(await accountPage.isAccountDashboardVisible()).toBeTruthy();
    await accountPage.logout();
    expect(await accountPage.isLogoutConfirmationVisible()).toBeTruthy();
  });

  await test.step('3) Log in with the new customer credentials', async () => {
    await accountPage.openLoginPage();
    expect(await loginPage.isLoginPageVisible()).toBeTruthy();
    await loginPage.login(email, password);
    expect(await accountPage.isAccountDashboardVisible()).toBeTruthy();
  });

  await test.step('4) Search for and open the known product', async () => {
    await homePage.searchForProduct(productName);
    expect(await productSearchPage.areSearchResultsVisible()).toBeTruthy();
    expect(await productSearchPage.isProductVisible(productName)).toBeTruthy();
    await productSearchPage.openProduct(productName);
    expect(await productPage.isProductVisible(productName)).toBeTruthy();
    expect(await productPage.getProductPrice()).toBe(totalPrice);
  });

  await test.step('5) Add the product and verify the shopping cart', async () => {
    await productPage.addToCart(productQuantity);
    expect(await productPage.isAddToCartConfirmationVisible()).toBeTruthy();
    await productPage.openShoppingCart();
    expect(await cartPage.isCartVisible()).toBeTruthy();
    expect(await cartPage.isProductInCart(productName)).toBeTruthy();
    expect(await cartPage.getProductQuantity(productName)).toBe(productQuantity);
    expect(await cartPage.getProductUnitPrice(productName)).toBe(totalPrice);
    expect(await cartPage.getCartTotal()).toBe(totalPrice);
  });

  console.log('End-to-end shopping flow completed successfully.');
});