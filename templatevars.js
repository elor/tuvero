import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { version } = require('./package.json')

// Per-variant values substituted into the Nunjucks page templates at build time.
// These replaced the hand-maintained differences between the three index.html files.
const variants = {
  basic: { variant: 'Basic', teamtext: 'Team', teamstext: 'Teams', teamsicon: 'teams', matchplace: 'Ort', matchplaces: 'Orte', teamsize: false },
  boule: { variant: 'Boule', teamtext: 'Spieler', teamstext: 'Spieler', teamsicon: 'teams3', matchplace: 'Bahn', matchplaces: 'Bahnen', teamsize: true },
  tac: { variant: 'TAC', teamtext: 'Team', teamstext: 'Teams', teamsicon: 'teams', matchplace: 'Tisch', matchplaces: 'Tische', teamsize: false }
}

export function templateVars (variant) {
  if (!variants[variant]) {
    throw new Error(`templateVars: unknown variant "${variant}"`)
  }
  return { ...variants[variant], version }
}

export default variants
