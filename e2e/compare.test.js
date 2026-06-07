/**
 * DOM + behavior comparison of production (www.tuvero.de/boule/index.html) vs localhost boule.
 * Run with: npx playwright test e2e/compare.test.js --headed
 *
 * Known expected differences: donation text removed, version number bumped.
 */
import { test } from '@playwright/test'

const PROD = 'https://www.tuvero.de/boule/index.html'
const LOCAL = 'http://localhost:5173/boule/'
const TABS = ['home', 'teams', 'ranking', 'settings']

async function waitForBoule (page) {
  await page.waitForFunction(() => {
    const splash = document.getElementById('splash')
    return splash && !splash.classList.contains('loading')
  }, { timeout: 15000 })
}

async function goTab (page, tab) {
  await page.evaluate((t) => { window.location.hash = t }, tab)
  await page.waitForTimeout(200)
}

async function getTabStructure (page, tab) {
  return page.evaluate((t) => {
    const el = document.querySelector(`[data-tab="${t}"]`)
    if (!el) return null
    // Collect tag names + data attributes + relevant text (no dynamic values)
    const nodes = []
    const walk = (node, depth) => {
      if (depth > 10) return
      for (const child of node.children) {
        const info = {
          tag: child.tagName.toLowerCase(),
          classes: [...child.classList].sort().join(' '),
          dataImg: child.dataset.img || '',
          dataTab: child.dataset.tab || '',
          dataSystem: child.dataset.system || '',
          type: child.type || '',
          isTemplate: child.classList.contains('template')
        }
        nodes.push(info)
        walk(child, depth + 1)
      }
    }
    walk(el, 0)
    return nodes
  }, tab)
}

async function getComputedFonts (page) {
  return page.evaluate(() => {
    const el = document.body
    const s = window.getComputedStyle(el)
    return { fontFamily: s.fontFamily, fontSize: s.fontSize, lineHeight: s.lineHeight }
  })
}

async function getTabText (page, tab) {
  return page.evaluate((t) => {
    const el = document.querySelector(`[data-tab="${t}"]`)
    if (!el) return ''
    // Strip version numbers and dynamic content, normalize whitespace
    return el.innerText
      .replace(/\d+\.\d+\.\d+(-dev)?/g, 'VERSION')
      .replace(/\s+/g, ' ')
      .trim()
  }, tab)
}

async function getElementCount (page, selector) {
  return page.locator(selector).count()
}

test('compare prod vs local boule — DOM and fonts', async ({ browser }) => {
  const prodCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const localCtx = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const prod = await prodCtx.newPage()
  const local = await localCtx.newPage()

  await Promise.all([
    prod.goto(PROD, { waitUntil: 'domcontentloaded' }),
    local.goto(LOCAL, { waitUntil: 'domcontentloaded' })
  ])
  await Promise.all([waitForBoule(prod), waitForBoule(local)])

  // --- Font / computed style comparison ---
  console.log('\n══ Computed body styles ══')
  const [prodFonts, localFonts] = await Promise.all([getComputedFonts(prod), getComputedFonts(local)])
  for (const key of Object.keys(prodFonts)) {
    const same = prodFonts[key] === localFonts[key]
    console.log(`  ${key}: ${same ? '✓' : '✗'}`)
    if (!same) {
      console.log(`    prod:  ${prodFonts[key]}`)
      console.log(`    local: ${localFonts[key]}`)
    }
  }

  // --- Per-tab comparison ---
  for (const tab of TABS) {
    await Promise.all([goTab(prod, tab), goTab(local, tab)])
    console.log(`\n══ Tab: ${tab} ══`)

    // Text comparison (version-normalized)
    const [prodText, localText] = await Promise.all([getTabText(prod, tab), getTabText(local, tab)])
    if (prodText === localText) {
      console.log('  text: ✓ identical')
    } else {
      const prodLines = prodText.split(' ').filter(w => w.length > 4)
      const localLines = localText.split(' ').filter(w => w.length > 4)
      const removed = prodLines.filter(w => !localLines.includes(w))
      const added = localLines.filter(w => !prodLines.includes(w))
      if (removed.length) console.log('  text PROD only:', removed.slice(0, 10).join(' '))
      if (added.length) console.log('  text LOCAL only:', added.slice(0, 10).join(' '))
    }

    // DOM structure comparison
    const [prodStruct, localStruct] = await Promise.all([
      getTabStructure(prod, tab),
      getTabStructure(local, tab)
    ])
    if (JSON.stringify(prodStruct) === JSON.stringify(localStruct)) {
      console.log('  DOM:  ✓ identical structure')
    } else {
      const prodTags = (prodStruct || []).map(n => `${n.tag}.${n.classes}`)
      const localTags = (localStruct || []).map(n => `${n.tag}.${n.classes}`)
      const removed = prodTags.filter(t => !localTags.includes(t))
      const added = localTags.filter(t => !prodTags.includes(t))
      if (removed.length) console.log('  DOM PROD only:', removed.slice(0, 8).join(', '))
      if (added.length) console.log('  DOM LOCAL only:', added.slice(0, 8).join(', '))
      console.log(`  (prod ${prodTags.length} nodes, local ${localTags.length} nodes)`)
    }
  }

  // --- Tab set comparison ---
  console.log('\n══ Navigation tabs ══')
  const [prodTabs, localTabs] = await Promise.all([
    prod.evaluate(() => [...document.querySelectorAll('[data-tab]')].map(el => el.dataset.tab)),
    local.evaluate(() => [...document.querySelectorAll('[data-tab]')].map(el => el.dataset.tab))
  ])
  if (JSON.stringify(prodTabs) === JSON.stringify(localTabs)) {
    console.log(`  ✓ identical: ${prodTabs.join(', ')}`)
  } else {
    console.log('  prod:', prodTabs.join(', '))
    console.log('  local:', localTabs.join(', '))
  }

  await prodCtx.close()
  await localCtx.close()
})
