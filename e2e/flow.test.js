import { test, expect } from '@playwright/test';

// Helpers
async function collectErrors(page) {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  return errors;
}

async function waitForApp(page) {
  // App removes the 'loading' class from #splash when ready
  await page.waitForFunction(() => {
    const splash = document.getElementById('splash');
    return splash && !splash.classList.contains('loading');
  }, { timeout: 10000 });
}

async function goTab(page, tabName) {
  await page.goto(`/basic/#${tabName}`);
  await page.waitForTimeout(100);
}

test.describe('basic: full tournament flow (Swiss)', () => {
  let errors;

  test.beforeEach(async ({ page }) => {
    errors = await collectErrors(page);
    await page.goto('/basic/');
    await waitForApp(page);
  });

  test('create tournament', async ({ page }) => {
    await page.fill('.treename', 'Test Tournament');
    await page.click('.createroot.withlabel.big');
    // The new tournament should appear in the list
    await expect(page.locator('.timemachinecommitview')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('register teams via debug tab', async ({ page }) => {
    // Create a tournament first
    await page.fill('.treename', 'Flow Test');
    await page.click('.createroot.withlabel.big');

    await goTab(page, 'debug');
    await page.fill('input.numteams', '8');
    await page.click('button.registerteams');

    // Check teams tab shows 8 teams
    await goTab(page, 'teams');
    const rows = page.locator('tr.team:not(.template)');
    await expect(rows).toHaveCount(8);
    expect(errors).toEqual([]);
  });

  test('start and finish a Swiss round', async ({ page }) => {
    // Create tournament + register teams
    await page.fill('.treename', 'Swiss Test');
    await page.click('.createroot.withlabel.big');
    await goTab(page, 'debug');
    await page.fill('input.numteams', '8');
    await page.click('button.registerteams');

    // Start a Swiss round via debug shortcut
    await page.click('button.startround');

    // Running matches appear in the games tab, not history
    await goTab(page, 'games');
    await page.waitForTimeout(300);
    const matchRows = page.locator('[data-tab="games"] tr.match:not(.template)');
    await expect(matchRows.first()).toBeVisible();

    // Finish round randomly
    await goTab(page, 'debug');
    await page.click('button.finishroundrandom');

    // Rankings should have entries
    await goTab(page, 'ranking');
    const rankRows = page.locator('tr.rankingrow:not(.template)');
    await expect(rankRows.first()).toBeVisible();

    expect(errors).toEqual([]);
  });

  test('score entry: fill scores and accept a match', async ({ page }) => {
    await page.fill('.treename', 'Score Entry');
    await page.click('.createroot.withlabel.big');
    await goTab(page, 'debug');
    await page.fill('input.numteams', '4');
    await page.click('button.registerteams');
    await page.click('button.startround');

    await goTab(page, 'games');
    await page.waitForTimeout(300);

    const matches = page.locator('[data-tab="games"] tr.match:not(.template)');
    const initialCount = await matches.count();
    expect(initialCount).toBeGreaterThan(0);

    // Fill in scores on the first match's finish form
    const firstMatch = matches.first();
    const scoreInputs = firstMatch.locator('.finish input.score');
    await scoreInputs.nth(0).fill('13');
    await scoreInputs.nth(1).fill('7');

    // Accept the result — accept button is enabled since defaults are valid
    await firstMatch.locator('.finish button.accept').click();

    // Match should disappear from the games tab
    await expect(matches).toHaveCount(initialCount - 1);

    // Verify it shows up in history with the correct score
    await goTab(page, 'history');
    await expect(page.locator('[data-tab="history"] .result .score').first()).toBeVisible();

    expect(errors).toEqual([]);
  });

  test('two rounds: start, finish, start, finish', async ({ page }) => {
    await page.fill('.treename', 'Two Rounds');
    await page.click('.createroot.withlabel.big');
    await goTab(page, 'debug');
    await page.fill('input.numteams', '8');
    await page.click('button.registerteams');

    for (let i = 0; i < 2; i++) {
      await page.click('button.startround');
      await page.waitForTimeout(200);
      await page.click('button.finishroundrandom');
      await page.waitForTimeout(200);
    }

    await goTab(page, 'ranking');
    const rankRows = page.locator('tr.rankingrow:not(.template)');
    await expect(rankRows).toHaveCount(8);

    expect(errors).toEqual([]);
  });
});
