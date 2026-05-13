import { expect, test } from '@playwright/test';

test('home page renders the brand', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'ACode Learn' })).toBeVisible();
});

test('login page is reachable', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
});
