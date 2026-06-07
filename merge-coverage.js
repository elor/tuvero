import MCR from 'monocart-coverage-reports'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = (...p) => path.resolve(path.dirname(fileURLToPath(import.meta.url)), ...p)

const mcr = new MCR({
  name: 'Tuvero — Unit + E2E Coverage',
  outputDir: here('coverage/merged'),
  reports: ['v8', 'console-summary'],
  entryFilter: (entry) => {
    const url = entry.url || ''
    if (!url.startsWith('http://localhost:5173/')) return false
    if (url.includes('/node_modules/')) return false
    if (url.includes('/@vite/')) return false
    if (url.includes('/@fs/')) return false
    return true
  },
  sourcePath: (filePath, _source, entry) => {
    if (entry?.url?.startsWith('http://localhost:5173/')) {
      const pathname = new URL(entry.url).pathname.split('?')[0]
      return here(pathname.slice(1))
    }
    return filePath
  }
})

// Playwright V8 coverage — one JSON file per test
const playwrightDir = here('coverage/playwright')
if (fs.existsSync(playwrightDir)) {
  for (const file of fs.readdirSync(playwrightDir).filter(f => f.endsWith('.json'))) {
    const data = JSON.parse(fs.readFileSync(path.join(playwrightDir, file), 'utf-8'))
    await mcr.add(data)
  }
}

// Vitest Istanbul JSON (coverage/coverage-final.json)
const vitestJson = here('coverage/coverage-final.json')
if (fs.existsSync(vitestJson)) {
  const data = JSON.parse(fs.readFileSync(vitestJson, 'utf-8'))
  await mcr.add(data)
}

await mcr.generate()
console.log('Merged report: coverage/merged/index.html')
