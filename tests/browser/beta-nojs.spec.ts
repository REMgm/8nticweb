import { test, expect } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('beta without JavaScript never invites an unusable submission', async ({ page }) => {
  const apiRequests: string[] = [];
  page.on('request', request => {
    if (new URL(request.url()).pathname === '/api/beta-signups') apiRequests.push(request.url());
  });
  await page.goto('/beta');
  const form = page.locator('form.beta-form');
  if (await form.count()) {
    await expect(form).toHaveAttribute('method', 'post');
    await expect(form).toHaveAttribute('action', '/api/beta-signups');
    await expect(form.getByRole('group')).toHaveAttribute('disabled', '');
    await expect(page.getByLabel('Your name', { exact: true })).toBeDisabled();
    await expect(page.getByLabel('Email address', { exact: true })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Keep me in the loop' })).toBeDisabled();
    await expect(page.getByText('Turn on JavaScript to send this form.', { exact: false })).toBeVisible();
    await expect(page.locator('.beta-nojs a[href="/qip"]')).toBeVisible();
    await expect(page.locator('.beta-nojs a[href="/publications"]')).toBeVisible();
  } else {
    await expect(page.getByText('Signups aren’t open yet.', { exact: false })).toBeVisible();
    await expect(page.locator('.beta-prelaunch a[href="/qip"]')).toBeVisible();
    await expect(page.locator('.beta-prelaunch a[href="/publications"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toHaveCount(0);
  }
  expect(apiRequests).toEqual([]);
  expect(new URL(page.url()).pathname).toBe('/beta');
  expect(new URL(page.url()).search).toBe('');
});
