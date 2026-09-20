import { test, expect } from '@playwright/test';

test('NTIC offers useful destinations and dismisses predictably', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Always exploring', exact: true });
  await trigger.click();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const panel = page.locator('.curiosity-panel');
  await expect(panel.getByRole('link', { name: 'Try the memory loop' })).toHaveAttribute('href', '#the-loop');
  await panel.getByRole('button', { name: 'Another idea' }).click();
  await expect(panel.getByRole('link', { name: 'Meet the experiments' })).toHaveAttribute('href', '/experiments');
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await panel.getByRole('link', { name: 'Meet the experiments' }).click();
  await expect(page).toHaveURL(/\/experiments$/);
});

test('mascot chooser opens an experiment and provides its real destination', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/experiments');
  const chooser = page.getByRole('button', { name: 'Let NTIC choose', exact: true });
  await chooser.click();
  const recorder = page.locator('#exp-toggle-recorder');
  await expect(recorder).toHaveAttribute('aria-expanded', 'true');
  await expect(recorder).toBeFocused();
  await expect(page.getByRole('link', { name: /Open Recorder/ })).toHaveAttribute('href', 'https://recorder.8ntic.com');
  await chooser.click();
  await expect(page.locator('#exp-toggle-qip-adapter')).toHaveAttribute('aria-expanded', 'true');
  await expect(recorder).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.explorer-pick [aria-live]')).toContainText('QIP Adapter');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('new mascot movement respects reduced-motion preferences', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Always exploring', exact: true }).click();
  expect(await page.locator('.companion-button .mascot-mark').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  expect(await page.locator('.curiosity-panel').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
});
