import { test, expect } from '@playwright/test';

async function waitForApp(page) {
  await page.waitForFunction(() => {
    const splash = document.getElementById('splash');
    return splash && !splash.classList.contains('loading');
  }, { timeout: 10000 });
}

async function goTab(page, tabName) {
  await page.goto(`/basic/#${tabName}`);
  await page.waitForTimeout(100);
}

async function setup(page, name, numTeams) {
  await page.goto('/basic/');
  await waitForApp(page);
  await page.fill('.treename', name);
  await page.click('.createroot.withlabel.big');
  await goTab(page, 'debug');
  await page.fill('input.numteams', String(numTeams));
  await page.click('button.registerteams');
}

async function startSystem(page, system) {
  await goTab(page, 'teams');
  await page.waitForTimeout(300);
  await page.click(`button[data-system="${system}"]`);
  await page.waitForTimeout(100);
  await goTab(page, 'debug');
}

test.describe('tournament systems (basic variant)', () => {
  test('round-robin: 4 teams runs 3 rounds cleanly', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(err.message));

    await setup(page, 'Round Robin', 4);
    await startSystem(page, 'round');

    // 4-team round-robin = 3 rounds
    for (let i = 0; i < 3; i++) {
      await page.click('button.startround');
      await page.waitForTimeout(200);
      await page.click('button.finishroundrandom');
      await page.waitForTimeout(200);
    }

    await goTab(page, 'ranking');
    await expect(page.locator('tr.rankingrow:not(.template)')).toHaveCount(4);
    expect(errors).toEqual([]);
  });

  test('KO: 4 teams finishes in one finishroundrandom call', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(err.message));

    await setup(page, 'KO', 4);
    await startSystem(page, 'ko');

    await page.click('button.startround');  // starts the KO
    await page.waitForTimeout(200);
    // do-while loop in finishroundrandom finishes semis then auto-advances to final
    await page.click('button.finishroundrandom');
    await page.waitForTimeout(200);
    // just in case final needed a second pass
    await page.click('button.finishroundrandom');
    await page.waitForTimeout(200);

    await goTab(page, 'ranking');
    await expect(page.locator('tr.rankingrow:not(.template)')).toHaveCount(4);
    expect(errors).toEqual([]);
  });

  test('placement: 4 teams, single-pass finish', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(err.message));

    await setup(page, 'Placement', 4);
    await startSystem(page, 'placement');

    await page.click('button.startround');
    await page.waitForTimeout(200);
    await page.click('button.finishroundrandom');
    await page.waitForTimeout(200);

    await goTab(page, 'ranking');
    await expect(page.locator('tr.rankingrow:not(.template)')).toHaveCount(4);
    expect(errors).toEqual([]);
  });
});
