import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/route';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

test.describe('FakeStore Carts API Tests', () => {
  const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
  const USER_ID = Number(process.env.USER_ID ?? 1);
  const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
  const CART_ID = Number(process.env.CART_ID ?? 1);
  const LIMIT = Number(process.env.LIMIT ?? 3);
  const START_DATE = process.env.START_DATE ?? '2019-12-10';
  const END_DATE = process.env.END_DATE ?? '2020-10-10';

  // GET - Carts

  test('GET - All Carts @master @sanity @api', async ({ request }) => {
    const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);
    expect(response.status(), 'The carts endpoint should return HTTP 200.').toBe(200);

    const carts = await response.json();
    expect(Array.isArray(carts), 'The response should be an array.').toBeTruthy();
    expect(carts.length, 'At least one cart should be returned.').toBeGreaterThan(0);
  });

  test('GET - Cart by ID @master @sanity @api', async ({ request }) => {
    const route = Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'A valid cart ID should return HTTP 200.').toBe(200);

    const cart = await response.json();
    expect(cart.id, 'The returned cart ID should match the requested ID.').toBe(CART_ID);
  });

  test('GET - Carts by Date Range @master @regression @api', async ({ request }) => {
    const route = Routes.GET_CARTS_BY_DATE_RANGE
      .replace('{startdate}', START_DATE)
      .replace('{enddate}', END_DATE);
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'The date-range request should return HTTP 200.').toBe(200);

    const carts = await response.json();
    expect(Array.isArray(carts), 'The response should be an array.').toBeTruthy();
    const startTime = new Date(START_DATE).getTime();
    const endTime = new Date(END_DATE).getTime() + 24 * 60 * 60 * 1000 - 1;
    expect(
      carts.every((cart: { date: string }) => {
        const cartTime = new Date(cart.date).getTime();
        return cartTime >= startTime && cartTime <= endTime;
      }),
      'Every returned cart date should fall within the requested range.',
    ).toBeTruthy();
  });

  test('GET - Carts by User @master @sanity @api', async ({ request }) => {
    const route = Routes.GET_USER_CART.replace('{userId}', String(USER_ID));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'The user-cart request should return HTTP 200.').toBe(200);

    const carts = await response.json();
    expect(Array.isArray(carts), 'The response should be an array.').toBeTruthy();
    expect(carts.length, 'The configured user should have carts.').toBeGreaterThan(0);
    expect(carts.every((cart: { userId: number }) => cart.userId === USER_ID)).toBeTruthy();
  });

  test('GET - Carts with Limit @master @sanity @api', async ({ request }) => {
    const route = Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', String(LIMIT));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'The limited carts endpoint should return HTTP 200.').toBe(200);

    const carts = await response.json();
    expect(Array.isArray(carts), 'The response should be an array.').toBeTruthy();
    expect(carts.length, 'The response count should match the requested limit.').toBe(LIMIT);
  });

  test('GET - Carts Sorted Ascending @master @regression @api', async ({ request }) => {
    const route = Routes.GET_CARTS_SORTED.replace('{order}', 'asc');
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'The ascending sort request should return HTTP 200.').toBe(200);

    const carts = await response.json();
    const cartIds = carts.map((cart: { id: number }) => cart.id);
    expect(cartIds, 'Cart IDs should be in ascending order.').toEqual([...cartIds].sort((a, b) => a - b));
  });

  test('GET - Carts Sorted Descending @master @regression @api', async ({ request }) => {
    const route = Routes.GET_CARTS_SORTED.replace('{order}', 'desc');
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'The descending sort request should return HTTP 200.').toBe(200);

    const carts = await response.json();
    const cartIds = carts.map((cart: { id: number }) => cart.id);
    expect(cartIds, 'Cart IDs should be in descending order.').toEqual([...cartIds].sort((a, b) => b - a));
  });

  // POST - Create Cart

  test('POST - Create Cart @master @regression @api', async ({ request }) => {
    const payload = RandomDataUtil.generateCartPayload(USER_ID);
    payload.products[0].productId = PRODUCT_ID;
    const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });
    expect(response.status(), 'Creating a cart should return HTTP 201.').toBe(201);

    const created = await response.json();
    expect(created.id, 'The created cart should include an ID.').toBeTruthy();
    expect(created.userId).toBe(USER_ID);
    expect(created.products).toEqual(payload.products);
  });

  // PUT - Update Cart

  test('PUT - Update Cart @master @regression @api', async ({ request }) => {
    const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
    payload.products[0].productId = PRODUCT_ID;
    const route = Routes.UPDATE_CART.replace('{id}', String(CART_ID));
    const response = await request.put(`${BASE_URL}${route}`, { data: payload });
    expect(response.status(), 'Updating a cart should return HTTP 200.').toBe(200);

    const updated = await response.json();
    expect(updated.userId).toBe(USER_ID);
    expect(updated.products).toEqual(payload.products);
  });

  // DELETE - Cart

  test('DELETE - Cart @master @regression @api', async ({ request }) => {
    const route = Routes.DELETE_CART.replace('{id}', String(CART_ID));
    const response = await request.delete(`${BASE_URL}${route}`);
    expect(response.status(), 'Deleting a cart should return HTTP 200.').toBe(200);
  });
});