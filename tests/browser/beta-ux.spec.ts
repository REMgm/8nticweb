import { test, expect } from '@playwright/test';

test('available beta form protects pending details and explains retry timing', async ({ page }) => {
  await page.goto('/beta');
  test.skip(await page.locator('form.beta-form').count() === 0, 'Collection is intentionally closed on this deployment.');
  await expect(page.getByLabel('Your name', { exact: true })).toBeEnabled();
  await page.getByLabel('Your name', { exact: true }).fill('Recovery check');
  await page.getByLabel('Email address', { exact: true }).fill('recovery@example.invalid');
  await page.locator('input[name="consent"]').check();
  let complete!: () => void;
  const gate = new Promise<void>(resolve => { complete = resolve; });
  await page.route('**/api/beta-signups', async route => {
    await gate;
    await route.fulfill({ status: 429, contentType: 'application/json', headers: { 'Retry-After': '120' }, body: JSON.stringify({ message: 'Please wait before trying again.' }) });
  });
  await page.getByRole('button', { name: 'Keep me in the loop' }).click();
  try {
    await expect(page.getByRole('button', { name: 'Sending your request…' })).toBeDisabled();
    await expect(page.getByLabel('Your name', { exact: true })).toBeDisabled();
    await expect(page.getByLabel('Email address', { exact: true })).toBeDisabled();
  } finally { complete(); }
  await expect(page.locator('.form-summary[role="alert"]')).toContainText('wait about 2 minutes');
  await expect(page.getByLabel('Email address', { exact: true })).toHaveValue('recovery@example.invalid');
  await expect(page.getByLabel('Email address', { exact: true })).toBeEnabled();
  await expect(page.getByText('Your request has arrived.')).toHaveCount(0);
});
