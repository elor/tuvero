import { test, expect } from '@playwright/test';
import { collectErrors, goTab, createTournament, registerTeams, startTournament, startNextRound, finishAllMatches } from './helpers.js';

const TEAMS = ['Alice', 'Bob', 'Carol', 'Dave'];

test.describe('basic: full tournament flow (Swiss)', () => {
  let errors;

  test.beforeEach(async ({ page }) => {
    errors = collectErrors(page);
  });

  test('create tournament', async ({ page }) => {
    await createTournament(page, 'Test Tournament');
    await expect(page.locator('.timemachinecommitview')).toBeVisible();
    expect(errors).toEqual([]);
  });

  test('register 4 teams via teams tab', async ({ page }) => {
    await createTournament(page, 'Team Reg Test');
    await goTab(page, 'teams');
    await registerTeams(page, TEAMS);
    await expect(page.locator('tr.team:not(.template)')).toHaveCount(4);
    expect(errors).toEqual([]);
  });

  test('start and finish a Swiss round', async ({ page }) => {
    await createTournament(page, 'Swiss Round');
    await goTab(page, 'teams');
    await registerTeams(page, TEAMS);
    await startTournament(page, 'swiss');

    // Running matches appear in games tab
    await goTab(page, 'games');
    await page.waitForTimeout(300);
    await expect(page.locator('[data-tab="games"] tr.match:not(.template)').first()).toBeVisible();

    await finishAllMatches(page);

    await goTab(page, 'ranking');
    await expect(page.locator('tr.rankingrow:not(.template)')).toHaveCount(4);
    expect(errors).toEqual([]);
  });

  test('score entry: fill 13:7 and accept', async ({ page }) => {
    await createTournament(page, 'Score Entry');
    await goTab(page, 'teams');
    await registerTeams(page, TEAMS);
    await startTournament(page, 'swiss');

    await goTab(page, 'games');
    await page.waitForTimeout(300);

    const matches = page.locator('[data-tab="games"] tr.match:not(.template)');
    const initialCount = await matches.count();
    expect(initialCount).toBeGreaterThan(0);

    const firstMatch = matches.first();
    await firstMatch.locator('.finish input.score').nth(0).fill('13');
    await firstMatch.locator('.finish input.score').nth(1).fill('7');
    await firstMatch.locator('.finish button.accept').click();

    await expect(matches).toHaveCount(initialCount - 1);
    expect(errors).toEqual([]);
  });

  test('two Swiss rounds', async ({ page }) => {
    await createTournament(page, 'Two Rounds');
    await goTab(page, 'teams');
    await registerTeams(page, TEAMS);

    // Round 1
    await startTournament(page, 'swiss');
    await finishAllMatches(page);

    // Round 2
    await goTab(page, 'teams');
    await startNextRound(page);
    await finishAllMatches(page);

    await goTab(page, 'ranking');
    await expect(page.locator('tr.rankingrow:not(.template)')).toHaveCount(4);
    expect(errors).toEqual([]);
  });
});
