import { test, expect } from '@playwright/test';

test('mobile navigation closes predictably for keyboard, outside pointer and desktop resize', async ({ page, browserName }) => {
  // WebKit's default keyboard preference uses Option+Tab to include links.
  const nextFocusable = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/qip');
  const toggle = page.locator('.menu-toggle');
  const navigation = page.getByRole('navigation', { name: 'Mobile navigation' });

  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(navigation).toBeVisible();
  await page.keyboard.press(nextFocusable);
  await expect(navigation.getByRole('link', { name: 'QIP', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(navigation).toBeHidden();
  await expect(toggle).toBeFocused();

  await toggle.click();
  await navigation.getByRole('link', { name: 'Get beta updates', exact: true }).focus();
  await page.keyboard.press(nextFocusable);
  await expect(navigation).toBeHidden();
  await expect(page.getByRole('link', { name: /Read the thesis/ })).toBeFocused();

  await toggle.click();
  await page.mouse.click(5, 720);
  await expect(navigation).toBeHidden();

  await toggle.click();
  await navigation.getByRole('link', { name: 'QIP', exact: true }).click();
  await expect(navigation).toBeHidden();
  await expect(toggle).toBeFocused();

  await toggle.click();
  await navigation.getByRole('link', { name: 'Research', exact: true }).focus();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(navigation).toBeHidden();
  await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Research', exact: true })).toBeFocused();
});

test('motion choices persist, sync across tabs and remain consistent with the OS preference', async ({ page, context }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  await page.getByRole('button', { name: 'Pause ambient motion' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');

  const other = await context.newPage();
  await other.goto('/about');
  await expect(other.locator('html')).toHaveAttribute('data-motion', 'off');
  await other.getByRole('button', { name: 'Enable ambient motion' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  await other.close();

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  const locked = page.getByRole('button', { name: 'Enable ambient motion' });
  await expect(locked).toBeDisabled();
  await expect(locked).toHaveAccessibleDescription('Motion is disabled by your device’s reduced-motion preference.');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  await expect(page.getByRole('button', { name: 'Pause ambient motion' })).toBeEnabled();
});

test('sound remains opt-in and browser audio failures are caught and announced', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    const state = { created: 0, resumed: 0, suspended: 0, failResume: false };
    Object.assign(window, { audioTestState: state });
    const parameter = () => ({ value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} });
    class StubAudioContext {
      state = 'suspended';
      currentTime = 0;
      destination = {};
      constructor() { state.created++; }
      createGain() { return { gain: parameter(), connect(target: unknown) { return target; }, disconnect() {} }; }
      createOscillator() { return { type: 'sine', frequency: parameter(), connect(target: unknown) { return target; }, start() {}, stop() {}, disconnect() {}, onended: null }; }
      resume() {
        state.resumed++;
        if (state.failResume) return Promise.reject(new Error('Audio resume was denied'));
        this.state = 'running';
        return Promise.resolve();
      }
      suspend() { state.suspended++; this.state = 'suspended'; return Promise.resolve(); }
      close() { this.state = 'closed'; return Promise.resolve(); }
    }
    Object.assign(window, { AudioContext: StubAudioContext });
  });
  await page.goto('/');
  expect(await page.evaluate(() => (window as unknown as { audioTestState: { created: number } }).audioTestState.created)).toBe(0);
  await page.getByRole('button', { name: 'Turn subtle sound on' }).click();
  await expect(page.getByRole('button', { name: 'Turn sound off' })).toHaveAttribute('aria-pressed', 'true');

  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, value: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.locator('html')).toHaveAttribute('data-visible', 'no');
  expect(await page.evaluate(() => (window as unknown as { audioTestState: { suspended: number } }).audioTestState.suspended)).toBeGreaterThan(0);
  await page.evaluate(() => {
    (window as unknown as { audioTestState: { failResume: boolean } }).audioTestState.failResume = true;
    Object.defineProperty(document, 'hidden', { configurable: true, value: false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await expect(page.getByRole('button', { name: 'Turn subtle sound on' })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('status').filter({ hasText: 'Sound is unavailable in this browser.' })).toHaveText('Sound is unavailable in this browser.');
  expect(errors).toEqual([]);
});
