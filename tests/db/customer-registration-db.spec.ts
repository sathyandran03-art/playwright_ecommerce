/**
 * Test Case: Register a customer on the OpenCart frontend, then verify the same
 * customer in the OpenCart admin portal and the MySQL `oc_customer` table.
 *
 * Tags: @master @regression @db @end-to-end
 *
 * Steps:
 * 1) Register a customer through the storefront
 * 2) Verify the customer in the admin portal
 * 3) Verify the customer in MySQL
 */

import { test, expect } from '../../fixtures/pageFixtures';
import dotenv from 'dotenv';
import type { RowDataPacket } from 'mysql2';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { executeQuery } from '../../utils/dbClient';

dotenv.config();

test.describe('OpenCart Customer Cross-Layer Validation', () => {
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? 'admin';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin';

  test('Customer Registration Verified Across UI, Admin, and MySQL @master @regression @db @end-to-end', async ({
    homePage,
    registerPage,
    adminPage,
  }) => {
    test.setTimeout(120000);

    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = RandomDataUtil.getEmail().replace('@', `.${Date.now()}@`);
    const telephone = RandomDataUtil.getPhoneNumber();
    const password = RandomDataUtil.getPassword(12);

    await test.step('1) Register a customer through the storefront', async () => {
      await homePage.openRegistrationPage();
      expect(await registerPage.isRegisterPageVisible()).toBeTruthy();
      await registerPage.registerCustomer(firstName, lastName, email, telephone, password);
      expect(await registerPage.isAccountCreated()).toBeTruthy();
    });

    await test.step('2) Verify the customer in the admin portal', async () => {
      await adminPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
      await adminPage.openCustomers();
      await adminPage.searchCustomerByEmail(email);

      const customerRow = adminPage.getCustomerRow(email);
      await expect(customerRow, 'Exactly one admin customer should match the registered e-mail.').toHaveCount(1);
      await expect(customerRow, 'The admin customer name should match the registered name.').toContainText(
        `${firstName} ${lastName}`,
      );
      await expect(customerRow, 'The admin customer should be enabled.').toContainText('Enabled');

      await adminPage.openCustomerDetails(email);
      expect(await adminPage.getFirstName(), 'Admin first name should match the registered first name.').toBe(firstName);
      expect(await adminPage.getLastName(), 'Admin last name should match the registered last name.').toBe(lastName);
      expect(await adminPage.getCustomerEmail(), 'Admin e-mail should match the registered e-mail.').toBe(email);
      expect(await adminPage.getStatus(), 'Admin customer status should be enabled.').toBe('Enabled');
    });

    await test.step('3) Verify the customer in the oc_customer table', async () => {
      const rows = (await executeQuery(
        'SELECT firstname, lastname, email, status, date_added FROM oc_customer WHERE email = ?',
        [email],
      )) as RowDataPacket[];

      expect(rows.length, 'Exactly one database row should match the registered e-mail.').toBe(1);
      expect(rows[0].firstname, 'Database first name should match the registered first name.').toBe(firstName);
      expect(rows[0].lastname, 'Database last name should match the registered last name.').toBe(lastName);
      expect(rows[0].email, 'Database e-mail should match the registered e-mail.').toBe(email);
      expect(rows[0].status, 'Database status should be enabled (1).').toBe(1);
      expect(rows[0].date_added, 'Database date_added should be recorded.').toBeTruthy();
    });

    console.log('✅ Customer verified across UI, Admin, and MySQL.');
  });
});
