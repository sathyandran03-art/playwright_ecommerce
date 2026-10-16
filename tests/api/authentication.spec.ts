import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/route';
import { RandomDataUtil } from '../../utils/dataGenerator';

const dotenvConfig = dotenv.config();

test.describe('FakeStore Authentication API Tests', () => {
  const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
  const USERNAME = process.env.FAKESTORE_USERNAME ?? dotenvConfig.parsed?.USERNAME ?? process.env.USERNAME ?? '';
  const PASSWORD = process.env.FAKESTORE_PASSWORD ?? process.env.PASSWORD ?? dotenvConfig.parsed?.PASSWORD ?? '';

  test('POST - Successful Login @master @sanity @api', async ({ request }) => {
    const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
      data: { username: USERNAME, password: PASSWORD },
    });

    expect(response.status(), 'Valid credentials should return HTTP 201.').toBe(201);

    const responseBody = await response.json();
    expect(responseBody.token, 'The response should contain an authentication token.').toBeTruthy();
    expect(typeof responseBody.token, 'The authentication token should be a string.').toBe('string');
    expect(responseBody.token.length, 'The authentication token should not be empty.').toBeGreaterThan(0);
  });

  test('POST - Invalid Login @master @regression @api', async ({ request }) => {
    const payload = RandomDataUtil.generateInvalidLoginPayload();
    const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, { data: payload });

    expect(response.status(), 'Invalid credentials should return HTTP 401.').toBe(401);

    const responseBody = await response.text();
    expect(responseBody, 'The API should return its documented invalid-login message.').toBe(
      'username or password is incorrect',
    );
  });
});