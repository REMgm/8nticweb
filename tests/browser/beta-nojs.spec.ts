import { test, expect } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('beta fallback posts privately and never puts signup details in a URL', async ({ page }) => {
  const navigationUrls: string[] = [];
  page.on('request', request => {
    if (request.isNavigationRequest()) navigationUrls.push(request.url());
  });

  await page.goto('/beta');
  const form = page.locator('form.beta-form');
  await expect(form).toHaveAttribute('method', 'post');
  await expect(form).toHaveAttribute('action', '/api/beta-signups');
  await page.getByLabel('Your name', { exact: true }).fill('No JavaScript verification');
  await page.getByLabel('Email address', { exact: true }).fill('8ntic-nojs-check@example.invalid');
  await page.getByRole('checkbox').check();

  const responsePromise = page.waitForResponse(response =>
    response.request().isNavigationRequest() &&
    new URL(response.url()).pathname === '/api/beta-signups',
  );
  await page.getByRole('button', { name: 'Keep me in the loop' }).click();
  const response = await responsePromise;
  expect(response.request().method()).toBe('POST');
  expect(new URL(response.url()).search).toBe('');
  expect(response.request().postData()).toContain('email=8ntic-nojs-check%40example.invalid');
  // Native form encoding is rejected before validation or persistence. No signup
  // is created, even when this regression check runs against a configured server.
  expect(response.status()).toBe(415);
  expect(await response.json()).toEqual({ message: 'Please submit the website form.' });
  for (const url of navigationUrls) expect(new URL(url).search).toBe('');
  expect(new URL(page.url()).pathname).toBe('/api/beta-signups');
  expect(new URL(page.url()).search).toBe('');
});
