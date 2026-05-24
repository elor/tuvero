import { test, expect } from '@playwright/test';
import { collectErrors, goTab, createTournament, registerTeams, startTournament, startNextRound, finishAllMatches } from './helpers.js';

const TEAMS = ['Alice', 'Bob', 'Carol', 'Dave'];

test.describe('tournament systems (basic variant)', () => {
  test('round-robin: 4 teams runs 3 rounds cleanly', async ({ page }) => {
    const errors = collectErrors(page);

    await createTournament(page, 'Round Robin');
    await goTab(page, 'teams');
    await registerTeams(page, TEAMS);
    await startTournament(page, 'round');

    // 4-team round-robin = 3 rounds
    await finishAllMatches(page);
    await goTab(page, 'teams');
    await startNextRound(page);
    await finishAllMatches(page);
    await goTab(page, 'teams');
    await startNextRound(page);
    await finishAllMatches(page);

    await goTab(page, 'ranking');
    await expect(page.locator('tr.rankingrow:not(.template)')).toHaveCount(4);
    expect(errors).toEqual([]);
  });

  test('KO: 4 teams finishes semis then final', async ({ page }) => {
    const errors = collectErrors(page);

    await createTournament(page, 'KO');
    await goTab(page, 'teams');
    await registerTeams(page, TEAMS);
    await startTournament(page, 'ko');

    // Semi-finals
    await finishAllMatches(page);
    // Final
    await goTab(page, 'teams');
    await startNextRound(page);
    await finishAllMatches(page);

    await goTab(page, 'ranking');
    await expect(page.locator('tr.rankingrow:not(.template)')).toHaveCount(4);
    expect(errors).toEqual([]);
  });

  test('placement: 4 teams, single-pass finish', async ({ page }) => {
    const errors = collectErrors(page);

    await createTournament(page, 'Placement');
    await goTab(page, 'teams');
    await registerTeams(page, TEAMS);
    await startTournament(page, 'placement');

    await finishAllMatches(page);

    await goTab(page, 'ranking');
    await expect(page.locator('tr.rankingrow:not(.template)')).toHaveCount(4);
    expect(errors).toEqual([]);
  });
});
