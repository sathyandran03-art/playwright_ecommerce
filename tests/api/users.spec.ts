import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/route';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

test.describe('FakeStore Users API Tests', () => {
  const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
  const USER_ID = Number(process.env.USER_ID ?? 1);
  const LIMIT = Number(process.env.LIMIT ?? 3);

  // GET - Users

  test('GET - All Users @master @sanity @api', async ({ request }) => {
    const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);
    expect(response.status(), 'The users endpoint should return HTTP 200.').toBe(200);

    const users = await response.json();
    expect(Array.isArray(users), 'The response should be an array.').toBeTruthy();
    expect(users.length, 'At least one user should be returned.').toBeGreaterThan(0);
  });

  test('GET - User by ID @master @sanity @api', async ({ request }) => {
    const route = Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'A valid user ID should return HTTP 200.').toBe(200);

    const user = await response.json();
    expect(user.id, 'The returned user ID should match the requested ID.').toBe(USER_ID);
  });

  test('GET - Users with Limit @master @sanity @api', async ({ request }) => {
    const route = Routes.GET_USERS_WITH_LIMIT.replace('{limit}', String(LIMIT));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'The limited users endpoint should return HTTP 200.').toBe(200);

    const users = await response.json();
    expect(Array.isArray(users), 'The response should be an array.').toBeTruthy();
    expect(users.length, 'The response count should match the requested limit.').toBe(LIMIT);
  });

  test('GET - Users Sorted Ascending @master @regression @api', async ({ request }) => {
    const route = Routes.GET_USERS_SORTED.replace('{order}', 'asc');
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'The ascending sort request should return HTTP 200.').toBe(200);

    const users = await response.json();
    const userIds = users.map((user: { id: number }) => user.id);
    expect(userIds, 'User IDs should be in ascending order.').toEqual([...userIds].sort((a, b) => a - b));
  });

  test('GET - Users Sorted Descending @master @regression @api', async ({ request }) => {
    const route = Routes.GET_USERS_SORTED.replace('{order}', 'desc');
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'The descending sort request should return HTTP 200.').toBe(200);

    const users = await response.json();
    const userIds = users.map((user: { id: number }) => user.id);
    expect(userIds, 'User IDs should be in descending order.').toEqual([...userIds].sort((a, b) => b - a));
  });

  // POST - Create User

  test('POST - Create User @master @regression @api', async ({ request }) => {
    const payload = RandomDataUtil.generateUserPayload();
    const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });
    expect(response.status(), 'Creating a user should return HTTP 201.').toBe(201);

    const created = await response.json();
    expect(created.id, 'The created user should include an ID.').toBeTruthy();
    expect(typeof created.id, 'The created user ID should be numeric.').toBe('number');
  });

  // PUT - Update User

  test('PUT - Update User @master @regression @api', async ({ request }) => {
    const payload = RandomDataUtil.generateUserUpdatePayload();
    const route = Routes.UPDATE_USER.replace('{id}', String(USER_ID));
    const response = await request.put(`${BASE_URL}${route}`, { data: payload });
    expect(response.status(), 'Updating a user should return HTTP 200.').toBe(200);

    const updated = await response.json();
    expect(updated.username).toBe(payload.username);
    expect(updated.email).toBe(payload.email);
    expect(updated.name).toEqual(payload.name);
    expect(updated.phone).toBe(payload.phone);
  });

  // DELETE - User

  test('DELETE - User @master @regression @api', async ({ request }) => {
    const route = Routes.DELETE_USER.replace('{id}', String(USER_ID));
    const response = await request.delete(`${BASE_URL}${route}`);
    expect(response.status(), 'Deleting a user should return HTTP 200.').toBe(200);
  });
});