/**
 * Tournament templates: a whole tournament as a sequence of phases.
 *
 * A template does not create anything by itself — it describes what
 * comes after what. `templateplan.js` turns a step into concrete
 * phases once the previous ones have been played.
 *
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

/**
 * Two numbers shape every template, and the organiser sets them
 * before the first phase is drawn: how many rounds the qualifying
 * phases play, and how many teams a KO tournament holds.
 */
const OPTIONS = {
  rounds: { label: 'Vorrunden', min: 1, max: 15, default: 5 },
  kosize: { label: 'Teams pro KO-Turnier', values: [4, 8, 16, 32], default: 8 }
}

/**
 * Step kinds:
 *
 * - `groups`: split everyone into `groups` phases of the same
 *   system, seeded snake-wise so the groups are of equal strength.
 *   Played over `rounds` rounds.
 * - `top`: one phase for the best teams of every group phase of the
 *   previous step, seeded across the groups (A1, B1, A2, …), until
 *   it holds `kosize` teams.
 * - `rest`: one phase for everybody the previous step left over.
 * - `brackets`: the whole field, split into blocks of `kosize` by
 *   rank, each block playing its own phase (A, B, C, ...).
 */
const TEMPLATES = [
  {
    id: 'maastricht',
    name: 'Maastrichter System',
    description: 'Eine Vorrunde im Schweizer System, danach spielt je ' +
      'ein Feld nach Platzierung sein eigenes KO-Turnier: A, B, C … ' +
      'Jedes Team spielt also bis zum Schluss mit.',
    steps: [
      {
        kind: 'groups',
        groups: 1,
        system: 'swiss',
        names: ['Vorrunde'],
        label: 'Vorrunde auslosen',
        action: 'Vorrunde starten'
      },
      {
        kind: 'brackets',
        system: 'ko',
        label: 'KO-Turniere A, B, C … auslosen',
        action: 'KO-Phase starten'
      }
    ]
  },
  {
    id: 'groupsfinal',
    name: 'Vorrunde A/B mit Finale',
    description: 'Zwei Vorrundengruppen im Schweizer System, danach ' +
      'ein KO-Finale der Besten beider Gruppen und eine ' +
      'Platzierungsrunde für alle anderen.',
    steps: [
      {
        kind: 'groups',
        groups: 2,
        system: 'swiss',
        names: ['Vorrunde A', 'Vorrunde B'],
        label: 'Vorrunden A und B auslosen',
        action: 'Vorrunden starten'
      },
      {
        kind: 'top',
        system: 'ko',
        name: 'Finale',
        label: 'Finale auslosen',
        action: 'Finale starten'
      },
      {
        kind: 'rest',
        system: 'swiss',
        name: 'Platzierungsrunde',
        label: 'Platzierungsrunde für die übrigen Teams',
        action: 'Platzierungsrunde starten'
      }
    ]
  },
  {
    id: 'qualifyko',
    name: 'Vorrunde mit KO-Finale',
    description: 'Eine Vorrunde im Schweizer System, danach ein ' +
      'KO-Finale der Besten und eine Platzierungsrunde für alle ' +
      'anderen.',
    steps: [
      {
        kind: 'groups',
        groups: 1,
        system: 'swiss',
        names: ['Vorrunde'],
        label: 'Vorrunde auslosen',
        action: 'Vorrunde starten'
      },
      {
        kind: 'top',
        system: 'ko',
        name: 'Finale',
        label: 'Finale auslosen',
        action: 'Finale starten'
      },
      {
        kind: 'rest',
        system: 'swiss',
        name: 'Platzierungsrunde',
        label: 'Platzierungsrunde für die übrigen Teams',
        action: 'Platzierungsrunde starten'
      }
    ]
  }
]

/**
 * @param id a template id
 * @return the template, or undefined
 */
export function templateById (id) {
  return TEMPLATES.filter(function (template) {
    return template.id === id
  })[0]
}

/**
 * @param options
 *          a (possibly incomplete) set of options
 * @return the same options, with every missing value filled in
 */
export function withDefaults (options) {
  const complete = {}
  Object.keys(OPTIONS).forEach(function (name) {
    const value = options && options[name]
    complete[name] = value === undefined ? OPTIONS[name].default : value
  })
  return complete
}

export { OPTIONS }
export default TEMPLATES
