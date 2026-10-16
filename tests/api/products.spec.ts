import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/route';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

test.describe('FakeStore Products API Tests', () => {
  const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
  const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
  const LIMIT = Number(process.env.LIMIT ?? 3);
  const CATEGORY = 'electronics';

  // GET - Products

  test('GET - All Products @master @sanity @api', async ({ request }) => {
    const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);
    expect(response.status(), 'The products endpoint should return HTTP 200.').toBe(200);

    const products = await response.json();
    expect(Array.isArray(products), 'The response should be an array.').toBeTruthy();
    expect(products.length, 'At least one product should be returned.').toBeGreaterThan(0);
    expect(typeof products[0].id, 'Product IDs should be numeric.').toBe('number');
    expect(typeof products[0].title, 'Products should include a title.').toBe('string');
    expect(typeof products[0].price, 'Product prices should be numeric.').toBe('number');
    expect(typeof products[0].category, 'Products should include a category.').toBe('string');
    expect(typeof products[0].image, 'Products should include an image URL.').toBe('string');
  });

  test('GET - Product by ID @master @sanity @api', async ({ request }) => {
    const route = Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'A valid product ID should return HTTP 200.').toBe(200);

    const product = await response.json();
    expect(product.id, 'The returned product ID should match the requested ID.').toBe(PRODUCT_ID);
    expect(typeof product.title, 'The product should include a title.').toBe('string');
    expect(typeof product.price, 'The product price should be numeric.').toBe('number');
    expect(typeof product.category, 'The product should include a category.').toBe('string');
    expect(typeof product.image, 'The product should include an image URL.').toBe('string');
  });

  test('GET - Products with Limit @master @sanity @api', async ({ request }) => {
    const route = Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(LIMIT));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'The limited products endpoint should return HTTP 200.').toBe(200);

    const products = await response.json();
    expect(Array.isArray(products), 'The response should be an array.').toBeTruthy();
    expect(products.length, 'The response count should match the requested limit.').toBe(LIMIT);
  });

  test('GET - Products Sorted Ascending @master @regression @api', async ({ request }) => {
    const route = Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc');
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'The ascending sort request should return HTTP 200.').toBe(200);

    const products = await response.json();
    const productIds = products.map((product: { id: number }) => product.id);
    expect(productIds, 'Product IDs should be in ascending order.').toEqual([...productIds].sort((a, b) => a - b));
  });

  test('GET - Products Sorted Descending @master @regression @api', async ({ request }) => {
    const route = Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc');
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'The descending sort request should return HTTP 200.').toBe(200);

    const products = await response.json();
    const productIds = products.map((product: { id: number }) => product.id);
    expect(productIds, 'Product IDs should be in descending order.').toEqual(
      [...productIds].sort((a, b) => b - a),
    );
  });

  test('GET - All Product Categories @master @sanity @api', async ({ request }) => {
    const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);
    expect(response.status(), 'The categories endpoint should return HTTP 200.').toBe(200);

    const categories = await response.json();
    expect(Array.isArray(categories), 'The response should be an array.').toBeTruthy();
    expect(categories.length, 'At least one category should be returned.').toBeGreaterThan(0);
    expect(categories.every((category: unknown) => typeof category === 'string')).toBeTruthy();
  });

  test('GET - Products by Category @master @sanity @api', async ({ request }) => {
    const route = Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', CATEGORY);
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'The category request should return HTTP 200.').toBe(200);

    const products = await response.json();
    expect(Array.isArray(products), 'The response should be an array.').toBeTruthy();
    expect(products.length, 'The selected category should contain products.').toBeGreaterThan(0);
    expect(products.every((product: { category: string }) => product.category === CATEGORY)).toBeTruthy();
  });

  // POST - Create Product

  test('POST - Create Product @master @regression @api', async ({ request }) => {
    const payload = RandomDataUtil.generateProductPayload();
    const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });
    expect(response.status(), 'Creating a product should return HTTP 201.').toBe(201);

    const created = await response.json();
    expect(created.id, 'The created product should include an ID.').toBeTruthy();
    expect(created.title).toBe(payload.title);
    expect(created.price).toBe(payload.price);
    expect(created.description).toBe(payload.description);
    expect(created.image).toBe(payload.image);
    expect(created.category).toBe(payload.category);
  });

  // PUT - Update Product

  test('PUT - Update Product @master @regression @api', async ({ request }) => {
    const payload = RandomDataUtil.generateUpdatedProductPayload();
    const route = Routes.UPDATE_PRODUCT.replace('{id}', String(PRODUCT_ID));
    const response = await request.put(`${BASE_URL}${route}`, { data: payload });
    expect(response.status(), 'Updating a product should return HTTP 200.').toBe(200);

    const updated = await response.json();
    expect(updated.id, 'The updated product ID should match the requested ID.').toBe(PRODUCT_ID);
    expect(updated.title).toBe(payload.title);
    expect(updated.price).toBe(payload.price);
    expect(updated.description).toBe(payload.description);
    expect(updated.image).toBe(payload.image);
    expect(updated.category).toBe(payload.category);
  });

  // DELETE - Product

  test('DELETE - Product @master @regression @api', async ({ request }) => {
    const route = Routes.DELETE_PRODUCT.replace('{id}', String(PRODUCT_ID));
    const response = await request.delete(`${BASE_URL}${route}`);
    expect(response.status(), 'Deleting a product should return HTTP 200.').toBe(200);
  });
});