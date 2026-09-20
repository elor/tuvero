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
 * Step kinds:
 *
 * - `groups`: split everyone into `groups` phases of the same
 *   system, seeded snake-wise so the groups are of equal strength.
 * - `top`: one phase for the best `perGroup` of every group phase
 *   of the previous step, seeded across the groups (A1, B1, A2, …).
 * - `rest`: one phase for everybody the previous step left over.
 */
const TEMPLATES = [
  {
    id: 'groupsfinal',
    name: 'Vorrunde A/B mit Finale',
    description: 'Zwei Vorrundengruppen im Schweizer System, danach ' +
      'ein KO-Finale der besten Vier jeder Gruppe und eine ' +
      'Platzierungsrunde für alle anderen.',
    minteams: 8,
    steps: [
      {
        kind: 'groups',
        groups: 2,
        system: 'swiss',
        names: ['Vorrunde A', 'Vorrunde B'],
        label: 'Vorrunden A und B auslosen'
      },
      {
        kind: 'top',
        perGroup: 4,
        system: 'ko',
        name: 'Finale',
        label: 'Finale der besten Vier jeder Gruppe'
      },
      {
        kind: 'rest',
        system: 'swiss',
        name: 'Platzierungsrunde',
        label: 'Platzierungsrunde für die übrigen Teams'
      }
    ]
  },
  {
    id: 'groupsfinal8',
    name: 'Vorrunde A/B mit großem Finale',
    description: 'Wie oben, aber die besten Acht jeder Gruppe ' +
      'spielen das Finale aus.',
    minteams: 16,
    steps: [
      {
        kind: 'groups',
        groups: 2,
        system: 'swiss',
        names: ['Vorrunde A', 'Vorrunde B'],
        label: 'Vorrunden A und B auslosen'
      },
      {
        kind: 'top',
        perGroup: 8,
        system: 'ko',
        name: 'Finale',
        label: 'Finale der besten Acht jeder Gruppe'
      },
      {
        kind: 'rest',
        system: 'swiss',
        name: 'Platzierungsrunde',
        label: 'Platzierungsrunde für die übrigen Teams'
      }
    ]
  },
  {
    id: 'qualifyko',
    name: 'Vorrunde mit KO-Finale',
    description: 'Eine Vorrunde im Schweizer System, danach ein ' +
      'KO-Finale der besten Acht und eine Platzierungsrunde.',
    minteams: 8,
    steps: [
      {
        kind: 'groups',
        groups: 1,
        system: 'swiss',
        names: ['Vorrunde'],
        label: 'Vorrunde auslosen'
      },
      {
        kind: 'top',
        perGroup: 8,
        system: 'ko',
        name: 'Finale',
        label: 'KO-Finale der besten Acht'
      },
      {
        kind: 'rest',
        system: 'swiss',
        name: 'Platzierungsrunde',
        label: 'Platzierungsrunde für die übrigen Teams'
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

export default TEMPLATES
