import { test, expect } from '@playwright/test';

const variants = ['basic', 'boule', 'tac'];

for (const variant of variants) {
  test(`${variant}: loads without console errors`, async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push(err.message));

    await page.goto(`/${variant}/`);
    await page.waitForLoadState('networkidle');

    expect(errors).toEqual([]);
  });
}
