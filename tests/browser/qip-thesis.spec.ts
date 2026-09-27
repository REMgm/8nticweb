import { test, expect } from '@playwright/test';

const thesis = '/publications/qip-thesis';

test('complete thesis retains its chapters, subsections and source apparatus', async ({ page }) => {
  await page.goto(thesis);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Quantum Intelligence Protocol');
  await expect(page.locator('.qip-chapter[id^="qip-chapter-"]')).toHaveCount(11);
  await expect(page.locator('.qip-body h3').filter({ hasText: /^\d+\.\d+\s/ })).toHaveCount(48);
  await expect(page.locator('#qip-references > ol > li')).toHaveCount(29);
  await expect(page.locator('.qip-citation-index li')).toHaveCount(25);
  await expect(page.locator('.qip-convergence tbody tr')).toHaveCount(7);
  await expect(page.getByRole('link', { name: /^Original on Substack/ })).toHaveAttribute('href', 'https://rem8ntic.substack.com/p/quantum-intelligence-protocol');
});

test('memory example carries a reviewed lesson into a value, then returns to the experience', async ({ page }) => {
  await page.goto(thesis);
  const explorer = page.locator('.qip-memory-explorer');
  const experience = explorer.getByRole('button', { name: 'Experience Tier 1 · Short-term' });
  await expect(experience).toHaveAttribute('aria-pressed', 'true');
  await expect(explorer.locator('.qip-x-specimen')).toContainText('Put the source beside each claim.');

  await explorer.getByRole('button', { name: 'Follow the next tier' }).click();
  await expect(explorer.getByRole('button', { name: 'Pattern Tier 2 · Mid-term' })).toHaveAttribute('aria-pressed', 'true');
  await expect(explorer.locator('.qip-x-specimen')).toContainText('A reviewed lesson for future launch briefs');

  const identity = explorer.getByRole('button', { name: 'Identity Tier 3 · Long-term' });
  await identity.focus();
  await page.keyboard.press('Enter');
  await expect(identity).toHaveAttribute('aria-pressed', 'true');
  await expect(explorer.getByRole('status')).toContainText('Tier 3 of 3: Identity Core');
  await expect(explorer.locator('.qip-x-specimen')).toContainText('make reasoning traceable');

  await explorer.getByRole('button', { name: 'Return to the experience' }).click();
  await expect(experience).toHaveAttribute('aria-pressed', 'true');
  await expect(explorer.locator('[aria-pressed="true"]')).toHaveCount(1);
});

test('collaboration preserves distinct observations before conclusions and resets predictably', async ({ page }) => {
  await page.goto(thesis);
  const explorer = page.locator('.qip-collaboration-explorer');
  await expect(explorer.getByRole('button', { name: 'Superposition', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(explorer.locator('.qip-x-perspective .qip-x-label')).toHaveText(['Independent question', 'Independent question', 'Independent question']);

  await explorer.getByRole('button', { name: 'Next phase', exact: true }).click();
  await expect(explorer.getByRole('button', { name: 'Reflection', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(explorer.locator('.qip-x-perspective .qip-x-label')).toHaveText(['Shared observation', 'Shared observation', 'Shared observation']);
  await expect(explorer.locator('.qip-x-perspective').first()).toContainText('where each claim came from');

  await explorer.getByRole('button', { name: 'Next phase', exact: true }).click();
  await expect(explorer.getByRole('button', { name: 'Collapse', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(explorer.locator('.qip-x-perspective .qip-x-label')).toHaveText(['Independent conclusion', 'Independent conclusion', 'Independent conclusion']);

  await explorer.getByRole('button', { name: 'Next phase', exact: true }).click();
  await expect(explorer.getByRole('status')).toContainText('Phase 4 of 4: Synthesis');
  await expect(explorer.locator('.qip-x-phase-intro')).toContainText('No external publication is included.');
  await expect(explorer.getByRole('button', { name: 'All phases explored' })).toBeDisabled();

  await explorer.getByRole('button', { name: 'Reset collaboration to the first phase' }).click();
  await expect(explorer.getByRole('button', { name: 'Superposition', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(explorer.getByRole('button', { name: 'Reset collaboration to the first phase' })).toBeDisabled();
  await expect(explorer.locator('[aria-pressed="true"]')).toHaveCount(1);
});

test('full text, chapter navigation and citations remain accessible without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, reducedMotion: 'reduce', viewport: { width: 393, height: 852 } });
  try {
    const page = await context.newPage();
    await page.goto(`${baseURL}${thesis}`);
    await expect(page.locator('.qip-chapter[id^="qip-chapter-"]')).toHaveCount(11);
    await page.locator('.qip-mobile-contents summary').click();
    await page.getByRole('navigation', { name: 'Thesis chapters on mobile' }).getByRole('link', { name: /^06 / }).click();
    await expect(page).toHaveURL(/#qip-chapter-6$/);
    await expect(page.locator('#qip-chapter-6 > header > h2')).toBeInViewport();
    await expect(page.locator('.qip-memory-explorer')).toContainText('A launch brief comes back from review');
    await expect(page.locator('.qip-collaboration-explorer')).toContainText('Three perspectives examine');
    await page.locator('.qip-citation-index summary').click();
    await expect(page.locator('.qip-citation-index ul')).toBeVisible();
    await expect(page.locator('.qip-citation-index li')).toHaveCount(25);
  } finally {
    await context.close();
  }
});

test('phone layouts contain the table and explorers, with readable motion-free states', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(thesis);
  for (const width of [320, 393, 440]) {
    await page.setViewportSize({ width, height: 852 });
    await page.locator('.qip-collaboration-explorer').getByRole('button', { name: 'Synthesis', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Page overflow at ${width}px`).toBe(true);
    const dimensions = await page.locator('.qip-explorer button').evaluateAll(buttons => buttons.map(button => button.getBoundingClientRect().height));
    expect(Math.min(...dimensions), `Touch target at ${width}px`).toBeGreaterThanOrEqual(44);
    const panels = await page.locator('.qip-x-enter').evaluateAll(elements => elements.map(element => ({ opacity: getComputedStyle(element).opacity, animation: getComputedStyle(element).animationName })));
    expect(panels.every(panel => panel.animation === 'none' && panel.opacity === '1')).toBe(true);
  }
});
