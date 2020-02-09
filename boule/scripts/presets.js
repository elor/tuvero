/**
 * Boule presets: swiss as played in the PVO, round similar to chess, and ko
 * with a matched cadrage. Point-based rankings.
 *
 * @return Presets
 * @author Erik E. Lorenz <erik@tuvero.de>
 * @license MIT License
 * @see LICENSE
 */

define(function () {
  var Presets

  Presets = {
    target: 'boule',
    systems: {
      swiss: {
        ranking: ['wins', 'buchholz', 'finebuchholz', 'headtohead', 'saldo',
          'votes'
        ],
        mode: 'wins'
      },
      ko: {
        mode: 'matched'
      },
      round: {
        ranking: ['wins', 'sonneborn', 'headtohead', 'points']
      },
      placement: {},
      poules: {},
      formulex: {
        ranking: ['formulex', 'headtohead', 'votes'],
        mode: 'ranks'
      }
    },
    ranking: {
      components: ['buchholz', 'finebuchholz', 'points', 'saldo', 'sonneborn',
        'numgames', 'wins', 'headtohead', 'formulex'
      ]
    },
    registration: {
      defaultteamsize: 3,
      minteamsize: 1,
      maxteamsize: 3,
      teamsizeicon: true
    },
    names: {
      playernameurl: '',
      dbplayername: 'bouleplayers',
      apitoken: 'apitoken',
      teamsfile: 'tuvero-anmeldungen.txt'
    },
    ui: {
      rankingpoints: true
    }
  }

  return Presets
})
