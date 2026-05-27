import { test, expect } from '@playwright/test'
import { collectErrors, goTab, createTournament, registerTeams, startTournament, startNextRound, finishAllMatches } from './helpers.js'

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
