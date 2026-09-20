import { createRequire } from 'node:module'
import basicPresets from './basic/scripts/presets.js'
import boulePresets from './boule/scripts/presets.js'
import tacPresets from './tac/scripts/presets.js'

const require = createRequire(import.meta.url)
const { version } = require('./package.json')

// Per-variant values substituted into the Nunjucks page templates at build time.
// These replaced the hand-maintained differences between the three index.html files.
// `melee` mirrors the variant's presets: only variants that offer the
// system get the Supermêlée choice in the create dialog.

const variants = {
  basic: { variant: 'Basic', teamtext: 'Team', teamstext: 'Teams', teamsicon: 'teams', matchplace: 'Ort', matchplaces: 'Orte', teamsize: false, melee: !!basicPresets.systems.melee, teamnamefirst: false },
  boule: { variant: 'Boule', teamtext: 'Spieler', teamstext: 'Spieler', teamsicon: 'teams3', matchplace: 'Bahn', matchplaces: 'Bahnen', teamsize: true, melee: !!boulePresets.systems.melee, teamnamefirst: false },
  tac: { variant: 'TAC', teamtext: 'Team', teamstext: 'Teams', teamsicon: 'teams', matchplace: 'Tisch', matchplaces: 'Tische', teamsize: false, melee: !!tacPresets.systems.melee, teamnamefirst: true }
}

export function templateVars (variant) {
  if (!variants[variant]) {
    throw new Error(`templateVars: unknown variant "${variant}"`)
  }
  // mirrors Debug.isDevVersion (scripts/ui/debug.js): anything that is
  // not a plain release (or rc) counts as a dev build
  const isdev = !/^[0-9]+(\.[0-9]+)+(-rc[0-9]*)?$/.test(version)
  const buildtime = new Date().toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  return { ...variants[variant], version, isdev, buildtime }
}

export default variants
