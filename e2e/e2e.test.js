import { test, expect } from '@playwright/test'
import { collectErrors, goTab, createTournament, registerTeams, startTournament, startNextRound, finishAllMatches, finishAllMatchesInHistory } from './helpers.js'

const TEAMS = ['Alice', 'Bob', 'Carol', 'Dave']

test.describe('app loads', () => {
  for (const variant of ['basic', 'boule', 'tac']) {
    test(variant, async ({ page }) => {
      const errors = collectErrors(page)
      await page.goto(`/${variant}/`)
      await page.waitForLoadState('networkidle')
      expect(errors).toEqual([])
    })
  }
})

// The history tab combines past results and running matches into a single view
// per tournament. A non-empty tournament un-hides itself, so its visibility is a
// proxy for "the combined history rendered without throwing".
async function expectHistoryPopulated (page) {
  await goTab(page, 'history')
  await expect(page.locator('[data-tab="history"] .tournament:not(.template)').first()).toBeVisible()
  await expect(page.locator('[data-tab="history"] .result .score:visible').first()).toBeVisible()
}

async function runSystem (page, system, rounds) {
  await createTournament(page, system)
  await goTab(page, 'teams')
  await registerTeams(page, TEAMS)
  await startTournament(page, system)
  await finishAllMatches(page)
  for (let i = 1; i < rounds; i++) {
    await goTab(page, 'teams')
    await startNextRound(page)
    await finishAllMatches(page)
  }
  await expectHistoryPopulated(page)
  await goTab(page, 'ranking')
  await expect(page.locator('tr.rankingrow:not(.template)')).toHaveCount(TEAMS.length)
}

// Same coverage as runSystem, but every result is entered through the history
// tab (KO bracket / progress table / match list) rather than the games tab.
async function runSystemViaHistory (page, system, rounds) {
  await createTournament(page, system)
  await goTab(page, 'teams')
  await registerTeams(page, TEAMS)
  await startTournament(page, system)
  await finishAllMatchesInHistory(page)
  for (let i = 1; i < rounds; i++) {
    await goTab(page, 'teams')
    await startNextRound(page)
    await finishAllMatchesInHistory(page)
  }
  await goTab(page, 'ranking')
  await expect(page.locator('tr.rankingrow:not(.template)')).toHaveCount(TEAMS.length)
}

test.describe('tournament systems', () => {
  // Swiss gets its own test because we also exercise score entry mid-round.
  test('Swiss: score entry then two rounds', async ({ page }) => {
    const errors = collectErrors(page)
    await createTournament(page, 'Swiss')
    await goTab(page, 'teams')
    await registerTeams(page, TEAMS)
    await startTournament(page, 'swiss')

    await goTab(page, 'games')
    const matches = page.locator('[data-tab="games"] tr.match:not(.template)')
    await expect(matches.first()).toBeVisible()
    const initialCount = await matches.count()
    await matches.first().locator('.finish input.score').nth(0).fill('13')
    await matches.first().locator('.finish input.score').nth(1).fill('7')
    const acceptBtn = matches.first().locator('.finish button.accept')
    await expect(acceptBtn).toBeEnabled()
    await acceptBtn.click()
    await expect(matches).toHaveCount(initialCount - 1)

    await finishAllMatches(page)
    await goTab(page, 'teams')
    await startNextRound(page)
    await finishAllMatches(page)
    await goTab(page, 'ranking')
    await expect(page.locator('tr.rankingrow:not(.template)')).toHaveCount(TEAMS.length)
    expect(errors).toEqual([])
  })

  for (const [system, rounds] of [['round', 3], ['ko', 1], ['placement', 1]]) {
    test(system, async ({ page }) => {
      const errors = collectErrors(page)
      await runSystem(page, system, rounds)
      expect(errors).toEqual([])
    })
  }
})

test.describe('result entry via history tab', () => {
  for (const [system, rounds] of [['swiss', 2], ['round', 3], ['ko', 1], ['placement', 1]]) {
    test(system, async ({ page }) => {
      const errors = collectErrors(page)
      await runSystemViaHistory(page, system, rounds)
      expect(errors).toEqual([])
    })
  }
})
