import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/route';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

test.describe('FakeStore CRUD Workflows', () => {
  const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
  const USER_ID = Number(process.env.USER_ID ?? 1);
  const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);

  test('Product Create, Update, Delete Workflow @master @regression @api', async ({ request }) => {
    const createPayload = RandomDataUtil.generateProductPayload();
    const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: createPayload });
    expect(createResponse.status(), 'Product creation should return HTTP 201.').toBe(201);

    const created = await createResponse.json();
    expect(created.id, 'The create response should supply the product ID for later steps.').toBeTruthy();
    const productId = Number(created.id);

    const updatePayload = RandomDataUtil.generateUpdatedProductPayload();
    const updateRoute = Routes.UPDATE_PRODUCT.replace('{id}', String(productId));
    const updateResponse = await request.put(`${BASE_URL}${updateRoute}`, { data: updatePayload });
    expect(updateResponse.status(), 'Product update should return HTTP 200.').toBe(200);

    const updated = await updateResponse.json();
    expect(updated.id).toBe(productId);
    expect(updated.title).toBe(updatePayload.title);
    expect(updated.price).toBe(updatePayload.price);

    const deleteRoute = Routes.DELETE_PRODUCT.replace('{id}', String(productId));
    const deleteResponse = await request.delete(`${BASE_URL}${deleteRoute}`);
    expect(deleteResponse.status(), 'Product deletion should return HTTP 200.').toBe(200);
  });

  test('User Create, Update, Delete Workflow @master @regression @api', async ({ request }) => {
    const createPayload = RandomDataUtil.generateUserPayload();
    const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: createPayload });
    expect(createResponse.status(), 'User creation should return HTTP 201.').toBe(201);

    const created = await createResponse.json();
    expect(created.id, 'The create response should supply the user ID for later steps.').toBeTruthy();
    const userId = Number(created.id);

    const updatePayload = RandomDataUtil.generateUserUpdatePayload();
    const updateRoute = Routes.UPDATE_USER.replace('{id}', String(userId));
    const updateResponse = await request.put(`${BASE_URL}${updateRoute}`, { data: updatePayload });
    expect(updateResponse.status(), 'User update should return HTTP 200.').toBe(200);

    const updated = await updateResponse.json();
    expect(updated.username).toBe(updatePayload.username);
    expect(updated.email).toBe(updatePayload.email);
    expect(updated.name).toEqual(updatePayload.name);

    const deleteRoute = Routes.DELETE_USER.replace('{id}', String(userId));
    const deleteResponse = await request.delete(`${BASE_URL}${deleteRoute}`);
    expect(deleteResponse.status(), 'User deletion should return HTTP 200.').toBe(200);
  });

  test('Cart Create, Update, Delete Workflow @master @regression @api', async ({ request }) => {
    const createPayload = RandomDataUtil.generateCartPayload(USER_ID);
    createPayload.products[0].productId = PRODUCT_ID;
    const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: createPayload });
    expect(createResponse.status(), 'Cart creation should return HTTP 201.').toBe(201);

    const created = await createResponse.json();
    expect(created.id, 'The create response should supply the cart ID for later steps.').toBeTruthy();
    expect(created.userId).toBe(USER_ID);
    expect(created.products).toEqual(createPayload.products);
    const cartId = Number(created.id);

    const updatePayload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
    updatePayload.products[0].productId = PRODUCT_ID;
    updatePayload.products[0].quantity = createPayload.products[0].quantity === 1
      ? 2
      : createPayload.products[0].quantity - 1;
    const updateRoute = Routes.UPDATE_CART.replace('{id}', String(cartId));
    const updateResponse = await request.put(`${BASE_URL}${updateRoute}`, { data: updatePayload });
    expect(updateResponse.status(), 'Cart update should return HTTP 200.').toBe(200);

    const updated = await updateResponse.json();
    expect(updated.products[0].quantity).toBe(updatePayload.products[0].quantity);

    const deleteRoute = Routes.DELETE_CART.replace('{id}', String(cartId));
    const deleteResponse = await request.delete(`${BASE_URL}${deleteRoute}`);
    expect(deleteResponse.status(), 'Cart deletion should return HTTP 200.').toBe(200);
  });
});