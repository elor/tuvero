import { test, expect } from './coverage.fixture.js'
import { collectErrors, goTab, createTournament, registerTeams, finishAllMatches } from './helpers.js'

const TEAMS = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank',
  'Grace', 'Heidi', 'Ivan', 'Judy', 'Mallory', 'Niaj']

test('a template draws, starts and ends every phase', async ({ page }) => {
  const errors = collectErrors(page)
  await createTournament(page, 'Vorlage')
  await goTab(page, 'teams')
  await registerTeams(page, TEAMS)

  await page.locator('.templateplan button[data-template="groupsfinal"]').click()
  // one qualifying round keeps the test short
  await page.locator('.templateplan input.planrounds').fill('1')
  await page.locator('.templateplan input.planrounds').dispatchEvent('change')
  // one group round, three KO rounds, one placement round -- and a
  // team plays either the final or the placement round
  await expect(page.locator('.templateplan .planschedule'))
    .toHaveText('insgesamt 5 Runden · höchstens 4 Begegnungen pro Team')

  const step = page.locator('.templateplan button.planstep')
  const round = page.locator('.templateplan button.planround')
  await expect(step).toHaveText('Vorrunden starten')
  await step.click()

  // both group phases are drawn and running
  await expect(page.locator('.system:not(.template):not(.newsystem)')).toHaveCount(2)
  await expect(page.locator('.system:not(.template):not(.newsystem).running')).toHaveCount(2)
  await expect(page.locator('.system:not(.template):not(.newsystem) .tournamentname').first())
    .toHaveText('Vorrunde A')
  await expect(step).toBeDisabled()

  await finishAllMatches(page)
  await goTab(page, 'teams')
  // the single round is played, so there is nothing left to start here
  await expect(round).toBeHidden()
  await expect(step).toHaveText('Finale starten')
  await expect(step).toBeEnabled()
  await step.click()

  // the groups were ended on the way and the final is under way
  await expect(page.locator('.system:not(.template):not(.newsystem)')).toHaveCount(1)
  await expect(page.locator('.system:not(.template):not(.newsystem) .tournamentname').first())
    .toHaveText('Finale')
  await expect(page.locator('.system:not(.template):not(.newsystem).running')).toHaveCount(1)

  await finishAllMatches(page)
  await goTab(page, 'teams')
  await expect(step).toHaveText('Platzierungsrunde starten')
  await step.click()
  // the swiss box repeats its name below the options
  await expect(page.locator('.system:not(.template):not(.newsystem) .tournamentname').first())
    .toHaveText('Platzierungsrunde')
  await expect(page.locator('.templateplan .stephint'))
    .toHaveText(/Alle Phasen sind ausgelost/)

  expect(errors).toEqual([])
})
