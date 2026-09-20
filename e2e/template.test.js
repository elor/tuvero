import { test, expect } from './coverage.fixture.js'
import { collectErrors, goTab, createTournament, registerTeams, finishAllMatches } from './helpers.js'

const TEAMS = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace',
  'Heidi', 'Ivan', 'Judy']

// Play one round in every group phase and end them, which is what a
// template waits for before it draws the next step.
async function playAndCloseAll (page) {
  await goTab(page, 'teams')
  const runButtons = page.locator('.system:not(.template) button.runtournament:visible')
  const count = await runButtons.count()
  for (let i = 0; i < count; i++) {
    await runButtons.first().click()
    await expect(page.locator('.system:not(.template).running')).toHaveCount(i + 1)
  }
  await finishAllMatches(page)
  await goTab(page, 'teams')
  // closing one phase re-renders the whole table, so reload between
  // the clicks instead of racing the buttons as they are replaced
  const closeButtons = page.locator('.system:not(.template) button.closetournament:visible')
  for (let remaining = await closeButtons.count(); remaining > 0; remaining--) {
    await goTab(page, 'teams')
    await closeButtons.first().click()
    await expect(closeButtons).toHaveCount(remaining - 1)
  }
}

test('a template plays groups, final and placement round', async ({ page }) => {
  const errors = collectErrors(page)
  await createTournament(page, 'Vorlage')
  await goTab(page, 'teams')
  await registerTeams(page, TEAMS)

  await page.locator('.templateplan button[data-template="groupsfinal"]').click()
  const start = page.locator('.templateplan button.startstep')
  await expect(start).toBeEnabled()
  await start.click()

  await expect(page.locator('.system:not(.template)')).toHaveCount(2)
  await expect(page.locator('.system:not(.template) .tournamentname').first())
    .toHaveText('Vorrunde A')
  // the next step waits for the group phases
  await expect(start).toBeDisabled()

  await playAndCloseAll(page)
  await expect(start).toBeEnabled()
  await expect(start).toHaveText(/Finale/)
  await start.click()
  await expect(page.locator('.system:not(.template)')).toHaveCount(1)
  await expect(page.locator('.system:not(.template) .tournamentname').first())
    .toHaveText('Finale')

  await playAndCloseAll(page)
  await expect(start).toHaveText(/Platzierungsrunde/)
  await start.click()
  await expect(page.locator('.system:not(.template) .tournamentname').first())
    .toHaveText('Platzierungsrunde')
  await expect(page.locator('.templateplan .stephint'))
    .toHaveText(/Alle Phasen sind ausgelost/)

  expect(errors).toEqual([])
})
