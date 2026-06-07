import { test as base, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const COLLECT = process.env.COVERAGE === '1'

export const test = base.extend({
  page: async ({ page }, use) => {
    if (COLLECT) {
      await page.coverage.startJSCoverage({ resetOnNavigation: false })
    }
    await use(page)
    if (COLLECT) {
      const coverage = await page.coverage.stopJSCoverage()
      const dir = 'coverage/playwright'
      fs.mkdirSync(dir, { recursive: true })
      const file = path.join(dir, `${Date.now()}_${Math.random().toString(36).slice(2)}.json`)
      fs.writeFileSync(file, JSON.stringify(coverage))
    }
  }
})

export { expect }
