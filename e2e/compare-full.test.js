/**
 * Side-by-side comparison: prod (www.tuvero.de) vs localhost.
 * Covers all 3 variants × all tournament systems, result corrections,
 * ranking-order changes, and the Maastricht successive-KO scenario.
 *
 * Run with: npx playwright test e2e/compare-full.test.js --headed --workers=1
 */
import { test, expect } from '@playwright/test'

// Force serial execution — two contexts per test already hits 2 browsers.
test.describe.configure({ mode: 'serial', timeout: 10000 })

// ─── URLs ────────────────────────────────────────────────────────────────────
const PROD = v => `https://www.tuvero.de/${v}/index.html`
const LOCAL = v => `http://localhost:5173/${v}/`

// ─── Systems per variant (from presets.js) ────────────────────────────────────
const SYSTEMS = {
  basic: ['swiss', 'round', 'ko', 'placement'],
  boule: ['swiss', 'round', 'ko', 'placement', 'poules'],
  tac: ['swiss', 'round', 'ko', 'placement']
}

const TEAMS = {
  swiss: ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4'],
  round: ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4'],
  ko: ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4'],
  placement: ['A1', 'A2', 'A3', 'A4'],
  poules: ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4']
}

const MAASTRICHT_TEAMS = Array.from({ length: 29 }, (_, i) => `M${String(i + 1).padStart(2, '0')}`)

// ─── Low-level helpers ────────────────────────────────────────────────────────
async function waitForApp(page) {
  await page.waitForFunction(() => {
    const s = document.getElementById('splash')
    return s && !s.classList.contains('loading')
  }, { timeout: 10000 })
}

async function setTab(page, tab) {
  const btn = page.locator(`.tabmenu a[href="#${tab}"]`)
  if (await btn.isVisible().catch(() => false)) {
    await btn.click()
  }
  await page.locator(`[data-tab="${tab}"]`).waitFor({ state: 'visible', timeout: 1000 }).catch(() => { })
}

async function newTournament(page, url, name) {
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  await waitForApp(page)
  await page.locator('.treename').fill(name)
  await page.locator('.createroot.withlabel.big').click()
}

async function registerTeams(page, teams) {
  await setTab(page, 'teams')
  // If teamsizeview is present (boule), switch to single-player mode so registration is consistent
  const singleBtn = page.locator('[data-tab="teams"] .teamsizeview [data-img="teams1"]')
  if (await singleBtn.count() > 0) await singleBtn.click()
  for (let i = 0; i < teams.length; i++) {
    await page.locator('[data-tab="teams"] .newteamview input.playername').first().fill(teams[i])
    await page.locator('[data-tab="teams"] .newteamview button.register').click()
    await expect(page.locator('[data-tab="teams"] tr.team:not(.template)')).toHaveCount(i + 1, { timeout: 1000 })
  }
}

async function createSystem(page, system) {
  await page.locator(`button[data-system="${system}"]`).first().click()
  await page.locator('.system:not(.template):not(.newsystem) .initial button.runtournament').first().waitFor({ timeout: 1000 })
}

// Clicks "run tournament" from the initial state to start the first round.
async function runSystem(page) {
  await page.locator('.system:not(.template):not(.newsystem) .initial button.runtournament').first().click()
  await page.locator('.system:not(.template):not(.newsystem).running').first().waitFor({ timeout: 1000 })
}

// Click the tournament name span to open the inline rename input, type name, confirm.
async function renameTournament(page, name) {
  await page.locator('.system:not(.template):not(.newsystem) .tournamentname.rename').first().click()
  const input = page.locator('.system:not(.template):not(.newsystem) input.rename').first()
  await input.waitFor({ timeout: 1000 })
  await input.fill(name)
  await input.press('Enter')
}

async function startNextRound(page) {
  const btn = page.locator('.system:not(.template):not(.newsystem) .idle button.runtournament').first()
  await btn.waitFor({ state: 'visible', timeout: 5000 })
  await btn.click()
  await page.locator('.system:not(.template):not(.newsystem).running').first().waitFor({ timeout: 1000 })
}

// Fill all pending match forms in the given tab.
// correctionIndex ≥ 0: re-types the first score of that match (simulating a correction before accept).
async function fillMatches(page, tab, correctionIndex = -1) {
  await setTab(page, tab)
  const forms = page.locator(`[data-tab="${tab}"] .finish`)
  let idx = 0
  while (true) {
    const count = await forms.count()
    if (count === 0) break
    const form = forms.first()
    if (idx === correctionIndex) {
      // Enter wrong score, then correct it
      await form.locator('input.score').nth(0).fill('9')
      await form.locator('input.score').nth(0).fill('1')
    } else {
      await form.locator('input.score').nth(0).fill('1')
    }
    await form.locator('input.score').nth(1).fill('0')
    const accept = form.locator('button.accept')
    await expect(accept).toBeEnabled({ timeout: 1000 }).catch(() => { })
    await accept.click().catch(() => { })
    await page.waitForTimeout(150)
    idx++
  }
}

// Click the first available ranking component button (changes Swiss/Round ordering).
async function changeRankingOrder(page) {
  // Initial state: ranking order view is directly visible inside .initial
  const initAvail = page.locator(
    '.system:not(.template):not(.newsystem) .initial .rankingorderview .available button:not(.hidden)'
  ).first()
  if (await initAvail.count() > 0) {
    await initAvail.click()
    return true
  }
  // Idle state: ranking order is inside a collapsed options box — expand first
  const collapsed = page.locator(
    '.system:not(.template):not(.newsystem) .idle .boxview.collapsed h3'
  ).first()
  if (await collapsed.count() > 0 && await collapsed.isVisible().catch(() => false)) {
    await collapsed.click()
    const idleAvail = page.locator(
      '.system:not(.template):not(.newsystem) .idle .rankingorderview .available button:not(.hidden)'
    ).first()
    if (await idleAvail.count() > 0) {
      await idleAvail.click()
      return true
    }
  }
  return false
}

// ─── DOM health check ─────────────────────────────────────────────────────────
async function domHealth(page) {
  return page.evaluate(() => {
    const issues = []

    // 1. Icons: every visible non-template [data-img] should have a ::before background-image
    document.querySelectorAll('[data-img]').forEach(el => {
      if (el.closest('.template')) return
      const img = el.getAttribute('data-img')
      if (!img) return
      const style = window.getComputedStyle(el, '::before')
      const bg = style.backgroundImage
      if (!bg || bg === 'none') {
        const tag = el.tagName.toLowerCase()
        const cls = [...el.classList].filter(c => c !== 'template').slice(0, 3).join('.')
        issues.push(`no-icon:[data-img="${img}"]@${tag}.${cls}`)
      }
    })

    // 2. Table column consistency — flag rows with fewer TDs than the table max
    document.querySelectorAll('table').forEach((table, ti) => {
      if (table.closest('.template')) return
      const rows = [...table.querySelectorAll('tbody > tr')]
      if (rows.length < 2) return
      const counts = rows.map(r => r.querySelectorAll('td').length).filter(c => c > 0)
      if (!counts.length) return
      const max = Math.max(...counts)
      const bad = counts.filter(c => c > 0 && c < max - 1).length
      if (bad > 0) {
        const tab = table.closest('[data-tab]')?.getAttribute('data-tab') ?? '?'
        issues.push(`table-cols:tab=${tab}t${ti}:max=${max},${bad}bad`)
      }
    })

    // 3. Expected tabs must exist in the DOM
    for (const t of ['home', 'teams', 'history', 'ranking', 'games', 'settings']) {
      if (!document.querySelector(`[data-tab="${t}"]`)) issues.push(`missing-tab:${t}`)
    }

    // 4. Visible match forms must have score inputs
    document.querySelectorAll('[data-tab="games"] .finish, [data-tab="history"] .finish').forEach(form => {
      if (!form.checkVisibility?.() && !form.offsetParent) return
      if (form.querySelectorAll('input.score').length === 0) issues.push('match-form-no-inputs')
    })

    return issues
  })
}

// ─── Comparison reporter ─────────────────────────────────────────────────────
async function compare(prod, local, label) {
  const [pi, li] = await Promise.all([domHealth(prod), domHealth(local)])
  const pOnly = pi.filter(x => !li.includes(x))
  const lOnly = li.filter(x => !pi.includes(x))
  const shared = pi.filter(x => li.includes(x))

  if (!pOnly.length && !lOnly.length) {
    const note = shared.length ? ` (${shared.length} shared)` : ''
    console.log(`  ✓ ${label}${note}`)
  } else {
    console.log(`  ✗ ${label}`)
    pOnly.forEach(x => console.log(`      PROD only : ${x}`))
    lOnly.forEach(x => console.log(`      LOCAL only: ${x}`))
  }
  return { pOnly, lOnly }
}

// Run fn on both pages; log errors but don't abort the other side.
async function both(prod, local, fn) {
  return Promise.all([
    fn(prod, 'prod').catch(e => console.error(`    PROD: ${e.message.split('\n')[0]}`)),
    fn(local, 'local').catch(e => console.error(`    LOCAL: ${e.message.split('\n')[0]}`))
  ])
}

// ─── Per-variant, per-system tests ────────────────────────────────────────────
test.describe('all variants — all systems', () => {
  for (const variant of ['basic', 'boule', 'tac']) {
    test.describe(variant, () => {
      for (const system of SYSTEMS[variant]) {
        test(system, async ({ browser }) => {
          const pc = await browser.newContext({ viewport: { width: 1280, height: 900 } })
          const lc = await browser.newContext({ viewport: { width: 1280, height: 900 } })
          const prod = await pc.newPage()
          const local = await lc.newPage()
          const label = `${variant}/${system}`
          const teams = TEAMS[system] ?? TEAMS.swiss
          const rounds = { swiss: 3, round: 3, ko: 1, placement: 1, poules: 1 }[system] ?? 1

          console.log(`\n══ ${label} ══`)
          try {
            await both(prod, local, (p, s) => newTournament(p, s === 'prod' ? PROD(variant) : LOCAL(variant), label))
            await both(prod, local, p => registerTeams(p, teams))
            await compare(prod, local, 'after-register')

            await setTab(prod, 'teams')
            await setTab(local, 'teams')
            await both(prod, local, p => createSystem(p, system))

            // Change ranking order while still in initial state (before round 1 runs)
            if (system === 'swiss') {
              await both(prod, local, p => changeRankingOrder(p))
              await compare(prod, local, 'after-ranking-order-change')
            }

            // Test tournament rename
            await both(prod, local, p => renameTournament(p, `${label}-renamed`))
            await compare(prod, local, 'after-rename')

            await both(prod, local, p => runSystem(p))
            await compare(prod, local, 'after-start')

            for (let r = 0; r < rounds; r++) {
              await both(prod, local, p => fillMatches(p, 'games', r === 0 ? 0 : -1))
              await compare(prod, local, `round-${r + 1}`)
              if (r < rounds - 1) {
                await setTab(prod, 'teams')
                await setTab(local, 'teams')
                await both(prod, local, p => startNextRound(p))
              }
            }

            // Sweep all tabs
            for (const tab of ['home', 'teams', 'history', 'ranking', 'games', 'settings']) {
              await both(prod, local, p => setTab(p, tab))
              await compare(prod, local, `tab:${tab}`)
            }
          } finally {
            await pc.close()
            await lc.close()
          }
        })
      }
    })
  }
})

// ─── Maastricht scenario ─────────────────────────────────────────────────────
test('Maastricht: boule 29 teams → Swiss 5 rounds + 4×KO', async ({ browser }) => {
  test.setTimeout(300000) // 29 teams × 5 Swiss rounds + 4 KO phases needs ~2 min
  const variant = 'boule'
  const pc = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const lc = await browser.newContext({ viewport: { width: 1280, height: 900 } })
  const prod = await pc.newPage()
  const local = await lc.newPage()

  console.log('\n══ Maastricht ══')
  try {
    // Setup
    await both(prod, local, (p, s) => newTournament(p, s === 'prod' ? PROD(variant) : LOCAL(variant), 'Maastricht'))
    await both(prod, local, p => registerTeams(p, MAASTRICHT_TEAMS))
    await compare(prod, local, 'after-register-29')

    // Swiss phase — 5 rounds (change ranking order in initial state before round 1)
    await setTab(prod, 'teams')
    await setTab(local, 'teams')
    await both(prod, local, p => createSystem(p, 'swiss'))
    await both(prod, local, p => changeRankingOrder(p))
    await both(prod, local, p => runSystem(p))
    await compare(prod, local, 'swiss-started')

    let swissRound = 0
    const totalSwissRounds = 5

    while (swissRound < totalSwissRounds) {
      const correction = swissRound === 1 ? 0 : -1 // correct round-2 first match
      await both(prod, local, p => fillMatches(p, 'games', correction))
      swissRound++
      await compare(prod, local, `swiss-r${swissRound}`)

      if (swissRound === 3) {
        // Change ranking order while still idle (after round 3, before round 4 starts)
        await both(prod, local, p => changeRankingOrder(p))
        await compare(prod, local, 'swiss-ranking-changed')
        // Start round 4
        await setTab(prod, 'teams')
        await setTab(local, 'teams')
        await both(prod, local, p => startNextRound(p))
        await both(prod, local, p => fillMatches(p, 'games'))
        swissRound++
        await compare(prod, local, `swiss-r${swissRound}`)
      }

      if (swissRound < totalSwissRounds) {
        await setTab(prod, 'teams')
        await setTab(local, 'teams')
        await both(prod, local, p => startNextRound(p))
      }
    }

    await both(prod, local, p => setTab(p, 'ranking'))
    await compare(prod, local, 'swiss-final-ranking')

    // Successive KO phase — A, B, C, D
    for (const group of ['A', 'B', 'C', 'D']) {
      console.log(`\n  ── KO ${group} ──`)
      await setTab(prod, 'teams')
      await setTab(local, 'teams')
      await both(prod, local, p => createSystem(p, 'ko'))
      await both(prod, local, p => runSystem(p))
      await compare(prod, local, `ko-${group}-started`)

      for (let r = 0; r < 8; r++) {
        await setTab(prod, 'games')
        await setTab(local, 'games')
        const [pc2, lc2] = await Promise.all([
          prod.locator('[data-tab="games"] .finish').count(),
          local.locator('[data-tab="games"] .finish').count()
        ])
        if (pc2 === 0 && lc2 === 0) break
        await both(prod, local, p => fillMatches(p, 'games'))
        await compare(prod, local, `ko-${group}-r${r + 1}`)
      }

      await both(prod, local, p => setTab(p, 'history'))
      await compare(prod, local, `ko-${group}-history`)
    }

    // Final tab sweep
    console.log('\n  ── Final sweep ──')
    for (const tab of ['home', 'teams', 'history', 'ranking', 'games', 'settings']) {
      await both(prod, local, p => setTab(p, tab))
      await compare(prod, local, `final:${tab}`)
    }
  } finally {
    await pc.close()
    await lc.close()
  }
})
